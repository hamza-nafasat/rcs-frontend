import { useState } from "react";
import MessagesView from "../../../components/global/messages/MessagesView";
import { useAuthUser } from "../../../routes/useAuthUser";
import { getActingAccountId } from "../../../utils/roleHelper";
import {
  useDeleteMessageMutation,
  useGetContactsQuery,
  useGetMessagesQuery,
  useGetMyConversationsQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
  useStartConversationMutation,
} from "../../../store/apis/shared/message.apis";

// there are no sockets yet, so both lists ask the api again on a timer
const POLL_INTERVAL = 10000;

// one message carries one attachment, a voice note is a recorded file
const toMessageFormData = (text, file, voiceNote) => {
  const body = new FormData();
  if (text) body.append("text", text);
  if (file) body.append("file", file);
  if (voiceNote) {
    body.append("file", voiceNote.blob, "voice-note.webm");
    body.append("duration", voiceNote.duration);
  }
  return body;
};

const Messages = () => {
  const { user } = useAuthUser();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const { data: conversationData, isLoading: isLoadingConversations } = useGetMyConversationsQuery(undefined, {
    pollingInterval: POLL_INTERVAL,
  });
  const { data: contactData } = useGetContactsQuery();
  const { data: messageData, isFetching: isLoadingMessages } = useGetMessagesQuery(selectedConversationId, {
    skip: !selectedConversationId,
    pollingInterval: POLL_INTERVAL,
  });

  const [startConversation] = useStartConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markConversationRead] = useMarkConversationReadMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const conversations = conversationData?.data ?? [];
  const messages = messageData?.data ?? [];
  const currentUserId = getActingAccountId(user);
  const selectedConversation = conversations.find((conversation) => conversation?._id === selectedConversationId);

  // opening a conversation clears what was waiting in it
  const handleSelectConversation = async (conversationId) => {
    setSelectedConversationId(conversationId);
    const conversation = conversations.find((item) => item?._id === conversationId);
    if (!conversation?.unreadCount) return;

    try {
      await markConversationRead(conversationId).unwrap();
    } catch (error) {
      console.error("Mark conversation read error:", error);
    }
  };

  const handleStartConversation = async (contact) => {
    try {
      const response = await startConversation(contact?._id).unwrap();
      setSelectedConversationId(response?.data?._id);
    } catch (error) {
      console.error("Start conversation error:", error);
    }
  };

  // the composer clears only once the api has taken the message
  const handleSend = async (text, file, voiceNote) => {
    await sendMessage({
      conversationId: selectedConversationId,
      body: toMessageFormData(text, file, voiceNote),
    }).unwrap();
  };

  const handleDeleteMessage = async (message) => {
    try {
      await deleteMessage({ conversationId: selectedConversationId, messageId: message?._id }).unwrap();
    } catch (error) {
      console.error("Delete message error:", error);
    }
  };

  return (
    <MessagesView
      conversations={conversations}
      contacts={contactData?.data ?? []}
      messages={messages}
      currentUserId={currentUserId}
      selectedConversation={selectedConversation}
      isLoadingConversations={isLoadingConversations}
      isLoadingMessages={isLoadingMessages && messages.length === 0}
      isSending={isSending}
      onSelectConversation={handleSelectConversation}
      onStartConversation={handleStartConversation}
      onSend={handleSend}
      onDeleteMessage={handleDeleteMessage}
      onBack={() => setSelectedConversationId(null)}
    />
  );
};

export default Messages;
