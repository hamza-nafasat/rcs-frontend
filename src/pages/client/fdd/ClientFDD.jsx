import { lazy, Suspense, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../components/shared/Loader";
import FddTable from "../../../components/global/FddTable";
import FddFilter from "../../../components/global/fdd/FddFilter";
import FddHeading from "./components/FddHeading";
import { downloadFile } from "../../../utils/downloadFile";
import { toFilledFormData, toFddFileName, toFddFileUrl } from "../../../utils/fddRequest";
import { useFillFddMutation, useGetAllFddsQuery } from "../../../store/apis/shared/fdd.apis";

// pdf code loads when opened
const FddViewModal = lazy(() => import("../../../components/modals/FddViewModal"));
const FddFillModal = lazy(() => import("../../../components/modals/FddFillModal"));

const initialFilters = {
  search: "",
  state: "",
  status: "",
};

// only the filters that are set
const toQueryParams = (filters) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));

const ClientFdd = () => {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useGetAllFddsQuery(toQueryParams(filters));
  const [fillFdd] = useFillFddMutation();
  const [documentToView, setDocumentToView] = useState(null);
  const [documentToFill, setDocumentToFill] = useState(null);

  const documents = data?.data ?? [];

  const handleSaveFilled = async (filledFile) => {
    const response = await fillFdd({
      id: documentToFill?._id,
      body: toFilledFormData(filledFile, documentToFill),
    }).unwrap();
    toast.success(response?.message);
    setDocumentToFill(null);
  };

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
          subheading="Review and sign your Franchise Disclosure Documents."
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
          onFill={setDocumentToFill}
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

        {documentToFill && (
          <FddFillModal
            isOpen={Boolean(documentToFill)}
            onClose={() => setDocumentToFill(null)}
            document={documentToFill}
            onSave={handleSaveFilled}
          />
        )}
      </Suspense>
    </article>
  );
};

export default ClientFdd;
