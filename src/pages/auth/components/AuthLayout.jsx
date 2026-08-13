import AuthBrand from "./AuthBrand";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 shrink-0 lg:block">
        <AuthBrand type="client" />
      </section>

      <main className="flex w-full items-center justify-center lg:w-1/2">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
