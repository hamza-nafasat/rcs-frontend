// a grey block while data loads
const Skeleton = ({ className = "" }) => (
  <span aria-hidden="true" className={`block rounded-lg bg-gray-200/80 motion-safe:animate-pulse ${className}`} />
);

export default Skeleton;
