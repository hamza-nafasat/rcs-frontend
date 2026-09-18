import { useState } from "react";
import ReportHeading from "./components/ReportHeading";
import DetailedReport from "./components/DetailedReport";
import Card from "../../../components/shared/Card";
import { useAuthUser } from "../../../routes/useAuthUser";
import { cardData, recentApplicants } from "./utils/data";

const toISODate = (submitted) => {
  const [month, day, year] = submitted.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const Reports = () => {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const { user } = useAuthUser();
  const generatedOn = new Date().toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDates((current) => ({ ...current, [name]: value }));
  };

  const applicants = recentApplicants.filter((row) => {
    const submitted = toISODate(row.submitted);
    if (dates.startDate && submitted < dates.startDate) return false;
    if (dates.endDate && submitted > dates.endDate) return false;
    return true;
  });

  return (
    <article className="flex flex-col gap-6">
      <ReportHeading
        heading="Pipeline Report"
        subheading={[user?.fullName, `Generated ${generatedOn}`].filter(Boolean).join(" · ")}
        dates={dates}
        onDateChange={handleDateChange}
      />

      <section className="sm:mt-6 gap-4 grid grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} className="h-full">
            <div className="flex flex-col gap-1 text-center">
              <h2 className="heading-lg" style={{ color: card.valueColor }}>
                {card.value}
              </h2>
              <p className="text-card-subheading">{card.label}</p>
            </div>
          </Card>
        ))}
      </section>

      <DetailedReport applicants={applicants} />
    </article>
  );
};

export default Reports;
