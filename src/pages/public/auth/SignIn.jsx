import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";

const SignIn = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full md:w-106.5 rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6 flex flex-col gap-1">
          {/* Heading */}
          <AuthHeading
            heading="Welcome back"
            subheading="Sign in to your RCS dashboard"
          />
          {/* Form */}
          <form className="flex flex-col gap-5">
            <Input
              label="Email address"
              id="email"
              type="email"
              placeholder="ahmed@rcs.com"
            />
            <Input
              label="Password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              isEyeButton={true}
              showConfirm={showConfirm}
              setShowConfirm={setShowConfirm}
            />

            <Link
              to="/forget-password"
              className="self-end text-sm font-medium text-primary hover:text-primary/10 hover:cursor-pointer bg-transparent hover:bg-transparent hover:underline"
            >
              Forgot your password
            </Link>

            <Button
              iconPosition="right"
              className="mt-1 h-10 w-full rounded-xl text-sm font-medium"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
