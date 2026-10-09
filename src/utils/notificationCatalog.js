import { BadgeCheck, FileText, LifeBuoy, MapPin, Settings, UserPlus } from "lucide-react";
import { fddStateFor } from "./fddStateHelper";
import { stageOf } from "./pipelineStage";
import { statusOf as requestStatusOf } from "./requestStatus";
import { SUPPORT_STATUS } from "./supportStatus";

const ICON_STYLES = {
  document: "bg-blue-50 text-blue-600",
  support: "bg-amber-50 text-amber-600",
  account: "bg-green-50 text-green-600",
  system: "bg-gray-100 text-gray-600",
};

// skips whatever the meta is missing
const join = (parts, separator = " · ") => parts.filter(Boolean).join(separator);

const statusLabel = (status) => SUPPORT_STATUS[status]?.label ?? status;

const place = ({ city, state }) => join([city, state], ", ");

// every sentence lives here once
const NOTIFICATION_KINDS = {
  client_onboarded: {
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: ({ name }) => `${name ?? "A client"} completed onboarding`,
    description: () => "The invite was accepted and the account is now active.",
  },
  ticket_raised: {
    icon: LifeBuoy,
    style: ICON_STYLES.support,
    title: ({ name }) => `New support ticket from ${name ?? "a client"}`,
    description: ({ ticketId, subject }) => join([ticketId, subject]) || "Open the ticket to read the details.",
  },
  ticket_status_changed: {
    icon: LifeBuoy,
    style: ICON_STYLES.support,
    title: ({ ticketId, status }) =>
      status ? join(["Ticket", ticketId, `is now ${statusLabel(status)}`], " ") : "Your ticket was updated",
    description: ({ name }) => `${name ?? "An admin"} updated your support ticket.`,
  },
  fdd_filled: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ fddName, name }) => `${name ?? "An applicant"} signed ${fddName ?? "a document"}`,
    description: ({ state }) =>
      join([state && `Signed for ${state}`, "the 14 day waiting period has started"], " \u00b7 ") + ".",
  },
  fdd_wait_completed: {
    icon: BadgeCheck,
    style: ICON_STYLES.account,
    title: ({ name }) => `${name ?? "An applicant"} has cleared the 14 day wait`,
    description: ({ fddName, state }) =>
      join([fddName ?? "The document", state && `for ${state}`, "is past its waiting period"], " ") +
      ". This application can move forward.",
  },
  fdd_received: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ fddName }) => `New document: ${fddName ?? "an FDD"}`,
    description: ({ name }) => `${name ?? "An admin"} shared it with you to review and fill.`,
  },
  account_created: {
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: () => "Your account is ready",
    description: ({ name }) => `Welcome${name ? `, ${name}` : ""}. You can sign in and start managing your franchise.`,
  },
  profile_updated: {
    icon: Settings,
    style: ICON_STYLES.system,
    title: () => "Profile updated",
    description: ({ name }) => `${name ?? "A moderator"} saved changes to your profile.`,
  },
  pipeline_request_sent: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ title }) => (title ? `Documents requested: ${title}` : "New document request"),
    description: ({ name }) => `${name ?? "An admin"} needs more information to continue your application.`,
  },
  pipeline_request_filled: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ title }) => (title ? `Request answered: ${title}` : "A document request was answered"),
    description: ({ name }) => `${name ?? "An applicant"} sent the documents you asked for.`,
  },
  pipeline_request_status_changed: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ title, to }) =>
      join([title ? `Request “${title}”` : "Your document request", to && `is now ${requestStatusOf(to).label}`], " "),
    description: ({ name, from }) =>
      join([`${name ?? "An admin"} updated the request status`, from && `from ${requestStatusOf(from).label}`], " ") +
      ".",
  },
  pipeline_application_received: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ name }) => `New application from ${name ?? "an applicant"}`,
    description: ({ clientName, franchiseName }) => {
      const detail = join([franchiseName && `Applied to ${franchiseName}`, clientName && `through ${clientName}`], " ");
      return detail ? `${detail}.` : "Received through a client's website.";
    },
  },
  pipeline_application_new: {
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: ({ name }) => (name ? `New applicant: ${name}` : "New application received"),
    description: ({ franchiseName }) =>
      franchiseName ? `Applied to ${franchiseName} through your website.` : "A new application came through your website.",
  },
  pipeline_stage_changed: {
    icon: BadgeCheck,
    style: ICON_STYLES.document,
    title: ({ to }) => (to ? `Application moved to ${stageOf(to).label}` : "Your application status changed"),
    description: ({ name, from }) =>
      join([`${name ?? "An admin"} updated your application`, from && `from ${stageOf(from).label}`], " ") + ".",
  },
  client_state_added: {
    icon: MapPin,
    style: ICON_STYLES.document,
    title: ({ clientName, state }) =>
      join([clientName ?? "A client", state ? `now operates in ${state}` : "reached a new state"], " "),
    description: ({ franchiseName, state }) =>
      join(
        [
          franchiseName ? `${franchiseName} was assigned there` : "A new location was assigned",
          state && `this state needs the ${fddStateFor(state)} FDD`,
        ],
        " \u2014 ",
      ) + ".",
  },
  pipeline_new_state_application: {
    icon: MapPin,
    style: ICON_STYLES.support,
    title: ({ name, state }) => `${name ?? "An applicant"} applied in ${state ?? "a new state"}`,
    description: ({ clientName, state }) =>
      join(
        [
          `${clientName ?? "The client"} has no franchise in ${state ?? "that state"} yet`,
          state && `assigning a location there will need the ${fddStateFor(state)} FDD`,
        ],
        " \u2014 ",
      ) + ".",
  },
  pipeline_location_assigned: {
    icon: MapPin,
    style: ICON_STYLES.account,
    title: ({ name }) => `Location assigned: ${name ?? "your franchise"}`,
    description: (meta) =>
      place(meta) ? `Your franchise location is ${place(meta)}.` : "Open your application to see the details.",
  },
};

const FALLBACK_KIND = {
  icon: Settings,
  style: ICON_STYLES.system,
  title: () => "Notification",
  description: () => "",
};

// an unknown kind still renders
const getNotificationKind = (kind) => NOTIFICATION_KINDS[kind] ?? FALLBACK_KIND;

// the sentence this notification reads as
const readNotification = (notification) => {
  const entry = getNotificationKind(notification?.kind);
  const meta = notification?.meta ?? {};
  return { icon: entry.icon, style: entry.style, title: entry.title(meta), description: entry.description(meta) };
};

export { getNotificationKind, readNotification };
