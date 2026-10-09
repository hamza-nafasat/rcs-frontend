import { lazy, Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import DeleteModal from "../../../components/modals/DeleteModal";
import Loader from "../../../components/shared/Loader";
import FddTable from "../../../components/global/FddTable";
import FddFilter from "../../../components/global/fdd/FddFilter";
import FddHeading from "./components/FddHeading";
import FddAddEditModal from "./modals/FddAddEditModal";
import { downloadFile } from "../../../utils/downloadFile";
import { toFddFormData, toFilledFormData, toFddFileName, toFddFileUrl } from "../../../utils/fddRequest";
import { clientApi, useGetAllClientsQuery } from "../../../store/apis/admin/client.apis";
import {
  useCreateFddMutation,
  useDeleteFddMutation,
  useFillFddMutation,
  useGetAllFddsQuery,
  useUpdateFddMutation,
} from "../../../store/apis/shared/fdd.apis";

// pdf code loads when opened
const FddViewModal = lazy(() => import("../../../components/modals/FddViewModal"));
const FddFillModal = lazy(() => import("../../../components/modals/FddFillModal"));

const initialFilters = {
  search: "",
  restaurant: "",
  state: "",
};

// only the filters that are set
const toQueryParams = (filters) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));

const AdminFdd = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useGetAllFddsQuery(toQueryParams(filters));
  const { data: clientData } = useGetAllClientsQuery();
  const [createFdd, { isLoading: isCreating }] = useCreateFddMutation();
  const [updateFdd, { isLoading: isUpdating }] = useUpdateFddMutation();
  const [fillFdd] = useFillFddMutation();
  const [deleteFdd, { isLoading: isDeleting }] = useDeleteFddMutation();

  const [documentToView, setDocumentToView] = useState(null);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [documentToFill, setDocumentToFill] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const documents = data?.data ?? [];

  // an FDD belongs to one restaurant
  const clients = (clientData?.data ?? []).map((client) => ({
    value: client?._id,
    label: client?.restaurantName,
    // the modal stars the states it needs
    restaurantStates: client?.restaurantStates ?? [],
  }));

  // the fdd coverage badge follows
  const refreshClients = () => dispatch(clientApi.util.invalidateTags(["Clients", "singleClient"]));

  const handleAddFdd = async (form) => {
    const response = await createFdd(toFddFormData(form)).unwrap();
    toast.success(response?.message);
    refreshClients();
  };

  const handleUpdateFdd = async (form) => {
    try {
      const response = await updateFdd({
        id: documentToEdit?._id,
        body: toFddFormData(form),
      }).unwrap();
      toast.success(response?.message);
      refreshClients();
      setDocumentToEdit(null);
    } catch (error) {
      console.error("Update FDD error:", error);
    }
  };

  const handleDeleteFdd = async () => {
    try {
      const response = await deleteFdd(documentToDelete?._id).unwrap();
      toast.success(response?.message);
      refreshClients();
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Delete FDD error:", error);
    }
  };

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
          subheading="Manage your Franchise Disclosure Documents versions."
          clients={clients}
          isSubmitting={isCreating}
          onAddFdd={handleAddFdd}
        />
      </section>

      <section className="mt-6">
        <FddFilter filters={filters} setFilters={setFilters} clients={clients} />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <FddTable
          documents={documents}
          isLoading={isLoading}
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
          clients={clients}
          isSubmitting={isUpdating}
          mode="edit"
        />
      )}

      <DeleteModal
        isOpen={Boolean(documentToDelete)}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={handleDeleteFdd}
        heading="Delete FDD Document"
        text={`Are you sure you want to delete ${documentToDelete?.title ?? "this document"}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </article>
  );
};

export default AdminFdd;
