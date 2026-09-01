const SettingsHeading = ({ heading, subheading }) => {
  return (
    <div>
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className=" text-muted">{subheading}</p>
    </div>
  );
};

export default SettingsHeading;
