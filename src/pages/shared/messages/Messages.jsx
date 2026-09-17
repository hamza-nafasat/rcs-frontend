import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MessagesView from "../../../components/global/messages/MessagesView";
import { useAuthUser } from "../../../routes/useAuthUser";
import { getActingAccountId } from "../../../utils/roleHelper";
import { onSocketEvent } from "../../../utils/socket";
import { MESSAGE_EVENTS } from "../../../configs/constants";
import {
  messageApi,
  useDeleteMessageMutation,
  useGetContactsQuery,
  useGetMessagesQuery,
  useGetMyConversationsQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
  useStartConversationMutation,
} from "../../../store/apis/shared/message.apis";

// one message carries one attachment
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
  const dispatch = useDispatch();
  const { user } = useAuthUser();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const { data: conversationData, isLoading: isLoadingConversations } = useGetMyConversationsQuery();
  const { data: contactData } = useGetContactsQuery();
  const { data: messageData, isFetching: isLoadingMessages } = useGetMessagesQuery(selectedConversationId, {
    skip: !selectedConversationId,
  });

  const [startConversation] = useStartConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markConversationRead] = useMarkConversationReadMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const conversations = conversationData?.data ?? [];
  const messages = messageData?.data ?? [];
  const currentUserId = getActingAccountId(user);
  const selectedConversation = conversations.find((conversation) => conversation?._id === selectedConversationId);

  // the server pushes, the cache refetches
  useEffect(() => {
    const unsubscribes = MESSAGE_EVENTS.map((event) =>
      onSocketEvent(event, ({ conversationId } = {}) =>
        dispatch(messageApi.util.invalidateTags(["Conversations", { type: "Messages", id: conversationId }])),
      ),
    );

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [dispatch]);

  // an open chat keeps nothing unread
  useEffect(() => {
    if (!selectedConversationId || !selectedConversation?.unreadCount) return;

    markConversationRead(selectedConversationId)
      .unwrap()
      .catch((error) => console.error("Mark conversation read error:", error));
  }, [selectedConversationId, selectedConversation?.unreadCount, markConversationRead]);

  const handleStartConversation = async (contact) => {
    try {
      const response = await startConversation(contact?._id).unwrap();
      setSelectedConversationId(response?.data?._id);
    } catch (error) {
      console.error("Start conversation error:", error);
    }
  };

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
      onSelectConversation={setSelectedConversationId}
      onStartConversation={handleStartConversation}
      onSend={handleSend}
      onDeleteMessage={handleDeleteMessage}
      onBack={() => setSelectedConversationId(null)}
    />
  );
};

export default Messages;
