import AuthBrand from "./AuthBrand";

const AuthLayout = ({ children, type = "admin" }) => {
  return (
    // the form takes the larger share
    <div className="flex min-h-screen bg-active ">
      <section className="hidden shrink-0 lg:block lg:w-2/5">
        <AuthBrand type={type} />
      </section>

      <main className="h-screen w-full overflow-y-auto lg:w-3/5">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
