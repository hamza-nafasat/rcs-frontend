import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/shared/Button";
import Loader from "../../../components/shared/Loader";
import AuthLayout from "./components/AuthLayout";
import AuthHeading from "./components/AuthHeading";
import AuthCreateAccountForm from "./components/AuthCreateAccountForm";
import { useVerifyInviteQuery } from "../../../store/apis/shared/auth.apis";

const CreateAccount = () => {
  const navigate = useNavigate();
  // token comes from the link in the invite email
  const { inviteToken } = useParams();
  const { data, isLoading, error } = useVerifyInviteQuery(inviteToken);

  if (isLoading) return <Loader />;

  return (
    <AuthLayout type="client">
      <section className="px-4 py-6 sm:px-6">
        {error ? (
          <article className="w-full rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6">
            <AuthHeading
              heading="This invite can't be used"
              subheading={error?.data?.message ?? "Unable to reach the server, please try again"}
            />
            <Button
              type="button"
              onClick={() => navigate("/signin")}
              className="h-10 w-full rounded-xl text-sm font-medium"
            >
              Back to Login
            </Button>
          </article>
        ) : (
          <AuthCreateAccountForm inviteToken={inviteToken} invite={data?.data} />
        )}
      </section>
    </AuthLayout>
  );
};

export default CreateAccount;
