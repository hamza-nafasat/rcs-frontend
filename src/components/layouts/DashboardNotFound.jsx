import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  FileQuestion,
  Sparkles,
} from "lucide-react";

const DashboardNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-orange-400/20 via-amber-300/15 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute bottom-0 right-10 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl" />

      {/* Main Content Card */}
      <div className="fade-up relative z-10 w-full max-w-3xl rounded-3xl sm:p-12 text-center">
        {/* 404 Hero Illustration & Badge */}
        <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center">
          {/* Animated Outer Glow */}
          <div className="absolute inset-0 animate-pulse rounded-full bg-orange-400/20 duration-1000" />
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-400/20 blur-md" />

          {/* Center Glass Display */}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-orange-200/60 bg-gradient-to-b from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 text-white">
            <div className="flex flex-col items-center justify-center">
              <Compass className="h-10 w-10 text-orange-100 mb-1 opacity-90 transition-transform duration-700 hover:rotate-180" />
              <span className="text-3xl font-black tracking-tight drop-shadow-sm">
                404
              </span>
            </div>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-amber-100 text-amber-600 shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="absolute -bottom-1 -left-1 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-orange-100 text-orange-600 shadow-md">
            <FileQuestion className="h-4 w-4" />
          </div>
        </div>

        {/* Text Content */}
        <div className="mx-auto max-w-lg">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 border border-orange-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            Error 404
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Page Not Found
          </h1>

          <p className="mt-3 text-base leading-relaxed text-gray-600">
            We couldn't find the page you're looking for. The link might be
            broken, or the page may have been moved.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotFound;

