import AuthLayout from "./components/AuthLayout";
import CreateAccountForm from "./components/CreateAccountForm";

const CreateAccount = () => {
  return (
    <AuthLayout type="client">
      <section className="px-4 py-6 sm:px-6">
        <CreateAccountForm />
      </section>
    </AuthLayout>
  );
};

export default CreateAccount;
