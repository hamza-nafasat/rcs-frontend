import DataTable from "react-data-table-component";

const PRIORITY_STYLES = {
  Urgent: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
  High: { pill: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  Medium: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Low: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const STATUS_STYLES = {
  Open: { pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  "In Progress": { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Resolved: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Closed: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const tableStyles = {
  table: { style: { width: "100%" } },
  tableWrapper: { style: { width: "100%", height: "100%" } },
  responsiveWrapper: {
    style: {
      width: "100%",
      flex: "1 1 auto",
      minHeight: 0,
      overflowY: "auto",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#FAFAFA",
    },
  },
  headCells: {
    style: {
      color: "#4B5563",
      fontSize: "12px",
      fontWeight: "600",
    },
  },
  pagination: {
    style: {
      marginTop: "auto",
      flex: "0 0 auto",
    },
  },
};

const Pill = ({ value, styles }) => {
  const { pill, dot } = styles[value] ?? Object.values(styles).at(-1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {value}
    </span>
  );
};

const SupportTable = ({ tickets }) => {
  const columns = [
    {
      name: "Ticket ID",
      selector: (row) => row.ticketId,
      sortable: true,
      minWidth: "130px",
      cell: (row) => (
        <span className="text-sm font-semibold text-primary">
          {row.ticketId}
        </span>
      ),
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
      minWidth: "240px",
      grow: 2,
      cell: (row) => <p className="truncate text-subject">{row.subject}</p>,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      minWidth: "150px",
      cell: (row) => <p className="text-tablecell">{row.category}</p>,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
      minWidth: "130px",
      cell: (row) => <Pill value={row.priority} styles={PRIORITY_STYLES} />,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "140px",
      cell: (row) => <Pill value={row.status} styles={STATUS_STYLES} />,
    },
    {
      name: "Received On",
      selector: (row) => row.receivedOn,
      sortable: true,
      minWidth: "150px",
      cell: (row) => <p className="text-tablecell">{row.receivedOn}</p>,
    },
    {
      name: "Last Updated",
      selector: (row) => row.lastUpdated,
      sortable: true,
      minWidth: "150px",
      cell: (row) => <p className="text-tablecell">{row.lastUpdated}</p>,
    },
  ];

  return (
    <section className="flex h-full w-full min-h-0 flex-col">
      {" "}
      <DataTable
        columns={columns}
        data={tickets}
        pagination
        highlightOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="100%"
        customStyles={tableStyles}
        conditionalRowStyles={[
          {
            when: (row) => tickets.indexOf(row) % 2 === 1,
            style: { backgroundColor: "#FAFAFA" },
          },
        ]}
        className="flex min-h-0 flex-1 flex-col"
        noDataComponent={
          <p className="py-8 text-sm text-secondary">No tickets found</p>
        }
      />
    </section>
  );
};

export default SupportTable;
