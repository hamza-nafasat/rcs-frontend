import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crosshair } from "lucide-react";
import Button from "../../../../components/shared/Button";
import AuthHeading from "./AuthHeading";
import AuthApplicationNotice from "./AuthApplicationNotice";
import AuthApplicationFields from "./AuthApplicationFields";
import AuthLocationAssign from "./AuthLocationAssign";
import {
  EMPTY_APPLICATION,
  scoreApplication,
} from "../utils/applicationScore";

const AuthCreateAccountForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_APPLICATION);
  const [showNotice, setShowNotice] = useState(true);
  const scores = scoreApplication(form);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/client/dashboard");
  };

  return (
    <article className="w-full rounded-2xl bg-white px-5 py-6 shadow-xs sm:px-6">
      <header>
        <AuthHeading
          heading="Create Your Account"
          subheading="Sign Up to create your RCS dashboard"
          className="mb-3"
        />
        {showNotice && (
          <AuthApplicationNotice onDismiss={() => setShowNotice(false)} />
        )}
      </header>

      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthApplicationFields
          form={form}
          scores={scores}
          onChange={handleChange}
          onSelect={handleSelect}
        />

        {/* Territory drawing on real USA map */}
        <AuthLocationAssign
          onTerritoryChange={(geoPoints) => {
            // geoPoints is an array of { lat, lng } or null when cleared
            // Available for form submission in production
          }}
        />

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t color-border pt-4">
          <Button
            variant="bare"
            onClick={() => navigate("/signin")}
            className="h-10 rounded-xl border color-border bg-white px-4 text-sm font-medium text-cancel"
          >
            Back to Login
          </Button>

          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-remove">
              <Crosshair size={16} />
              Score: {scores.formatted.total}
            </p>
            <Button
              type="submit"
              className="h-10 rounded-xl px-5 text-sm font-medium"
            >
              Create Account
            </Button>
          </div>
        </footer>
      </form>
    </article>
  );
};

export default AuthCreateAccountForm;
