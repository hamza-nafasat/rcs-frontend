const SettingsHeading = ({ heading, subheading }) => {
  return (
    <header>
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className=" text-muted">{subheading}</p>
    </header>
  );
};

export default SettingsHeading;
