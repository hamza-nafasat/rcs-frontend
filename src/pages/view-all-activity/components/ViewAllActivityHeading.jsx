const ViewAllActivityHeading = ({ heading, subheading }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className=" text-muted">{subheading}</p>
      </div>
    </div>
  );
};

export default ViewAllActivityHeading;
