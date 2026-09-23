import { useState } from "react";
import FranchiseeHeading from "./components/FranchiseeHeading";
import FranchiseeFilter from "./components/FranchiseeFilter";
import FranchiseeTable from "./components/FranchiseeTable";
import FranchiseeDetailsModal from "./modals/FranchiseeDetailsModal";
import { useGetAllFranchiseesQuery } from "../../../store/apis/client/franchisee.apis";

const initialFilters = { search: "", status: [] };

const matches = (value, query) => String(value ?? "").toLowerCase().includes(query.trim().toLowerCase());

const Franchisee = () => {
  const { data, isLoading } = useGetAllFranchiseesQuery();
  const [filters, setFilters] = useState(initialFilters);
  const [franchiseeToView, setFranchiseeToView] = useState(null);

  const franchisees = data?.data ?? [];

  const filteredFranchisees = franchisees.filter((franchisee) => {
    const name = `${franchisee?.firstName ?? ""} ${franchisee?.lastName ?? ""}`;
    const matchSearch = matches(name, filters.search) || matches(franchisee?.email, filters.search);
    const matchStatus = filters.status.length === 0 || filters.status.includes(franchisee?.franchiseStatus);

    return matchSearch && matchStatus;
  });

  return (
    <article>
      <FranchiseeHeading
        className="fade-up"
        heading="Franchisee Management"
        subheading="Applicants who applied through your website."
      />

      <FranchiseeFilter className="mt-6" filters={filters} setFilters={setFilters} />

      <FranchiseeTable
        className="mt-5"
        franchisees={filteredFranchisees}
        isLoading={isLoading}
        onView={setFranchiseeToView}
      />

      <FranchiseeDetailsModal
        isOpen={Boolean(franchiseeToView)}
        onClose={() => setFranchiseeToView(null)}
        franchiseeId={franchiseeToView?._id}
      />
    </article>
  );
};

export default Franchisee;
