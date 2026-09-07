const FranchiseeHeading = ({ heading, subheading, className = "" }) => {
  return (
    <div className={className}>
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className=" text-muted">{subheading}</p>
    </div>
  );
};

export default FranchiseeHeading;
