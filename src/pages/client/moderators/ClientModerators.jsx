import { useState } from "react";
import ModeratorHeading from "./components/ModeratorHeading";
import ModeratorTable from "./components/ModeratorTable";
import ModeratorFilter from "../../../components/global/moderators/ModeratorFilter";
import { initialModerators } from "./utils/data";

const initialFilters = {
  name: "",
  role: [],
  status: [],
};

const ClientModerators = () => {
  const [moderators, setModerators] = useState(initialModerators);
  const [filters, setFilters] = useState(initialFilters);

  // these lists will come from the backend later
  const roles = [...new Set(moderators.map((mod) => mod.role))];
  const statuses = [...new Set(moderators.map((mod) => mod.status))];

  const filteredModerators = moderators.filter((mod) => {
    const matchName = mod.name
      .toLowerCase()
      .includes(filters.name.trim().toLowerCase());

    const matchRole =
      filters.role.length === 0 || filters.role.includes(mod.role);

    const matchStatus =
      filters.status.length === 0 || filters.status.includes(mod.status);

    return matchName && matchRole && matchStatus;
  });

  const handleAddModerator = (formData) => {
    setModerators((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        joined: "Added just now",
      },
    ]);
  };

  return (
    <section className="flex h-full min-h-0 flex-col">
      <ModeratorHeading
        heading="Moderators"
        subheading="Manage your moderators and their information"
        text={`${moderators.length} Members`}
        onAddModerator={handleAddModerator}
      />

      <section className="mt-6">
        <ModeratorFilter
          filters={filters}
          setFilters={setFilters}
          roles={roles}
          statuses={statuses}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <ModeratorTable
          moderators={filteredModerators}
          setModerators={setModerators}
        />
      </section>
    </section>
  );
};

export default ClientModerators;
