import ReactDataTable from "react-data-table-component";
import TableSkeleton from "./TableSkeleton";
import { tableStyles } from "../../utils/tableStyles";

// one loading, empty and look for every table
const DataTable = ({
  columns = [],
  variant = "bare",
  fillHeight = false,
  isLoading = false,
  emptyText = "No records found",
  ...rest
}) => (
  <ReactDataTable
    columns={columns}
    keyField="_id"
    highlightOnHover
    responsive
    customStyles={tableStyles(variant, fillHeight)}
    progressPending={isLoading}
    progressComponent={<TableSkeleton columns={columns.length} />}
    noDataComponent={<p className="py-8 text-sm text-muted">{emptyText}</p>}
    {...rest}
  />
);

export default DataTable;
