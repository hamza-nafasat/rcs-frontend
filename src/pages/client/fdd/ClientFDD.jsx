import { lazy, Suspense, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../components/shared/Loader";
import FddTable from "../../../components/global/FddTable";
import FddHeading from "./components/FddHeading";
import FddFilter from "./components/FddFilter";
import { downloadFile } from "../../../utils/downloadFile";
import { initialDocuments } from "./utils/data";

// the pdf reader and writer only load once a document is opened
const FddViewModal = lazy(() => import("../../../components/modals/FddViewModal"));
const FddFillModal = lazy(() => import("../../../components/modals/FddFillModal"));

const initialFilters = {
  country: [],
  state: "",
  brand: [],
  document: "",
};

const ClientFdd = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filters, setFilters] = useState(initialFilters);
  const [documentToView, setDocumentToView] = useState(null);
  const [documentToFill, setDocumentToFill] = useState(null);

  const countries = [...new Set(documents.map((doc) => doc.country))];
  const brands = [...new Set(documents.map((doc) => doc.brand))];

  // the filled copy replaces the one on screen until the api stores it
  const handleSaveFilled = (filledFile) => {
    const fileUrl = URL.createObjectURL(filledFile);
    setDocuments((prev) => prev.map((doc) => (doc.id === documentToFill?.id ? { ...doc, fileUrl } : doc)));
    setDocumentToFill(null);
    toast.success("FDD filled successfully");
  };

  const handleDownload = (doc) => downloadFile(doc?.fileUrl, doc?.document);

  const filteredDocuments = documents.filter((doc) => {
    const matchCountry =
      filters.country.length === 0 || filters.country.includes(doc.country);

    const matchBrand =
      filters.brand.length === 0 || filters.brand.includes(doc.brand);

    const matchState = doc.state
      .toLowerCase()
      .includes(filters.state.trim().toLowerCase());

    const matchDocument = doc.document
      .toLowerCase()
      .includes(filters.document.trim().toLowerCase());

    return matchCountry && matchBrand && matchState && matchDocument;
  });

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section className="border-b color-border py-4">
        <FddHeading
          heading="FDD Document"
          subheading="Review and sign your Franchise Disclosure Documents."
        />
      </section>

      <section className="mt-6">
        <FddFilter
          filters={filters}
          setFilters={setFilters}
          countries={countries}
          brands={brands}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <FddTable
          documents={filteredDocuments}
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
