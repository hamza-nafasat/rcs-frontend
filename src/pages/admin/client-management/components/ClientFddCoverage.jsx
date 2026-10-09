import { CircleAlert, CircleCheck } from "lucide-react";
import { useGetAllFddsQuery } from "../../../../store/apis/shared/fdd.apis";
import { fddStateFor } from "../../../../utils/fddStateHelper";
import { FDD_COVERAGE_STATUS, getFddCoverage } from "../utils/clientStatus";

const ClientFddCoverage = ({ client }) => {
  const { data } = useGetAllFddsQuery({ restaurant: client?._id }, { skip: !client?._id });
  const uploadedStates = new Set((data?.data ?? []).map((document) => document?.state));

  const states = client?.restaurantStates ?? [];
  const { label, pill, dot } = FDD_COVERAGE_STATUS[getFddCoverage(client)] ?? FDD_COVERAGE_STATUS.incomplete;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-tertiary">FDD Coverage</h3>

        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      </div>

      {states.length === 0 ? (
        <p className="rounded-lg border color-border bg-white px-3 py-2 text-xs text-secondary">
          No franchise locations yet, so no state needs a document.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {states.map((state) => {
            const document = fddStateFor(state);
            const isUploaded = uploadedStates.has(document);

            return (
              <li
                key={state}
                className="flex items-center justify-between gap-3 rounded-lg border color-border bg-white px-3 py-2"
              >
                <span className="min-w-0 truncate text-xs text-secondary">
                  {state}
                  {/* a plain state uses the general fdd */}
                  {document !== state && <span className="text-muted"> · {document} FDD</span>}
                </span>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium ${
                    isUploaded ? "text-[#22C55E]" : "text-[#F59E0B]"
                  }`}
                >
                  {isUploaded ? <CircleCheck size={13} /> : <CircleAlert size={13} />}
                  {isUploaded ? "Uploaded" : "Missing"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ClientFddCoverage;
