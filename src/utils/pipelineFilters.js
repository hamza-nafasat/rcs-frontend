const PIPELINE_INITIAL_FILTERS = { applicant: "", franchise: "", stage: [], territory: [] };

const includesText = (text, query) => String(text ?? "").toLowerCase().includes(query.trim().toLowerCase());

// territories come from the rows
const territoriesOf = (applications = []) => [
  ...new Set(applications.map((application) => application?.proposedTerritory).filter(Boolean)),
];

const filterApplications = (applications = [], filters = PIPELINE_INITIAL_FILTERS) =>
  applications.filter((application) => {
    const matchApplicant =
      includesText(application?.applicant?.fullName, filters.applicant) ||
      includesText(application?.applicant?.email, filters.applicant);
    const matchFranchise = includesText(application?.franchiseName, filters.franchise);
    const matchStage = filters.stage.length === 0 || filters.stage.includes(application?.stage);
    const matchTerritory =
      filters.territory.length === 0 || filters.territory.includes(application?.proposedTerritory);

    return matchApplicant && matchFranchise && matchStage && matchTerritory;
  });

export { filterApplications, PIPELINE_INITIAL_FILTERS, territoriesOf };
