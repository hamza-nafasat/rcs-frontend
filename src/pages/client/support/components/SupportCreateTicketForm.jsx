import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import FileUpload from "../../../../components/shared/FileUpload";
import Button from "../../../../components/shared/Button";

const CATEGORY_OPTIONS = [
  "Technical Support",
  "Billing",
  "Account",
  "General",
];

const PRIORITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const SupportCreateTicketForm = ({
  form,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-xl border border-[#E5E7EB] bg-white p-7 shadow-sm"
    >
      {/* Subject */}
      <Input
        name="subject"
        label="Subject"
        placeholder="e.g. Payment gateway timeout on checkout step"
        value={form.subject}
        onChange={onChange}
      />

      {/* Category + Priority */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          name="category"
          label="Category"
          value={form.category}
          onChange={onChange}
          options={CATEGORY_OPTIONS}
          placeholder="Select category"
        />

        <Select
          name="priority"
          label="Priority"
          value={form.priority}
          onChange={onChange}
          options={PRIORITY_OPTIONS}
          placeholder="Select priority"
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <label className="mb-1 block text-sm font-medium text-tertiary">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Describe your issue in detail. Please include steps to reproduce, client website domain, and expected vs actual behavior."
          rows={6}
          className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-primary"
        />
      </div>

      {/* Attachment */}
      <div className="mt-5">
        <FileUpload
          label="Attachments (Optional)"
          accept=".pdf,.png,.jpg,.jpeg,.zip"
          hint="Supports PDF, PNG, JPG, ZIP up to 10MB"
          file={form.attachment}
          onFileChange={(file) =>
            onChange({
              target: {
                name: "attachment",
                value: file,
              },
            })
          }
        />
      </div>

      {/* Buttons */}
      <div className="mt-5 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm rounded cursor-pointer border border-gray-200 transition font-medium bg-transparent text-gray-500! hover:bg-gray-50"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm rounded cursor-pointer text-white btn-primary-gradient hover:opacity-90 transition font-medium shadow-sm"
        >
          Submit Ticket
        </Button>
      </div>
    </form>
  );
};

export default SupportCreateTicketForm;