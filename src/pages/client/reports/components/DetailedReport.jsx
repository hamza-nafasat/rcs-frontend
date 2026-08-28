import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import {
  getRecommendation,
} from "../../dashboard/data/scorecardData";

const scoreColor = (score) => {
  if (score >= 80) return "var(--color-revenue)";
  if (score >= 60) return "var(--color-primary)";
  return "var(--color-text-remove)";
};

const stageColor = (stage) => {
  if (stage === "Approved" || stage === "Conditionally Approved") {
    return "var(--color-revenue)";
  }

  return "var(--color-primary)";
};

const categoryValue = (row, key) =>
  (row.categories?.[key] ?? 0).toFixed(1);

const customStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  headRow: {
    style: {
      backgroundColor: "transparent",
      borderBottomWidth: "1px",
      borderBottomColor: "var(--color-border)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-text-muted)",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
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

const DetailedReport = ({ applicants = [],  }) => {
  const [selected, setSelected] = useState(null);

  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (row) => row.id,
        width: "88px",
        cell: (row) => (
          <span className="text-xs text-muted">{row.id}</span>
        ),
      },
      {
        name: "Applicant",
        grow: 2,
        selector: (row) => row.name,
        cell: (row) => (
          <div className="py-1">
            <p className="font-semibold text-tertiary">{row.name}</p>
            <p className="text-xs text-muted">{row.submitted}</p>
          </div>
        ),
      },
      {
        name: "Territory",
        selector: (row) => row.territory,
        cell: (row) => (
          <span className="text-secondary">{row.territory}</span>
        ),
      },
      {
        name: "Stage",
        selector: (row) => row.stage,
        width: "120px",
        cell: (row) => (
          <span
            className="text-sm font-medium"
            style={{ color: stageColor(row.stage) }}
          >
            {row.stage}
          </span>
        ),
      },
      {
        name: "Financial",
        selector: (row) => row.categories?.financial ?? 0,
        cell: (row) => (
          <span className="text-tertiary">{categoryValue(row, "financial")}</span>
        ),
      },
      {
        name: "Experience",
        selector: (row) => row.categories?.experience ?? 0,
        width: "120px",
        cell: (row) => (
          <span className="text-tertiary">{categoryValue(row, "experience")}</span>
        ),
      },
      {
        name: "Legal",
        selector: (row) => row.categories?.legal ?? 0,
        cell: (row) => (
          <span className="text-tertiary">{categoryValue(row, "legal")}</span>
        ),
      },
      {
        name: "Market",
        selector: (row) => row.categories?.market ?? 0,
        cell: (row) => (
          <span className="text-tertiary">{categoryValue(row, "market")}</span>
        ),
      },
      {
        name: "Total Score",
        selector: (row) => row.score,
        cell: (row) => (
          <span
            className="font-semibold"
            style={{ color: scoreColor(row.score) }}
          >
            {row.score.toFixed(1)}
          </span>
        ),
      },
      {
        name: "Outcome",
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
    ],
    [],
  );

  return (
    <article className="overflow-hidden rounded-2xl border color-border bg-white">
      <header className="flex items-center justify-between px-5 py-4">
        <h2 className="card-heading">Applicants Detailed Report</h2>
      </header>

      <DataTable
        columns={columns}
        data={applicants}
        customStyles={customStyles}
        highlightOnHover
        responsive
      />
    </article>
  );
};

export default DetailedReport;
