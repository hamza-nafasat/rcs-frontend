import { MapPin } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import ProgressBar from "../../../../components/shared/ProgressBar";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { initialApplicants } from "../../../admin/pipeline/components/pipelineApplicants";
import UserPipelineStageOverview from "./UserPipelineStageOverview";
import UserApplicantScorecardSection from "./UserApplicantScorecardSection";
import UploadedDocumentsSection from "./UploadedDocumentsSection";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f97316";
  return "#dc2626";
};

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

const UserFranchisePipelineTable = () => {
  const [applicants] = useState(initialApplicants);

  const userApplication = applicants.slice(0, 1);
  const currentApplicant = userApplication[0];

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

  return (
    <article className="flex flex-col gap-6">
      {/* Application Progress Stage Overview */}
      <UserPipelineStageOverview currentStage={currentApplicant?.stage} />

      {/* Applicant Scorecard Details directly on page below Application Progress */}
      <UserApplicantScorecardSection applicant={currentApplicant} />

      {/* Single Franchise Table */}
      <div className="flex flex-col gap-3">
        <h2 className="heading-lg text-tertiary">Pipeline Request Summary</h2>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
          <DataTable
            columns={columns}
            data={userApplication}
            customStyles={customStyles}
            highlightOnHover
          />
        </section>
      </div>

      {/* Uploaded Application Documents */}
      <UploadedDocumentsSection />
    </article>
  );
};

export default UserFranchisePipelineTable;
