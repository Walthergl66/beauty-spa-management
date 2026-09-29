import { useState } from 'react';
import { useRequireAuth } from '@/modules/auth/index.js';
import { useAssistantChat } from '@/modules/assistant/index.js';
import './Assistant.css';

// Sugerencias de escritura (atajos de teclado visual, no datos).
const QUICK_PROMPTS = [
  'Quiero reservar una cita',
  '¿Qué servicios tienen?',
  'Ver mis próximas citas',
];

function conversationLabel(conversation) {
  if (conversation.title) return conversation.title;
  return `Conversación del ${new Date(conversation.createdAt).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}`;
}

export default function Assistant() {
  useRequireAuth();
  const {
    conversations,
    conversationId,
    messages,
    loadingHistory,
    sending,
    error,
    sendMessage,
    selectConversation,
    newChat,
  } = useAssistantChat();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="assistant-page">
      <section className="assistant__header">
        <div className="container">
          <h1 className="assistant__title">Asistente Virtual</h1>
          <p className="assistant__subtitle">Tu ayudante inteligente para gestionar tus citas</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="assistant__layout">
            <aside className="assistant__sidebar">
              <div className="assistant__sidebar-header">
                <h3>Conversaciones</h3>
                <button type="button" className="assistant__new-chat" onClick={newChat}>
                  + Nueva
                </button>
              </div>
              <div className="assistant__conversations">
                {conversations.length === 0 && (
                  <p className="assistant__empty">Sin conversaciones todavía.</p>
                )}
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    className={`assistant__conversation ${conv.id === conversationId ? 'assistant__conversation--active' : ''}`}
                    onClick={() => selectConversation(conv.id)}
                  >
                    <span className="assistant__conversation-title">{conversationLabel(conv)}</span>
                    <span className="assistant__conversation-date">
                      {new Date(conv.updatedAt ?? conv.createdAt).toLocaleDateString('es-EC')}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="assistant__chat">
              <div className="assistant__messages">
                {messages.length === 0 && !loadingHistory && (
                  <p className="assistant__empty">Escríbeme: puedo ayudarte a reservar o ver tus citas.</p>
                )}
                {messages
                  .filter((msg) => msg.role !== 'system')
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`assistant__message ${msg.role === 'user' ? 'assistant__message--user' : 'assistant__message--assistant'}`}
                    >
                      <div className="assistant__message-bubble">{msg.content}</div>
                    </div>
                  ))}
                {sending && (
                  <div className="assistant__message assistant__message--assistant">
                    <div className="assistant__message-bubble">Escribiendo…</div>
                  </div>
                )}
              </div>
              {error && (
                <p className="assistant__error" role="alert">
                  {error}
                </p>
              )}

              <div className="assistant__quick-actions">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="assistant__quick-action"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="assistant__input-area">
                <input
                  type="text"
                  className="assistant__input"
                  placeholder="Escribe tu mensaje..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                  disabled={sending}
                />
                <button type="button" className="assistant__send" onClick={handleSend} disabled={sending}>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
