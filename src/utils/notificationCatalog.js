import { BadgeCheck, FileText, LifeBuoy, MapPin, Settings, UserPlus } from "lucide-react";

const ICON_STYLES = {
  document: "bg-blue-50 text-blue-600",
  support: "bg-amber-50 text-amber-600",
  account: "bg-green-50 text-green-600",
  system: "bg-gray-100 text-gray-600",
};

// every sentence lives here once
const NOTIFICATION_KINDS = {
  client_onboarded: {
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: ({ name }) => `${name ?? "A client"} completed their profile`,
    description: () => "The invite was accepted and the account is now active.",
  },
  ticket_raised: {
    icon: LifeBuoy,
    style: ICON_STYLES.support,
    title: ({ name }) => `New ticket from ${name ?? "a client"}`,
    description: ({ ticketId, subject }) => [ticketId, subject].filter(Boolean).join(" — "),
  },
  fdd_filled: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ fddName, name }) => `${fddName ?? "An FDD"} filled by ${name ?? "a client"}`,
    description: () => "The filled copy is ready for your review.",
  },
  account_created: {
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: () => "Your account is ready",
    description: ({ name }) => `Welcome${name ? `, ${name}` : ""}. Your account was created successfully.`,
  },
  ticket_status_changed: {
    icon: LifeBuoy,
    style: ICON_STYLES.support,
    title: ({ ticketId, status }) => `Ticket ${ticketId ?? ""} ${status ?? "updated"}`.trim(),
    description: ({ name }) => `${name ?? "An admin"} updated your ticket.`,
  },
  fdd_received: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ fddName }) => `${fddName ?? "An FDD"} received`,
    description: ({ name }) => `${name ?? "An admin"} shared a new document with you.`,
  },
  fdd_approved: {
    icon: BadgeCheck,
    style: ICON_STYLES.account,
    title: ({ fddName }) => `${fddName ?? "An FDD"} approved`,
    description: ({ name }) => `${name ?? "An admin"} approved your filled document.`,
  },
  profile_updated: {
    icon: Settings,
    style: ICON_STYLES.system,
    title: () => "Your profile was updated",
    description: ({ name }) => `${name ?? "You"} saved changes to your profile.`,
  },
  pipeline_request_sent: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ title }) => `Documents requested: ${title ?? "a new request"}`,
    description: ({ name }) => `${name ?? "An admin"} asked you for more information.`,
  },
  pipeline_request_filled: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ title }) => `${title ?? "A request"} was filled`,
    description: ({ name }) => `${name ?? "An applicant"} sent the requested documents.`,
  },
  pipeline_application_received: {
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ name }) => `New application from ${name ?? "an applicant"}`,
    description: ({ clientName, franchiseName }) =>
      `Received through ${clientName ?? "a client"}'s site${franchiseName ? ` for ${franchiseName}` : ""}.`,
  },
  pipeline_application_new: {
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: ({ name }) => `New application from ${name ?? "an applicant"}`,
    description: ({ franchiseName }) =>
      franchiseName ? `They applied for ${franchiseName}.` : "A new applicant came through your site.",
  },
  pipeline_location_assigned: {
    icon: MapPin,
    style: ICON_STYLES.account,
    title: ({ name }) => `Location assigned: ${name ?? "a new franchise"}`,
    description: ({ city, state }) => [city, state].filter(Boolean).join(", "),
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
