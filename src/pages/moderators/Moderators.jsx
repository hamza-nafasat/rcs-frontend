import ModeratorHeading from "./components/ModeratorHeading";
import InvitationByEmail from "./components/InvitationByEmail";
import UserList from "./components/UserList";

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
          <InvitationByEmail />
        </div>
        <div className="mt-6">
          <UserList />
        </div>
      </div>
    </section>
  );
};

export default Moderators;
