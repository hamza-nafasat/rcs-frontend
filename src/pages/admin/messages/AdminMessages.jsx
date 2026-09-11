import MessagesView from "../../../components/global/messages/MessagesView";
import { conversations, initialMessagesByConversation } from "./utils/data";

const AdminMessages = () => {
  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      currentUserId="admin-1"
    />
  );
};

export default AdminMessages;
