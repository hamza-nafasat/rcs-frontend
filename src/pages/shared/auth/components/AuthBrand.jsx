import AuthBackground from "../../../../assets/SVGs/AuthBackground.svg";
import LogoCompany from "../../../../assets/SVGs/LogoCompany.svg";
import Badge from "../../../../components/shared/Badge";
import OrangeCircleIcon from "../../../../assets/SVGs/svg-components/OrangeCircleIcon";
import OrangeBarsIcon from "../../../../assets/SVGs/svg-components/OrangeBarsIcon";
import OrangeBriefcaseIcon from "../../../../assets/SVGs/svg-components/OrangeBriefcaseIcon";
import OrangeDocumentIcon from "../../../../assets/SVGs/svg-components/OrangeDocumentIcon";

const authContent = {
  client: {
    badge: "Franchise Lead & Approval Platform",

    heading: (
      <>
        Live pipelines.{" "}
        <span className="primary">Instant decisions.</span>
      </>
    ),

    description:
      "Every franchise applicant scored the moment they apply. Clients see their pipeline live, so nobody waits for a monthly report.",

    icons: [
      <OrangeCircleIcon />,
      <OrangeBarsIcon />,
      <OrangeBriefcaseIcon />,
      <OrangeDocumentIcon />,
    ],

    features: [
      "Live client dashboard with real time pipeline visibility",
      "Automated scoring across financial, experience, legal and market",
      "Export a report whenever you need one, not just at month end",
      "One RCS admin panel holding every client's pipeline",
    ],

    stats: [
      { label: "Restaurant Clients", value: "200+" },
      { label: "Revenue Generated", value: "$12M+" },
      { label: "Client Satisfaction", value: "98%" },
    ],
  },

  admin: {
    badge: "Enterprise Consulting Platform",

    heading: (
      <>
        Transform Restaurant Growth with{" "}
        <span className="primary">Intelligent Consulting</span>
      </>
    ),

    description:
      "Manage clients, consulting projects, reports, and business growth from one centralized platform built for restaurant consulting firms.",

    icons: [
      <OrangeCircleIcon />,
      <OrangeBarsIcon />,
      <OrangeBriefcaseIcon />,
      <OrangeDocumentIcon />,
    ],

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
};

const AuthBrand = ({ type = "client" }) => {
  const content = authContent[type] ?? authContent.client;

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
          <img src={LogoCompany} alt="Company logo" className="w-40" />

          <Badge text={content.badge} className="self-start" />

          <h1 className="heading-xl text-white">{content.heading}</h1>

          <p className="text-base text-muted">{content.description}</p>

          {/* Features */}
          <div className="mt-2 flex flex-col gap-4">
            {content.features.map((feature, index) => (
              <div key={feature} className="flex items-center gap-3">
                {/* icons */}
                <span className="flex h-6 w-6 items-center justify-center ">
                  {content.icons[index]}
                </span>
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
