import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import ResetPasswordIcon from "../../assets/SVGs/ResetPasswordIcon.svg";
import AuthLayout from "./components/AuthLayout";
import AuthHeading from "./components/AuthHeading";

const SignIn = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthLayout>
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white px-5 py-10 shadow-sm sm:px-6">
          {/* Heading */}
          <div className="mb-7">
            <AuthHeading
              heading="Set new password"
              subheading="Your new password must be different from your previous password."
            />
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-[#111111]"
              >
                New password
              </label>

              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-[#111111]"
              >
                Confirm password
              </label>

              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <Button
              icon={<img src={ResetPasswordIcon} alt="" />}
              iconPosition="right"
              className="mt-1 h-10 w-full rounded-xl text-sm font-medium"
            >
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
