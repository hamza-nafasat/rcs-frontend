import MessagesView from "../../../components/global/messages/MessagesView";
import { conversations, initialMessagesByConversation } from "./utils/data";

const ClientMessages = () => {
  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      currentUserId="client-1"
    />
  );
};

export default ClientMessages;
