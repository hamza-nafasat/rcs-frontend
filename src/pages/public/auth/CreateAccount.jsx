import AuthLayout from "./components/AuthLayout";
import AuthCreateAccountForm from "./components/AuthCreateAccountForm";

const CreateAccount = () => {
  return (
    <AuthLayout type="client">
      <section className="px-4 py-6 sm:px-6">
        <AuthCreateAccountForm />
      </section>
    </AuthLayout>
  );
};

export default CreateAccount;
