import { BadgeCheck, FileText, LifeBuoy, MessageSquare, Settings, UserPlus } from "lucide-react";

const ICON_STYLES = {
  message: "bg-purple-50 text-purple-600",
  document: "bg-blue-50 text-blue-600",
  support: "bg-amber-50 text-amber-600",
  account: "bg-green-50 text-green-600",
  system: "bg-gray-100 text-gray-600",
};

// every sentence lives here once
const NOTIFICATION_KINDS = {
  message_received: {
    roles: ["admin", "client", "user"],
    icon: MessageSquare,
    style: ICON_STYLES.message,
    title: ({ name }) => `New message from ${name ?? "someone"}`,
    description: () => "Open the messages page to read and reply.",
  },
  client_onboarded: {
    roles: ["admin"],
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: ({ name }) => `${name ?? "A client"} completed their profile`,
    description: () => "The invite was accepted and the account is now active.",
  },
  ticket_raised: {
    roles: ["admin"],
    icon: LifeBuoy,
    style: ICON_STYLES.support,
    title: ({ name }) => `New ticket from ${name ?? "a client"}`,
    description: ({ ticketId, subject }) => [ticketId, subject].filter(Boolean).join(" — "),
  },
  fdd_filled: {
    roles: ["admin"],
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ fddName, name }) => `${fddName ?? "An FDD"} filled by ${name ?? "a client"}`,
    description: () => "The filled copy is ready for your review.",
  },
  account_created: {
    roles: ["client", "user"],
    icon: UserPlus,
    style: ICON_STYLES.account,
    title: () => "Your account is ready",
    description: ({ name }) => `Welcome${name ? `, ${name}` : ""}. Your account was created successfully.`,
  },
  ticket_status_changed: {
    roles: ["client", "user"],
    icon: LifeBuoy,
    style: ICON_STYLES.support,
    title: ({ ticketId, status }) => `Ticket ${ticketId ?? ""} ${status ?? "updated"}`.trim(),
    description: ({ name }) => `${name ?? "An admin"} updated your ticket.`,
  },
  fdd_received: {
    roles: ["client", "user"],
    icon: FileText,
    style: ICON_STYLES.document,
    title: ({ fddName }) => `${fddName ?? "An FDD"} received`,
    description: ({ name }) => `${name ?? "An admin"} shared a new document with you.`,
  },
  fdd_approved: {
    roles: ["client", "user"],
    icon: BadgeCheck,
    style: ICON_STYLES.account,
    title: ({ fddName }) => `${fddName ?? "An FDD"} approved`,
    description: ({ name }) => `${name ?? "An admin"} approved your filled document.`,
  },
  profile_updated: {
    roles: ["admin", "client", "user"],
    icon: Settings,
    style: ICON_STYLES.system,
    title: () => "Your profile was updated",
    description: ({ name }) => `${name ?? "You"} saved changes to your profile.`,
  },
};

const FALLBACK_KIND = {
  roles: ["admin", "client", "user"],
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

// only what this role should see
const notificationsForRole = (notifications = [], role) =>
  notifications.filter((notification) => getNotificationKind(notification?.kind).roles.includes(role));

export { getNotificationKind, notificationsForRole, readNotification };
