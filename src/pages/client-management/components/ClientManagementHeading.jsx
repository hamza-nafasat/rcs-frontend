import { Plus } from "lucide-react";
import Button from "../../../components/shared/Button";
import AddEditClientModal from "./AddEditClientModal";
import { useState } from "react";

const ClientManagementHeading = ({ heading, subheading, emoji }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddClient = (clientData) => {
    console.log("New client data:", clientData);
    setIsModalOpen(false);
  };
  return (
    <section className="flex items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">
          {heading} <span className="ml-1">{emoji}</span>
        </h1>
        <p className="text-muted">{subheading}</p>
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        iconPosition="left"
        icon={<Plus size={22} className="sm:size-4.5" />}
        aria-label="Add Client"
        textClassName="hidden sm:inline"
        className="h-12! w-12! min-w-12 shrink-0 rounded-full! p-0! whitespace-nowrap shadow-lg shadow-(--color-primary)/30 sm:h-auto! sm:w-auto! sm:min-w-0 sm:rounded-xl! sm:px-4! sm:py-2.5! sm:shadow-none"
      >
        Add Client
      </Button>

      {isModalOpen && (
        <AddEditClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddClient}
          mode="add"
        />
      )}
    </section>
  );
};

export default ClientManagementHeading;
