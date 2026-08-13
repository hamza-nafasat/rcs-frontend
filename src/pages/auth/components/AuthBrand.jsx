import AuthBackground from "../../../assets/SVGs/AuthBackground.svg";
import Logo from "../../../assets/SVGs/Logo.svg";
import Badge from "../../../components/shared/Badge";
import BadgeIcon from "../../../assets/SVGs/BadgeIcon.svg";

const authContent = {
  client: {
    badge: "Client Consulting Platform",

    heading: (
      <>
        Transform Restaurant Growth with{" "}
        <span className="primary">Intelligent Consulting</span>
      </>
    ),

    description:
      "Manage clients, consulting projects, reports, and business growth from one centralized platform built for restaurant consulting firms.",

    features: [
      "CRM & Client Success Management",
      "Revenue Analytics & Performance Tracking",
      "Consulting Project & Milestone Management",
      "Automated Invoicing & Document Control",
    ],

    stats: [
      { label: "Restaurant Clients", value: "200+" },
      { label: "Revenue Generated", value: "$12M+" },
      { label: "Client Satisfaction", value: "98%" },
    ],
  },

  admin: {
    badge: "Admin Management Platform",

    heading: (
      <>
        Manage Your Platform with{" "}
        <span className="primary">Complete Control</span>
      </>
    ),

    description:
      "Manage users, permissions, reports, and platform operations from one centralized admin dashboard.",

    features: [
      "User & Role Management",
      "Platform Performance Analytics",
      "Reports & Business Insights",
      "System & Access Control",
    ],

    stats: [
      { label: "Active Users", value: "500+" },
      { label: "Projects Managed", value: "150+" },
      { label: "System Uptime", value: "99.9%" },
    ],
  },
};

const AuthBrand = ({ type = "client" }) => {
  const content = authContent[type];

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

          <Badge text={content.badge} className="self-start" />

          <h1 className="heading-xl text-white">{content.heading}</h1>

          <p className="text-base text-muted">{content.description}</p>

          {/* Features */}
          <div className="mt-2 flex flex-col gap-4">
            {content.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <img src={BadgeIcon} alt="" />

                <span className="text-muted">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-auto grid grid-cols-1 gap-4 pt-8 md:grid-cols-3">
          {content.stats.map((stat) => (
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
