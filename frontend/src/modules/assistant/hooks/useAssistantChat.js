import { useCallback, useEffect, useState } from 'react';
import { assistantApi } from '@/services/index.js';
import { useAuth } from '@/modules/auth/index.js';

// Estado del chat contra POST /api/v1/assistant/chat y el historial de
// GET /assistant/conversations[/:id]. Compartido entre la página del
// asistente y el widget flotante.
export function useAssistantChat() {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      return;
    }
    const data = await assistantApi.conversations();
    setConversations(Array.isArray(data) ? data : []);
  }, [isAuthenticated]);

  useEffect(() => {
    loadConversations().catch(() => setConversations([]));
  }, [loadConversations]);

  const selectConversation = useCallback(async (id) => {
    setError(null);
    setLoadingHistory(true);
    try {
      const conversation = await assistantApi.conversation(id);
      setConversationId(conversation.id);
      setMessages(conversation.messages ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const newChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || sending) return;
      setSending(true);
      setError(null);
      setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: 'user', content }]);
      try {
        const { conversationId: cid, reply } = await assistantApi.chat(content, conversationId);
        setConversationId(cid);
        setMessages((prev) => [
          ...prev,
          { id: `reply-${Date.now()}`, role: 'assistant', content: reply },
        ]);
        loadConversations().catch(() => {});
      } catch (err) {
        setError(err.message);
      } finally {
        setSending(false);
      }
    },
    [conversationId, sending, loadConversations],
  );

  return {
    conversations,
    conversationId,
    messages,
    loadingHistory,
    sending,
    error,
    sendMessage,
    selectConversation,
    newChat,
  };
}
