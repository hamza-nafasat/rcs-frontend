import ReportHeading from "./components/ReportHeading";
import ApprovalRate from "./components/ApprovalRate";
import TopScore from "./components/TopScore";
import DisqualifyingFlags from "./components/DisqualifyingFlags";
import DetailedReport from "./components/DetailedReport";
import { recentApplicants } from "../dashboard/data/recentApplicants";

const Report = () => {
  return (
    <article className="flex flex-col gap-6">
      <ReportHeading
        heading="Pipeline Report"
        subheading="Bella Cucina · Generated August 4, 2026"
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ApprovalRate applicants={recentApplicants} />
        <TopScore applicants={recentApplicants} />
        <DisqualifyingFlags />
      </section>

      <DetailedReport applicants={recentApplicants} />
    </article>
  );
};

export default Report;
