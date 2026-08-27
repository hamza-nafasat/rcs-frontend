import AuthBrand from "./AuthBrand";

const AuthLayout = ({ children, type = "admin" }) => {
  return (
    <div className="flex min-h-screen bg-active ">
      <section className="hidden w-1/2 shrink-0 lg:block">
        <AuthBrand type={type} />
      </section>

      <main className="flex w-full items-center justify-center lg:w-1/2">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
