import MessagesView from "../../../components/global/messages/MessagesView";
import { contacts, conversations, initialMessagesByConversation } from "./utils/data";

const AdminMessages = () => {
  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      contacts={contacts}
      currentUserId="admin-1"
    />
  );
};

export default AdminMessages;
