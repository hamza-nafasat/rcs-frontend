import Button from "../../../components/shared/Button";
import AuthHeading from "./components/AuthHeading";
import AuthLayout from "./components/AuthLayout";
import { Link, useLocation } from "react-router-dom";
import BackLink from "../../../components/shared/BackLink";
import CheckEmailIcon from "../../../assets/SVGs/CheckEmailIcon.svg";

const INBOX_URLS = {
  "gmail.com": "https://mail.google.com",
  "outlook.com": "https://outlook.live.com/mail",
  "hotmail.com": "https://outlook.live.com/mail",
  "live.com": "https://outlook.live.com/mail",
  "yahoo.com": "https://mail.yahoo.com",
  "icloud.com": "https://www.icloud.com/mail",
};

const CheckEmail = () => {
  const { state } = useLocation();

  // webmail inbox, else mail app
  const handleOpenEmail = () => {
    const domain = state?.email?.split("@")[1]?.toLowerCase();
    const inboxUrl = INBOX_URLS[domain];
    if (inboxUrl) window.open(inboxUrl, "_blank", "noopener,noreferrer");
    else window.location.href = "mailto:";
  };

  return (
    <AuthLayout>
      <article className="flex min-h-full items-center justify-center px-6">
        <div className="w-full max-w-106.5 rounded-2xl bg-white shadow-xs px-5 py-10 sm:px-6">
          {/* Heading */}
          <section className="flex flex-col items-center justify-center text-center ">
            <img src={CheckEmailIcon} alt="Check email" className="mb-4" />
            <AuthHeading
              heading="Check your email"
              subheading={
                <>
                  We've sent a password reset link to{" "}
                  <span className="wrap-break-word font-medium text-tertiary">{state?.email ?? "your email"}</span>.
                  Click the link in the email to reset your password.
                </>
              }
            />
          </section>

          <Button
            type="button"
            onClick={handleOpenEmail}
            iconPosition="right"
            className="h-10 w-full rounded-xl text-sm font-medium"
          >
            Open email app
          </Button>

          <section className="mt-6 text-center text-sm text-gray-500">
            Didn't receive the email?{" "}
            <Link to="/forget-password" className="font-medium text-primary hover:text-primary/10">
              Resend
            </Link>
          </section>
          <BackLink text="Back to sign in" to="/signin" className="mt-6" />
        </div>
      </article>
    </AuthLayout>
  );
};

export default CheckEmail;
