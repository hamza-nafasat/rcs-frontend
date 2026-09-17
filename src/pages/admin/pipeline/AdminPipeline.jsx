import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PipelineHeading from "../../../components/global/PipelineHeading";
import PipelineFilter from "../../../components/global/pipeline/PipelineFilter";
import PipelineStageOverview from "../../../components/global/pipeline/PipelineStageOverview";
import PipelineTable from "../../../components/global/pipeline/PipelineTable";
import { filterApplications, PIPELINE_INITIAL_FILTERS, territoriesOf } from "../../../utils/pipelineFilters";
import { useGetAllPipelinesQuery } from "../../../store/apis/shared/pipeline.apis";

const AdminPipeline = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllPipelinesQuery();
  const [filters, setFilters] = useState(PIPELINE_INITIAL_FILTERS);

  const applications = data?.data ?? [];

  return (
    <article className="flex flex-col gap-4">
      <PipelineHeading
        heading="Franchise Pipeline"
        subheading="Applicant qualification scorecard — automated scoring engine"
      />

      <PipelineFilter filters={filters} setFilters={setFilters} territories={territoriesOf(applications)} />

      <PipelineStageOverview applications={applications} />

      <PipelineTable
        applications={filterApplications(applications, filters)}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/admin/dashboard/pipeline/${row?._id}`)}
      />
    </article>
  );
};

export default AdminPipeline;
