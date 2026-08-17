// import { Link } from "react-router-dom";

const DashboardNotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg rounded-2xl border border-dashed border-(--color-border) bg-white p-8 text-center shadow-sm">
        <p className="mb-2 heading-xl">404</p>
        <h2 className="text-2xl font-semibold text-[#111111]">
          Page not found
        </h2>
        <p className="mt-3  text-secondary">
          The page you’re looking for doesn’t exist in this dashboard yet.
        </p>
        {/* <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary"
        >
          Back to dashboard
        </Link> */}
      </div>
    </div>
  );
};

export default DashboardNotFound;
