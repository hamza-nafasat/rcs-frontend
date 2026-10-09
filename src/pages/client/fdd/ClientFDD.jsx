import { lazy, Suspense, useState } from "react";
import Loader from "../../../components/shared/Loader";
import FddTable from "../../../components/global/FddTable";
import FddFilter from "../../../components/global/fdd/FddFilter";
import FddHeading from "./components/FddHeading";
import { downloadFile } from "../../../utils/downloadFile";
import { toFddFileName, toFddFileUrl } from "../../../utils/fddRequest";
import { useGetAllFddsQuery } from "../../../store/apis/shared/fdd.apis";

// pdf code loads when opened
const FddViewModal = lazy(() => import("../../../components/modals/FddViewModal"));

const initialFilters = {
  search: "",
  state: "",
};

// only the filters that are set
const toQueryParams = (filters) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));

const ClientFdd = () => {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useGetAllFddsQuery(toQueryParams(filters));
  const [documentToView, setDocumentToView] = useState(null);

  const documents = data?.data ?? [];

  const handleDownload = async (doc) => {
    try {
      await downloadFile(toFddFileUrl(doc), toFddFileName(doc));
    } catch (error) {
      console.error("Download FDD error:", error);
    }
  };

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section className="border-b color-border py-4">
        <FddHeading
          heading="FDD Document"
          subheading="Read and download your Franchise Disclosure Documents."
        />
      </section>

      <section className="mt-6">
        <FddFilter filters={filters} setFilters={setFilters} />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <FddTable
          documents={documents}
          isLoading={isLoading}
          onView={setDocumentToView}
          onDownload={handleDownload}
        />
      </section>

      <Suspense fallback={<Loader className="fixed inset-0 z-50 bg-black/40" />}>
        {documentToView && (
          <FddViewModal
            isOpen={Boolean(documentToView)}
            onClose={() => setDocumentToView(null)}
            document={documentToView}
            onDownload={handleDownload}
          />
        )}
      </Suspense>
    </article>
  );
};

export default ClientFdd;
