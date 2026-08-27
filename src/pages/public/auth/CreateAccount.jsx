import AuthLayout from "./components/AuthLayout";
import CreateAccountForm from "./components/CreateAccountForm";

const CreateAccount = () => {
  return (
    <AuthLayout type="client">
      <div className="px-4 py-6 sm:px-6">
        <CreateAccountForm />
      </div>
    </AuthLayout>
  );
};

export default CreateAccount;
