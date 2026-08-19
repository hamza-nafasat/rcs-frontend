import { Plus } from "lucide-react";
import Button from "../../../components/shared/Button";
import { useState } from "react";
import AddFddModal from "./AddFddModal";

const FddHeading = ({ heading, subheading, emoji, onAddModerator }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddModerator = (formData) => {
    onAddModerator?.(formData);
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
        Add FDD Document
      </Button>

      {isModalOpen && (
        <AddFddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddModerator}
          mode="add"
        />
      )}
    </div>
  );
};

export default FddHeading;
