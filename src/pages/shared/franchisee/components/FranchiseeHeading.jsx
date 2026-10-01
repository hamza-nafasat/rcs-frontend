const FranchiseeHeading = ({ heading, subheading, className = "" }) => {
  return (
    <header className={className}>
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className=" text-muted">{subheading}</p>
    </header>
  );
};

export default FranchiseeHeading;
