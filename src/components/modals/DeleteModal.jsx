import { TriangleAlert, X } from "lucide-react";
import Button from "../shared/Button";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  heading = "Are you sure?",
  text = "This action cannot be undone.",
  cancelText = "Cancel",
  confirmText = "Remove",
  showClose = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-110 rounded-2xl bg-white p-6 shadow-xl">
        {/* Close */}
        {showClose && (
          <div className="flex justify-end">
            <button
              aria-label="Close dialog"
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moderator text-primary">
            {icon || <TriangleAlert size={26} />}
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-900">{heading}</h2>
          <p className="mt-2 text-sm text-gray-500">{text}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 sm:flex-row ">
          <Button
            type="button"
            onClick={onClose}
            className="w-1/2 bg-white! text-[#344054]! hover:bg-gray-50! border border-cancel px-3! py-2! sm:px-4! sm:py-2.5!"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className="w-1/2 px-3! py-2! sm:px-4! sm:py-2.5!"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
