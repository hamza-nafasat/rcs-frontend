import { useState } from "react";
import ModeratorHeading from "./components/ModeratorHeading";
import ModeratorTable from "./components/ModeratorTable";

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

const Moderators = () => {
  const [moderators, setModerators] = useState(initialModerators);

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

      <section className="mt-6 min-h-0 flex-1">
        <ModeratorTable moderators={moderators} setModerators={setModerators} />
      </section>
    </section>
  );
};

export default Moderators;
