import { useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import Button from "../../shared/Button";
import ModeratorAddEditModal from "../../modals/ModeratorAddEditModal";
import { useCreateModeratorMutation } from "../../../store/apis/shared/moderator.apis";

const ModeratorHeading = ({ heading, subheading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createModerator, { isLoading: isCreating }] = useCreateModeratorMutation();

  const handleCreateModerator = async (formData, password) => {
    try {
      const response = await createModerator({ ...formData, password }).unwrap();
      toast.success(response?.message);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Create moderator error:", error);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className="text-muted">{subheading}</p>
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
          onSubmit={handleCreateModerator}
          isSubmitting={isCreating}
          mode="add"
        />
      )}
    </header>
  );
};

export default ModeratorHeading;
