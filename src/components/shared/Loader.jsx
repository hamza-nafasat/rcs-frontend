const Loader = ({ className = "" }) => {
  return (
    <div role="status" aria-label="Loading" className={`flex min-h-screen items-center justify-center ${className}`}>
      <span className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-(--color-primary) motion-safe:animate-spin" />
    </div>
  );
};

export default Loader;
