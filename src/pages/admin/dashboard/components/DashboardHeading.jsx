const DashboardHeading = ({ heading, subheading, emoji, className = "" }) => {
  return (
    <header className={className}>
      <h1 className="heading-lg text-tertiary">
        {heading} <span className="ml-1">{emoji}</span>
      </h1>
      <p className=" text-muted">{subheading}</p>
    </header>
  );
};

export default DashboardHeading;
