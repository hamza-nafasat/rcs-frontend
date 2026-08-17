import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
// import GreaterIcon from "../../assets/SVGs/GreaterIcon.svg";
import AuthLayout from "./components/AuthLayout";
import AuthHeading from "./components/AuthHeading";

const Login = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full md:w-106.5 rounded-2xl bg-white px-5 py-10 shadow-sm sm:px-6">
          {/* Heading */}
          <div className="mb-7">
            <AuthHeading
              heading="Welcome back"
              subheading="Sign in to your RCS dashboard"
            />
          </div>
          {/* Form */}
          <form className="space-y-5">
            <div>
              <div className="relative">
                <Input
                  label="Email address"
                  id="new-password"
                  type="email"
                  placeholder="ahmed@rcs.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forget-password">
                <button className="text-sm font-medium text-primary hover:text-primary/10 cursor-pointer">
                  Forgot your password?
                </button>
              </Link>
            </div>

            <Button
              // icon={<img src={GreaterIcon} alt="" />}
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

export default Login;
