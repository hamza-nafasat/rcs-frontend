import { useState } from "react";
import ModeratorHeading from "./ModeratorHeading";
import ModeratorFilter from "./ModeratorFilter";
import ModeratorTable from "./ModeratorTable";
import { useGetAllModeratorsQuery } from "../../../store/apis/shared/moderator.apis";

const initialFilters = {
  name: "",
  status: [],
};

const ModeratorsView = () => {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useGetAllModeratorsQuery();
  const moderators = data?.data ?? [];

  const filteredModerators = moderators.filter((mod) => {
    const matchName = String(mod?.fullName ?? "").toLowerCase().includes(filters.name.trim().toLowerCase());
    const matchStatus = filters.status.length === 0 || filters.status.includes(mod?.status);
    return matchName && matchStatus;
  });

  return (
    <section className="flex h-full min-h-0 flex-col">
      <ModeratorHeading heading="Moderators" subheading="Manage your moderators and their information" />

      <section className="mt-6">
        <ModeratorFilter filters={filters} setFilters={setFilters} />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <ModeratorTable moderators={filteredModerators} isLoading={isLoading} />
      </section>
    </section>
  );
};

export default ModeratorsView;
