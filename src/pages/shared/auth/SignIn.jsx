import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import { useLoginMutation } from "../../../store/apis/shared/auth.apis";
import { ROLE_HOME } from "../../../configs/constants";

const SignIn = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await login(formData).unwrap();
      navigate(ROLE_HOME[result?.data?.role] ?? "/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full md:w-106.5 rounded-2xl bg-white px-5 py-10 shadow-xs sm:px-6 flex flex-col gap-1">
          {/* Heading */}
          <AuthHeading heading="Welcome back" subheading="Sign in to your RCS dashboard" />
          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              placeholder="ahmed@rcs.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
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
              type="submit"
              disabled={isLoading}
              iconPosition="right"
              className="mt-1 h-10 w-full rounded-xl text-sm font-medium"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
