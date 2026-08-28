import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { MapPin } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";
import ProgressBar from "../../../../components/shared/ProgressBar";
import {
  STAGE_COLORS,
  getRecommendation,
} from "../data/scorecardData";
import { initialApplicants } from "../data/pipelineApplicants";
import ClientApplicantScorecardDrawer from "./scorecard/ClientApplicantScorecardDrawer";

const scoreColor = (score) => {
  if (score >= 80) return "var(--color-revenue)";
  if (score >= 60) return "var(--color-primary)";
  return "var(--color-text-remove)";
};

const emptyFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const customStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  headRow: {
    style: {
      backgroundColor: "var(--color-bg-muted)",
      borderBottomWidth: "1px",
      borderBottomColor: "var(--color-border)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-text-muted)",
    },
  },
  cells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      fontSize: "14px",
    },
  },
  rows: {
    style: {
      minHeight: "64px",
      borderBottomColor: "var(--color-border)",
    },
  },
};

const PipelineTable = ({ filters = emptyFilters }) => {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [selected, setSelected] = useState(null);

  const filteredApplicants = applicants.filter((row) => {
    const applicantQuery = filters.applicant.trim().toLowerCase();
    const matchApplicant =
      !applicantQuery ||
      row.name.toLowerCase().includes(applicantQuery) ||
      row.id.toLowerCase().includes(applicantQuery);

    const franchiseQuery = filters.franchise.trim().toLowerCase();
    const franchise = row.franchise ?? row.company ?? "";
    const matchFranchise =
      !franchiseQuery || franchise.toLowerCase().includes(franchiseQuery);

    const matchStage =
      filters.stage.length === 0 || filters.stage.includes(row.stage);

    const matchTerritory =
      filters.territory.length === 0 ||
      filters.territory.includes(row.territory);

    return matchApplicant && matchFranchise && matchStage && matchTerritory;
  });

  const columns = useMemo(
    () => [
      {
        name: "Applicant",
        grow: 2,
        selector: (row) => row.name,
        cell: (row) => (
          <section className="flex items-center gap-3 py-1">
            <Avatar name={row.name} size={36} rounded="rounded-lg" />
            <div>
              <p className="font-medium text-tertiary">{row.name}</p>
              <p className="text-xs text-muted">{row.company}</p>
            </div>
          </section>
        ),
      },
      {
        name: "Territory",
        selector: (row) => row.territory,
        cell: (row) => (
          <section className="flex items-center gap-1.5 text-secondary">
            <MapPin size={14} className="shrink-0 text-muted" />
            <span>{row.territory}</span>
          </section>
        ),
      },
      {
        name: "Stage",
        selector: (row) => row.stage,
        cell: (row) => (
          <Badge
            text={row.stage}
            dotColor={STAGE_COLORS[row.stage] ?? "var(--color-primary)"}
          />
        ),
      },
      {
        name: "Score",
        selector: (row) => row.score,
        width: "120px",
        cell: (row) => {
          const color = scoreColor(row.score);

          return (
            <section className="flex w-full flex-col gap-1 py-1">
              <span className="text-sm font-semibold" style={{ color }}>
                {row.score.toFixed(1)}
              </span>
              <ProgressBar value={row.score} color={color} />
            </section>
          );
        },
      },
      {
        name: "Recommendation",
        selector: (row) => getRecommendation(row.stage, row.score).pillLabel,
        cell: (row) => {
          const recommendation = getRecommendation(row.stage, row.score);

          return (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${recommendation.bg} ${recommendation.text}`}
            >
              {recommendation.pillLabel}
            </span>
          );
        },
      },
      {
        name: "Submitted",
        selector: (row) => row.submitted,
        cell: (row) => <span className="text-secondary">{row.submitted}</span>,
      },
    ],
    [],
  );

  const handleStageChange = (applicant, stage) => {
    setApplicants((rows) =>
      rows.map((row) => (row.id === applicant.id ? { ...row, stage } : row)),
    );

    setSelected((current) =>
      current && current.id === applicant.id ? { ...current, stage } : current,
    );
  };

  return (
    <article className="flex flex-col gap-4">
      <h2 className="heading-lg text-tertiary">Applicant Scorecard</h2>

      <section className="overflow-hidden rounded-2xl border color-border bg-white">
        <DataTable
          columns={columns}
          data={filteredApplicants}
          customStyles={customStyles}
          pagination
          highlightOnHover
          pointerOnHover
          onRowClicked={(row) => setSelected(row)}
        />
      </section>

      <ClientApplicantScorecardDrawer
        key={selected?.id}
        isOpen={Boolean(selected)}
        applicant={selected}
        onClose={() => setSelected(null)}
        onStageChange={handleStageChange}
      />
    </article>
  );
};

export default PipelineTable;
