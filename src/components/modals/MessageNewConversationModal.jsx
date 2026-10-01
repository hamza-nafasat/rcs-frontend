import { useState } from "react";
import { Search, X } from "lucide-react";
import Avatar from "../shared/Avatar";
import Input from "../shared/Input";
import Select from "../shared/Select";
import SegmentedControl from "../shared/SegmentedControl";
import { useGetAllClientsQuery } from "../../store/apis/admin/client.apis";
import { USER_ROLES, USER_STATUSES } from "../../configs/constants";

const TAB_CLIENTS = USER_ROLES.CLIENT;
const TAB_USERS = USER_ROLES.USER;

const ACTIVE_TAB = "bg-orange-50 text-primary";

// how an account status reads
const ACCOUNT_STATUS = {
  [USER_STATUSES.ACTIVE]: { label: "Active", color: "#16A34A", bg: "#F0FDF4" },
  [USER_STATUSES.INACTIVE]: { label: "Inactive", color: "#6B7280", bg: "#F3F4F6" },
};

// one admin reads admin, not admins
const headingFor = (group, count) => (count === 1 ? group : `${group}s`);

// accounts grouped by their role
const groupContacts = (contacts) =>
  contacts.reduce((groups, contact) => {
    const group = contact?.role ?? "contact";
    return { ...groups, [group]: [...(groups[group] ?? []), contact] };
  }, {});

const matchesSearch = (contact, query) =>
  !query || [contact?.fullName, contact?.email].some((value) => String(value ?? "").toLowerCase().includes(query));

const ContactRow = ({ contact, onSelect }) => (
  <button
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
);

const MessageNewConversationModal = ({ isOpen, onClose, contacts = [], onSelect }) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(TAB_CLIENTS);
  const [clientId, setClientId] = useState("");

  const clients = contacts.filter((contact) => contact?.role === TAB_CLIENTS);
  const users = contacts.filter((contact) => contact?.role === TAB_USERS);

  // only admins reach both
  const isAdminView = clients.length > 0 && users.length > 0;
  const { data: clientData } = useGetAllClientsQuery(undefined, { skip: !isOpen || !isAdminView });

  if (!isOpen) return null;

  const query = search.trim().toLowerCase();

  // every signed up client
  const clientOptions = (clientData?.data ?? [])
    .filter((client) => client?.account?.status !== USER_STATUSES.INVITED)
    .map((client) => ({
      value: client?.account?._id,
      label: client?.restaurantName,
      description: client?.account?.email,
      status: ACCOUNT_STATUS[client?.account?.status] ?? ACCOUNT_STATUS[USER_STATUSES.INACTIVE],
    }));

  const visibleUsers = users.filter((user) => (!clientId || user?.franchiser === clientId) && matchesSearch(user, query));
  const tabContacts = tab === TAB_CLIENTS ? clients.filter((client) => matchesSearch(client, query)) : visibleUsers;
  const groups = Object.entries(groupContacts(contacts.filter((contact) => matchesSearch(contact, query))));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <article className="flex h-[80vh] max-h-160 w-full max-w-110 flex-col rounded-2xl bg-white p-6 shadow-xl">
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

        {/* Admin tabs */}
        {isAdminView && (
          <SegmentedControl
            className="mb-3"
            value={tab}
            onChange={setTab}
            options={[
              { value: TAB_CLIENTS, label: `Clients (${clients.length})`, activeClassName: ACTIVE_TAB },
              { value: TAB_USERS, label: `Users (${users.length})`, activeClassName: ACTIVE_TAB },
            ]}
          />
        )}

        <Input
          name="contactSearch"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={isAdminView && tab === TAB_CLIENTS ? "Search clients" : "Search by name or email"}
          icon={<Search size={16} />}
        />

        {/* Users of one client */}
        {isAdminView && tab === TAB_USERS && (
          <Select
            className="mt-3"
            name="clientId"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            options={clientOptions}
            placeholder="All clients"
            searchable
            clearable
          />
        )}

        {/* People */}
        <section className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {isAdminView ? (
            tabContacts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No one found</p>
            ) : (
              tabContacts.map((contact) => <ContactRow key={contact._id} contact={contact} onSelect={onSelect} />)
            )
          ) : groups.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No one found</p>
          ) : (
            groups.map(([group, people]) => (
              <div key={group} className="mb-3">
                <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {headingFor(group, people.length)}
                </p>

                {people.map((contact) => (
                  <ContactRow key={contact._id} contact={contact} onSelect={onSelect} />
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
