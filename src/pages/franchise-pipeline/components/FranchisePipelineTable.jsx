import { MapPin } from "lucide-react";
import Avatar from "../../../components/shared/Avatar";
import Badge from "../../../components/shared/Badge";
import ProgressBar from "../../../components/shared/ProgressBar";
import DataTable from "react-data-table-component";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f97316";
  return "#dc2626";
};

const applicants = [
  {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@mail.com",
    avatar: "",
    franchise: "BrightSmile Dental",
    territory: "Austin, TX",
    stage: "Interview",
    score: 82,
    financial: "$250,000",
    submitted: "12 Aug 2026",
  },
  {
    name: "David Chen",
    email: "d.chen@mail.com",
    avatar: "",
    franchise: "UrbanFit Studios",
    territory: "Denver, CO",
    stage: "Screening",
    score: 64,
    financial: "$180,000",
    submitted: "10 Aug 2026",
  },
  {
    name: "Priya Nair",
    email: "priya.nair@mail.com",
    avatar: "",
    franchise: "GreenLeaf Cafe",
    territory: "Seattle, WA",
    stage: "Discovery Day",
    score: 91,
    financial: "$320,000",
    submitted: "08 Aug 2026",
  },
  {
    name: "Marcus Reid",
    email: "m.reid@mail.com",
    avatar: "",
    franchise: "QuickLube Auto",
    territory: "Phoenix, AZ",
    stage: "Applications",
    score: 38,
    financial: "$95,000",
    submitted: "05 Aug 2026",
  },
  {
    name: "Elena Duarte",
    email: "elena.duarte@mail.com",
    avatar: "",
    franchise: "BrightSmile Dental",
    territory: "Miami, FL",
    stage: "Approved",
    score: 88,
    financial: "$275,000",
    submitted: "02 Aug 2026",
  },
];

const columns = [
  {
    name: "Applicant",
    grow: 2,
    selector: (row) => row.name,
    cell: (row) => (
      <section className="flex items-center gap-3 py-2">
        <Avatar src={row.avatar} name={row.name} rounded="rounded-lg" />

        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </section>
    ),
  },
  {
    name: "Franchise",
    selector: (row) => row.franchise,
    sortable: true,
  },
  {
    name: "Territory",
    selector: (row) => row.territory,
    sortable: true,
    cell: (row) => (
      <section className="flex items-center gap-1.5">
        <MapPin size={16} className="shrink-0 text-gray-400" />
        <span>{row.territory}</span>
      </section>
    ),
  },
  {
    name: "Stage",
    selector: (row) => row.stage,
    sortable: true,
    cell: (row) => <Badge text={row.stage} />,
  },
  {
    name: "Score",
    selector: (row) => row.score,
    sortable: true,
    cell: (row) => (
      <section className="flex w-full flex-col gap-1.5 py-2">
        <ProgressBar value={row.score} color={scoreColor(row.score)} />
        <span className="text-xs text-gray-500">{row.score}%</span>
      </section>
    ),
  },
  {
    name: "Financial",
    selector: (row) => row.financial,
    sortable: true,
  },
  {
    name: "Submitted",
    selector: (row) => row.submitted,
    sortable: true,
  },
];

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f9fafb",
      borderBottomWidth: "1px",
      borderBottomColor: "#e5e7eb",
    },
  },
  headCells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      fontSize: "14px",
      fontWeight: 500,
      color: "#4b5563",
    },
  },
  cells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      fontSize: "14px",
      color: "#374151",
    },
  },
  rows: {
    style: {
      borderBottomColor: "#f3f4f6",
    },
  },
};

const FranchisePipelineTable = () => {
  return (
    <article className="flex flex-col gap-4">
      <h2 className="heading-lg text-tertiary">Applicant Scorecard</h2>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <DataTable
          columns={columns}
          data={applicants}
          customStyles={customStyles}
          pagination
          highlightOnHover
        />
      </section>
    </article>
  );
};

export default FranchisePipelineTable;
