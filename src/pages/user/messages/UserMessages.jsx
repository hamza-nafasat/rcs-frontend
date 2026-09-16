import MessagesView from "../../../components/global/messages/MessagesView";
import { contacts, conversations, initialMessagesByConversation } from "./utils/data";

const UserMessages = () => {
  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      contacts={contacts}
      currentUserId="user-1"
    />
  );
};

export default UserMessages;
