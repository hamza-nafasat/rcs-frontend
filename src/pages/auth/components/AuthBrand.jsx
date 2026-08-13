import AuthBackground from "../../../assets/SVGs/AuthBackground.svg";
import Logo from "../../../assets/SVGs/Logo.svg";

import Badge from "../../../components/shared/Badge";
import BadgeIcon from "../../../assets/SVGs/BadgeIcon.svg";
const AuthBrand = () => {
  const features = [
    { icon: BadgeIcon, text: "CRM & Client Success Management" },
    { icon: BadgeIcon, text: "Revenue Analytics & Performance Tracking" },
    { icon: BadgeIcon, text: "Consulting Project & Milestone Management" },
    { icon: BadgeIcon, text: "Automated Invoicing & Document Control" },
  ];

  const stats = [
    { label: "Restaurant Clients", value: "200+" },
    { label: "Revenue Generated", value: "$12M+" },
    { label: "Client Satisfaction", value: "98%" },
  ];
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <img
        src={AuthBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-12 py-16">
        {/* Top Content */}
        <div className="flex flex-col gap-6">
          <img src={Logo} alt="Company logo" className="w-40" />

          <Badge text="Employee Consulting Platform" className="self-start" />

          <h1 className="heading-xl text-white">
            Transform Restaurant Growth with{" "}
            <span className="primary">Intelligent Consulting</span>
          </h1>

          <p className="text-base text-muted">
            Manage clients, consulting projects, reports, and business growth
            from one centralized platform built for restaurant consulting firms.
          </p>

          {/* Features */}
          <div className="mt-2 flex flex-col gap-4">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <img src={feature.icon} alt="" />

                <span className="text-muted">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-auto grid grid-cols-1 gap-4 pt-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-start">
              <p className="text-2xl font-bold text-white">{stat.value}</p>

              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthBrand;
