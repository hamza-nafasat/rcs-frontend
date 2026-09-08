import { MapPin } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";
import ProgressBar from "../../../../components/shared/ProgressBar";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { STAGE_COLORS } from "./scorecard/scorecardData";
import { initialApplicants } from "./pipelineApplicants";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f97316";
  return "#dc2626";
};

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
    width: "140px",
    cell: (row) => (
      <Badge
        text={row.stage}
        dotColor={STAGE_COLORS[row.stage]}
        className="text-white! w-full flex items-center justify-center"
      />
    ),
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

const emptyFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const FranchisePipelineTable = ({ filters = emptyFilters }) => {
  const navigate = useNavigate();
  const [applicants] = useState(initialApplicants);

  const filteredApplicants = applicants.filter((row) => {
    const applicantQuery = filters.applicant.trim().toLowerCase();
    const matchApplicant =
      row.name.toLowerCase().includes(applicantQuery) ||
      row.id.toLowerCase().includes(applicantQuery);

    const matchFranchise = row.franchise
      .toLowerCase()
      .includes(filters.franchise.trim().toLowerCase());

    const matchStage =
      filters.stage.length === 0 || filters.stage.includes(row.stage);

    const matchTerritory =
      filters.territory.length === 0 ||
      filters.territory.includes(row.territory);

    return matchApplicant && matchFranchise && matchStage && matchTerritory;
  });

  return (
    <article className="flex flex-col gap-4">
      <h2 className="heading-lg text-tertiary">Applicant Scorecard</h2>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <DataTable
          columns={columns}
          data={filteredApplicants}
          customStyles={customStyles}
          pagination
          highlightOnHover
          pointerOnHover
          onRowClicked={(row) => navigate(`/admin/dashboard/pipeline/${row.id}`)}
        />
      </section>
    </article>
  );
};

export default FranchisePipelineTable;
