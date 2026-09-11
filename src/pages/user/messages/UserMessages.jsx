import MessagesView from "../../../components/global/messages/MessagesView";
import { conversations, initialMessagesByConversation } from "./utils/data";

const UserMessages = () => {
  return (
    <MessagesView
      conversations={conversations}
      initialMessages={initialMessagesByConversation}
      currentUserId="user-1"
    />
  );
};

export default UserMessages;
