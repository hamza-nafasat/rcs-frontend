import { useState } from "react";
import { Search, X } from "lucide-react";
import Avatar from "../shared/Avatar";
import Input from "../shared/Input";

// accounts grouped by their role
const groupContacts = (contacts) =>
  contacts.reduce((groups, contact) => {
    const group = contact?.role ?? "people";
    return { ...groups, [group]: [...(groups[group] ?? []), contact] };
  }, {});

const MessageNewConversationModal = ({ isOpen, onClose, contacts = [], onSelect }) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const query = search.trim().toLowerCase();
  const visibleContacts = query
    ? contacts.filter(({ fullName, email }) =>
        [fullName, email].some((value) => String(value ?? "").toLowerCase().includes(query)),
      )
    : contacts;

  const groups = Object.entries(groupContacts(visibleContacts));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <article className="flex max-h-[80vh] w-full max-w-110 flex-col rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-tertiary">New Conversation</h2>
            <p className="mt-1 text-sm text-muted">Pick who you want to message.</p>
          </div>

          <button
            aria-label="Close dialog"
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </header>

        <Input
          name="contactSearch"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name"
          icon={<Search size={16} />}
        />

        {/* People */}
        <section className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {groups.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No one found</p>
          ) : (
            groups.map(([group, people]) => (
              <div key={group} className="mb-3">
                <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-secondary">{group}s</p>

                {people.map((contact) => (
                  <button
                    key={contact._id}
                    type="button"
                    onClick={() => onSelect?.(contact)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-muted"
                  >
                    <Avatar src={contact?.image?.url} name={contact?.fullName} size={36} rounded="rounded-full" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-tertiary">{contact?.fullName}</p>
                      <p className="truncate text-xs text-muted">{contact?.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </section>
      </article>
    </div>
  );
};

export default MessageNewConversationModal;
