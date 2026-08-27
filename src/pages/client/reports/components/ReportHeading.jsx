import { File } from "lucide-react";
import Button from "../../../../components/shared/Button";

const ReportHeading = ({ heading, subheading }) => {
    return (
      <section className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className=" text-muted">{subheading}</p>
      </div>
       <Button
             iconPosition="left"
             icon={<File size={18} />}
             className="shrink-0 text-sm whitespace-nowrap px-3! py-2! sm:px-4! sm:py-2.5! sm:text-base w-full sm:w-auto"
           >
            Download PDF Report
           </Button>
           </section>
    );
  };
  
  export default ReportHeading;