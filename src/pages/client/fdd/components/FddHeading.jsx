const FddHeading = ({ heading, subheading, emoji }) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">
          {heading} <span className="ml-1">{emoji}</span>
        </h1>
        <p className=" text-muted">{subheading}</p>
      </div>
    </header>
  );
};

export default FddHeading;
