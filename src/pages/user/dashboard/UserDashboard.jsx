import UserDashboardHeading from "./components/UserDashboardHeading";

const UserDashboard = () => {
  return (
    <article className="flex flex-col gap-4">
      <UserDashboardHeading
        className="fade-up"
        emoji="👋"
        heading="Good morning, Marco"
        subheading="Monday, August 27, 2026 · You had 0 leads yesterday and 8 messages awaiting response."
      />
    </article>
  );
};

export default UserDashboard;
