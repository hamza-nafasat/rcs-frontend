import MessagesView from "../../../components/global/messages/MessagesView";
import { contacts, conversations, initialMessagesByConversation } from "./utils/data";

const ClientMessages = () => {
  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      contacts={contacts}
      currentUserId="client-1"
    />
  );
};

export default ClientMessages;
