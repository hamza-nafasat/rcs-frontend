import Card from "../../../components/shared/Card";
import UserDashboardHeading from "./components/UserDashboardHeading";
import UserDonutChart from "./components/UserDonutChart";

const UserDashboard = () => {
  return (
    <article className="flex flex-col gap-4">
      <UserDashboardHeading
        className="fade-up"
        emoji="👋"
        heading="Good morning, Marco"
        subheading="Monday, August 27, 2026 · You had 0 leads yesterday and 8 messages awaiting response."
      />

      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "440ms" }}
      >

        <Card className="h-full lg:col-span-2">
          <UserDashboardHeading heading="Pipeline by Stage" />
          <UserDonutChart
            labels={["Approved", "Denied", "Pending"]}
            data={[25, 20, 15]}
            colors={["#047857", "#DC2626", "#EAB308"]}
          />
        </Card>
      </section>
    </article>
  );
};

export default UserDashboard;
