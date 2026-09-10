const SettingsCardHeading = ({ heading, subheading }) => {
  return (
    <header>
      <h2 className="card-heading">{heading}</h2>

      {subheading && <p className="card-subheading mt-1">{subheading}</p>}
    </header>
  );
};

export default SettingsCardHeading;
