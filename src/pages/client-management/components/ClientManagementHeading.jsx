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
    <div className="flex items-center justify-between gap-4">
      <div className="">
        <h1 className="heading-lg text-tertiary">
          {heading} <span className="ml-1">{emoji}</span>
        </h1>
        <p className=" text-muted">{subheading}</p>
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        iconPosition="left"
        icon={<Plus size={18} />}
        className="px-4! py-2.5!"
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
    </div>
  );
};

export default ClientManagementHeading;
