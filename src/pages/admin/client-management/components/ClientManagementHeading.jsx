import { Plus } from "lucide-react";
import Button from "../../../../components/shared/Button";
import ClientAddEditModal from "../modals/ClientAddEditModal";
import { useState } from "react";

const ClientManagementHeading = ({ heading, subheading, emoji }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddClient = (clientData) => {
    console.log("New client data:", clientData);
    setIsModalOpen(false);
  };
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">
          {heading} <span className="ml-1">{emoji}</span>
        </h1>
        <p className="text-muted">{subheading}</p>
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        iconPosition="left"
        icon={<Plus size={18} />}
        className="shrink-0 text-sm whitespace-nowrap px-3! py-2! sm:px-4! sm:py-2.5! sm:text-base w-full sm:w-auto"
      >
        Add Client
      </Button>

      {isModalOpen && (
        <ClientAddEditModal
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
