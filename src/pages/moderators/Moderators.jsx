import ModeratorHeading from "./components/ModeratorHeading";
import ModeratorTable from "./components/ModeratorTable";

const Moderators = () => {
  return (
    <section className="bg-white p-6 rounded-2xl border color-border">
      <div className="">
        <ModeratorHeading
          heading="Moderators"
          subheading="Manage your moderators and their information"
          text="4 Members"
        />

        <div className="mt-6">
          <ModeratorTable />
        </div>
      </div>
    </section>
  );
};

export default Moderators;
