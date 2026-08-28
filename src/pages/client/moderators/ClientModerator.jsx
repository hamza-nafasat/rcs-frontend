import { useState } from "react";
import ClientModeratorHeading from "./components/ClientModeratorHeading";
import ClientModeratorTable from "./components/ClientModeratorTable";
import ClientModeratorFilter from "./components/ClientModeratorFilter";

const initialModerators = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    status: "Owner",
    role: "Account Owner",
    joined: "Added 2 days ago",
  },
  {
    id: 2,
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    status: "Active",
    role: "Moderator",
    joined: "Added 1 week ago",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    status: "Pending",
    role: "Moderator",
    joined: "Invited 3 days ago",
  },
  {
    id: 4,
    name: "David Okafor",
    email: "david.okafor@example.com",
    status: "Active",
    role: "Moderator",
    joined: "Added 1 month ago",
  },
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    status: "Owner",
    role: "Account Owner",
    joined: "Added 2 days ago",
  },
  {
    id: 2,
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    status: "Active",
    role: "Moderator",
    joined: "Added 1 week ago",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    status: "Pending",
    role: "Moderator",
    joined: "Invited 3 days ago",
  },
  {
    id: 4,
    name: "David Okafor",
    email: "david.okafor@example.com",
    status: "Active",
    role: "Moderator",
    joined: "Added 1 month ago",
  },
];
const initialFilters = {
  name: "",
  role: [],
  status: [],
};

const ClientModerator = () => {
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
      <ClientModeratorHeading
        heading="Moderators"
        subheading="Manage your moderators and their information"
        text={`${moderators.length} Members`}
        onAddModerator={handleAddModerator}
      />

      <section className="mt-6">
        <ClientModeratorFilter
          filters={filters}
          setFilters={setFilters}
          roles={roles}
          statuses={statuses}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <ClientModeratorTable
          moderators={filteredModerators}
          setModerators={setModerators}
        />
      </section>
    </section>
  );
};

export default ClientModerator;
