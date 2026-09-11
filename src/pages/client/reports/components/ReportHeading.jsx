import { FileSpreadsheet, FileText, ChevronDown, Download } from "lucide-react";
import Button from "../../../../components/shared/Button";
import Dropdown from "../../../../components/shared/Dropdown";
import DateField from "../../../../components/shared/DateField";

const ReportHeading = ({ heading, subheading, dates, onDateChange }) => {
  // TODO: wire exports once the reporting API lands
  const handleExportCsv = () => {};
  const handleExportPdf = () => {};

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      {/* Heading */}
      <header className="mr-auto">
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className="text-muted">{subheading}</p>
      </header>

      {/* Date range */}
      <section className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
        {/* <div className="min-w-0 flex-1 sm:w-40 sm:flex-none"> */}
        <DateField
          placeholder="Start Date"
          name="startDate"
          value={dates.startDate}
          onChange={onDateChange}
          max={dates.endDate || undefined}
        />
        {/* </div> */}
        {/* <div className="min-w-0 flex-1 sm:w-40 sm:flex-none"> */}
        <DateField
          placeholder="End Date"
          name="endDate"
          value={dates.endDate}
          onChange={onDateChange}
          min={dates.startDate || undefined}
        />
        {/* </div> */}
      </section>

      {/* Actions */}
      <section className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
        <Dropdown
          trigger={
            <Button
              variant="bare"
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-base border color-border text-secondary bg-white!"
              textClassName="flex items-center gap-2"
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} />
            </Button>
          }
        >
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex w-full items-center gap-3 border-b border-[#E5E7EB] px-5 py-4 text-left hover:bg-gray-50"
          >
            <FileSpreadsheet size={22} className="shrink-0 text-green-600" />

            <div>
              <p className="text-sm font-medium text-tertiary">Export CSV</p>
              <p className="text-sm text-[#6B7280]">Spreadsheet format</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-gray-50"
          >
            <FileText size={22} className="shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-medium text-tertiary">Export PDF</p>
              <p className="text-sm text-[#6B7280]">Printable report</p>
            </div>
          </button>
        </Dropdown>
      </section>
    </section>
  );
};

export default ReportHeading;
