const AuthHeading = ({ heading, subheading, className = "mb-6" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className="text-muted text-sm">{subheading}</p>
    </div>
  );
};

export default AuthHeading;
