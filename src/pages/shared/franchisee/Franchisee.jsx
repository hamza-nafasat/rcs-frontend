import { useState } from "react";
import { useAuthUser } from "../../../routes/useAuthUser";
import { getDashboardRole } from "../../../utils/roleHelper";
import { USER_ROLES } from "../../../configs/constants";
import FranchiseeHeading from "./components/FranchiseeHeading";
import FranchiseeFilter from "./components/FranchiseeFilter";
import FranchiseeTable from "./components/FranchiseeTable";
import FranchiseeDetailsModal from "./modals/FranchiseeDetailsModal";
import { useGetAllFranchiseesQuery } from "../../../store/apis/shared/franchisee.apis";

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

  const franchisees = data?.data ?? [];
  const clientOptions = [...new Set(franchisees.map((franchisee) => franchisee?.clientName).filter(Boolean))];

  const filteredFranchisees = franchisees.filter((franchisee) => {
    const name = `${franchisee?.firstName ?? ""} ${franchisee?.lastName ?? ""}`;
    const matchSearch = matches(name, filters.search) || matches(franchisee?.email, filters.search);
    const matchStatus = filters.status.length === 0 || filters.status.includes(franchisee?.franchiseStatus);
    const matchClient = filters.client.length === 0 || filters.client.includes(franchisee?.clientName);

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
