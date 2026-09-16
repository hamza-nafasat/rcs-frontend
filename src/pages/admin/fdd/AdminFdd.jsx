import { lazy, Suspense, useState } from "react";
import toast from "react-hot-toast";
import DeleteModal from "../../../components/modals/DeleteModal";
import Loader from "../../../components/shared/Loader";
import FddTable from "../../../components/global/FddTable";
import FddHeading from "./components/FddHeading";
import FddFilter from "./components/FddFilter";
import FddAddEditModal from "./modals/FddAddEditModal";
import { downloadFile } from "../../../utils/downloadFile";
import { useGetAllClientsQuery } from "../../../store/apis/admin/client.apis";
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

// the row the table shows, built from what the upload form collected
const toDocument = (form) => ({
  document: form.document || `${form.title}.pdf`,
  version: form.version || "1.0",
  brand: form.brand || "",
  country: form.country || "United States",
  state: form.state || "General (Non-Registration States)",
  status: form.status || "Pending",
  isFillRequired: Boolean(form.isFillRequired),
  // a freshly uploaded pdf is only available for this session
  ...(form.file ? { fileUrl: URL.createObjectURL(form.file) } : {}),
});

const AdminFdd = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filters, setFilters] = useState(initialFilters);
  const [documentToView, setDocumentToView] = useState(null);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [documentToFill, setDocumentToFill] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const { data: clientData } = useGetAllClientsQuery();

  const countries = [...new Set(documents.map((doc) => doc.country))];
  const brands = [...new Set(documents.map((doc) => doc.brand))];

  // an FDD belongs to one client's restaurant
  const restaurantBrands = [
    ...new Set((clientData?.data ?? []).map((client) => client?.restaurantName).filter(Boolean)),
  ];

  const handleAddFdd = (form) => {
    setDocuments((prev) => [{ id: Date.now(), ...toDocument(form) }, ...prev]);
    toast.success("FDD uploaded successfully");
  };

  const handleUpdateFdd = (form) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === documentToEdit?.id ? { ...doc, ...toDocument(form) } : doc)),
    );
    setDocumentToEdit(null);
    toast.success("FDD updated successfully");
  };

  const handleDeleteFdd = () => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete?.id));
    setDocumentToDelete(null);
    toast.success("FDD deleted successfully");
  };

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
          subheading="Manage your Franchise Disclosure Documents versions."
          brands={restaurantBrands}
          onAddFdd={handleAddFdd}
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
          canManage
          onView={setDocumentToView}
          onEdit={setDocumentToEdit}
          onFill={setDocumentToFill}
          onDownload={handleDownload}
          onDelete={setDocumentToDelete}
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

      {documentToEdit && (
        <FddAddEditModal
          isOpen={Boolean(documentToEdit)}
          onClose={() => setDocumentToEdit(null)}
          onSubmit={handleUpdateFdd}
          initialData={documentToEdit}
          brands={restaurantBrands}
          mode="edit"
        />
      )}

      <DeleteModal
        isOpen={Boolean(documentToDelete)}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={handleDeleteFdd}
        heading="Delete FDD Document"
        text={`Are you sure you want to delete ${documentToDelete?.document ?? "this document"}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </article>
  );
};

export default AdminFdd;
