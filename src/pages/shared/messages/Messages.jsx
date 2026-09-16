import Loader from "../../../components/shared/Loader";
import MessagesView from "../../../components/global/messages/MessagesView";
import { useAuthUser } from "../../../routes/useAuthUser";
import { getDashboardRole } from "../../../utils/roleHelper";
import { conversations, initialMessagesByConversation, MESSAGES_BY_ROLE } from "./utils/data";

// one page for every role, a moderator messages as the account that created them
const Messages = () => {
  const { user } = useAuthUser();
  const roleMessages = MESSAGES_BY_ROLE[getDashboardRole(user)];

  if (!roleMessages) return <Loader />;

  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      contacts={roleMessages.contacts}
      currentUserId={roleMessages.currentUserId}
    />
  );
};

export default Messages;
