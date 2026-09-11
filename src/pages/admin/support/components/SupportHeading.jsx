const SupportHeading = ({ heading, subheading }) => {
  return (
    <header className=" border-b color-border py-4">
      <h1 className="heading-lg text-tertiary">{heading}</h1>
      <p className=" text-muted">{subheading}</p>
    </header>
  );
};

export default SupportHeading;
