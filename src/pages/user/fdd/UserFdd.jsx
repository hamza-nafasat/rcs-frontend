import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileClock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import DashboardHeading from "../../../components/global/DashboardHeading";
import FddTable from "../../../components/global/FddTable";
import Button from "../../../components/shared/Button";
import Loader from "../../../components/shared/Loader";
import { downloadFile } from "../../../utils/downloadFile";
import { toFilledFormData, toFddFileName, toFddFileUrl } from "../../../utils/fddRequest";
import { useFillFddMutation, useGetAllFddsQuery } from "../../../store/apis/shared/fdd.apis";
import { useAuthUser } from "../../../routes/useAuthUser";

// pdf code loads when opened
const FddViewModal = lazy(() => import("../../../components/modals/FddViewModal"));
const FddFillModal = lazy(() => import("../../../components/modals/FddFillModal"));

// the intake stores whatever was typed
const titleCase = (value) => String(value ?? "").replace(/\b\w/g, (letter) => letter.toUpperCase());

// what the applicant asks the admin for
const askAdminDraft = (state) =>
  `Hi, I applied for a franchise in ${state}. I cannot see the Franchise Disclosure Document ` +
  `for ${state} in my account yet. Could you add it so I can read and sign it?`;

const UserFdd = () => {
  const navigate = useNavigate();
  const { user } = useAuthUser();

  // the api sends only this applicant's state
  const { data, isLoading } = useGetAllFddsQuery();
  const [fillFdd] = useFillFddMutation();
  const [documentToView, setDocumentToView] = useState(null);
  const [documentToFill, setDocumentToFill] = useState(null);

  const documents = data?.data ?? [];
  const hasNoDocument = !isLoading && documents.length === 0;
  const state = titleCase(user?.state) || "your state";

  // opens the admin chat with the message ready
  const handleAskAdmin = () =>
    navigate("/user/dashboard/messages", { state: { askAdmin: { draft: askAdminDraft(state) } } });

  const handleSaveFilled = async (filledFile) => {
    const response = await fillFdd({
      id: documentToFill?._id,
      body: toFilledFormData(filledFile, documentToFill),
    }).unwrap();
    toast.success(response?.message);
    setDocumentToFill(null);
  };

  const handleDownload = async (document) => {
    try {
      await downloadFile(toFddFileUrl(document), toFddFileName(document));
    } catch (error) {
      console.error("Download FDD error:", error);
    }
  };

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section className="border-b color-border py-4">
        <DashboardHeading
          heading="FDD Document"
          subheading="Read and sign the Franchise Disclosure Document for your state."
        />
      </section>

      {hasNoDocument ? (
        <section className="mt-6 flex min-h-0 flex-1 items-center justify-center rounded-2xl border color-border bg-white p-8">
          <div className="max-w-md text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileClock size={24} className="text-secondary" />
            </span>

            <h2 className="mt-4 text-base font-semibold text-tertiary">Nothing to sign yet</h2>

            <p className="mt-2 text-sm text-secondary">
              There is no Franchise Disclosure Document for {state} in your account. An admin has to add it before
              you can read and sign it.
            </p>

            <Button
              icon={<MessageSquare size={16} />}
              className="mt-6 px-5"
              onClick={handleAskAdmin}
            >
              Ask the Admin
            </Button>
          </div>
        </section>
      ) : (
        <section className="mt-6 min-h-0 flex-1">
          <FddTable
            documents={documents}
            isLoading={isLoading}
            onView={setDocumentToView}
            onFill={setDocumentToFill}
            onDownload={handleDownload}
          />
        </section>
      )}

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

export default UserFdd;
