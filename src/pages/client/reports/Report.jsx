import ReportHeading from "./components/ReportHeading";
import DetailedReport from "./components/DetailedReport";
import { recentApplicants } from "../dashboard/data/recentApplicants";

const Report = () => {
  return (
    <article className="flex flex-col gap-6">
      <ReportHeading
        heading="Pipeline Report"
        subheading="Bella Cucina · Generated August 4, 2026"
      />

      <DetailedReport applicants={recentApplicants} />
    </article>
  );
};

export default Report;
