import { Plus } from "lucide-react";
import Button from "../../../../components/shared/Button";
import { useState } from "react";
import ModeratorAddEditModal from "../../../../components/modals/ModeratorAddEditModal";


const ModeratorHeading = ({ heading, subheading, emoji, onAddModerator }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddModerator = (formData) => {
    onAddModerator?.(formData);
    setIsModalOpen(false);
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">
          {heading} <span className="ml-1">{emoji}</span>
        </h1>
        <p className=" text-muted">{subheading}</p>
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        iconPosition="left"
        icon={<Plus size={18} />}
        className="shrink-0 text-sm whitespace-nowrap px-3! py-2! sm:px-4! sm:py-2.5! sm:text-base w-full sm:w-auto"
      >
        Add Moderator
      </Button>

      {isModalOpen && (
        <ModeratorAddEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddModerator}
          mode="add"
        />
      )}
    </header>
  );
};

export default ModeratorHeading;
