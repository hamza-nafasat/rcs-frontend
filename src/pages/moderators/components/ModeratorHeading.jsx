const ModeratorHeading = ({ heading, subheading, text }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="">
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className=" text-muted">{subheading}</p>
      </div>

      <span className="ml-auto shrink-0 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary">
        {text}
      </span>
    </div>
  );
};

export default ModeratorHeading;
