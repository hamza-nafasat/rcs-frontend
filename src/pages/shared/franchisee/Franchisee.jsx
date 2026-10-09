import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useAuthUser } from "../../../routes/useAuthUser";
import { getDashboardRole } from "../../../utils/roleHelper";
import { USER_ROLES, USER_STATUSES } from "../../../configs/constants";
import FranchiseeHeading from "./components/FranchiseeHeading";
import FranchiseeFilter from "./components/FranchiseeFilter";
import FranchiseeTable from "./components/FranchiseeTable";
import FranchiseeDetailsModal from "./modals/FranchiseeDetailsModal";
import FranchiseeFddModal from "./modals/FranchiseeFddModal";
import { franchiseeApi, useGetAllFranchiseesQuery } from "../../../store/apis/shared/franchisee.apis";
import { useResetFddFillMutation, useReviewFddFillMutation } from "../../../store/apis/shared/fdd.apis";
import { downloadFile } from "../../../utils/downloadFile";
import { useGetAllClientsQuery } from "../../../store/apis/admin/client.apis";

// how an account status reads
const ACCOUNT_STATUS = {
  [USER_STATUSES.ACTIVE]: { label: "Active", color: "#16A34A", bg: "#F0FDF4" },
  [USER_STATUSES.INACTIVE]: { label: "Inactive", color: "#6B7280", bg: "#F3F4F6" },
};

const initialFilters = { search: "", status: [], client: [] };

const matches = (value, query) =>
  String(value ?? "")
    .toLowerCase()
    .includes(query.trim().toLowerCase());

const Franchisee = () => {
  const { user } = useAuthUser();
  const isAdmin = getDashboardRole(user) === USER_ROLES.ADMIN;
  const { data, isLoading } = useGetAllFranchiseesQuery();
  const [filters, setFilters] = useState(initialFilters);
  const [franchiseeToView, setFranchiseeToView] = useState(null);
  const [fddToReview, setFddToReview] = useState(null);
  const dispatch = useDispatch();
  const [reviewFddFill, { isLoading: isReviewing }] = useReviewFddFillMutation();
  const [resetFddFill, { isLoading: isResetting }] = useResetFddFillMutation();

  const franchisees = data?.data ?? [];

  // the list carries the signed copy, so refetch it
  const refreshFranchisees = () => dispatch(franchiseeApi.util.invalidateTags(["Franchisees", "singleFranchisee"]));

  const handleReview = async (reviewStatus) => {
    try {
      const response = await reviewFddFill({ fillId: fddToReview?.fddWait?._id, reviewStatus }).unwrap();
      toast.success(response?.message);
      refreshFranchisees();
      setFddToReview(null);
    } catch (error) {
      console.error("Review signed FDD error:", error);
    }
  };

  const handleAskRefill = async () => {
    try {
      const response = await resetFddFill(fddToReview?.fddWait?._id).unwrap();
      toast.success(response?.message);
      refreshFranchisees();
      setFddToReview(null);
    } catch (error) {
      console.error("Ask refill error:", error);
    }
  };

  const handleDownloadSigned = async (wait) => {
    try {
      await downloadFile(wait?.file?.url, wait?.file?.name ?? "signed-fdd.pdf");
    } catch (error) {
      console.error("Download signed FDD error:", error);
    }
  };
  const { data: clientData } = useGetAllClientsQuery(undefined, { skip: !isAdmin });

  // signed up clients only
  const clientOptions = (clientData?.data ?? [])
    .filter((client) => client?.account?.status !== USER_STATUSES.INVITED)
    .map((client) => {
      return {
        value: client?.account?._id,
        label: client?.account?.fullName,
        description: client?.account?.email,
        status: ACCOUNT_STATUS[client?.account?.status] ?? ACCOUNT_STATUS[USER_STATUSES.INACTIVE],
      };
    });

  const filteredFranchisees = franchisees.filter((franchisee) => {
    const name = `${franchisee?.firstName ?? ""} ${franchisee?.lastName ?? ""}`;
    const matchSearch = matches(name, filters.search) || matches(franchisee?.email, filters.search);
    const matchStatus = filters.status.length === 0 || filters.status.includes(franchisee?.franchiseStatus);
    const matchClient = filters.client.length === 0 || filters.client.includes(franchisee?.franchiser);

    return matchSearch && matchStatus && matchClient;
  });

  return (
    <article>
      <FranchiseeHeading
        className="fade-up"
        heading="Franchisee Management"
        subheading={isAdmin ? "Applicants across every client." : "Applicants who applied through your website."}
      />

      <FranchiseeFilter
        className="mt-6"
        filters={filters}
        setFilters={setFilters}
        clientOptions={isAdmin ? clientOptions : null}
      />

      <FranchiseeTable
        className="mt-5"
        franchisees={filteredFranchisees}
        isLoading={isLoading}
        showClient={isAdmin}
        onView={setFranchiseeToView}
        onViewFdd={setFddToReview}
      />

      <FranchiseeFddModal
        isOpen={Boolean(fddToReview)}
        onClose={() => setFddToReview(null)}
        franchisee={fddToReview}
        isSaving={isReviewing || isResetting}
        onReview={handleReview}
        onAskRefill={handleAskRefill}
        onDownload={handleDownloadSigned}
      />

      <FranchiseeDetailsModal
        isOpen={Boolean(franchiseeToView)}
        onClose={() => setFranchiseeToView(null)}
        franchiseeId={franchiseeToView?._id}
        showClient={isAdmin}
      />
    </article>
  );
};

export default Franchisee;
