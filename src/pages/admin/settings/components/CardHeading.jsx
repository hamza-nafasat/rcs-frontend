const CardHeading = ({ heading, subheading }) => {
  return (
    <div>
      <h2 className="card-heading">{heading}</h2>

      {subheading && <p className="card-subheading mt-1">{subheading}</p>}
    </div>
  );
};

export default CardHeading;
