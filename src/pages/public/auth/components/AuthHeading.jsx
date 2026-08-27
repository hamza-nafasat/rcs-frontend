const AuthHeading = ({ heading, subheading }) => {
  return (
    <div className="flex flex-col mb-6">
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className="text-muted text-sm">{subheading}</p>
    </div>
  );
};

export default AuthHeading;
