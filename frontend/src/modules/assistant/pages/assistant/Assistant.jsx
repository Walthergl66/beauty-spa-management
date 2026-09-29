import { useState } from 'react';
import './Assistant.css';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: '¡Hola! Soy tu asistente virtual de Shirley Franco Spa. Estoy aquí para ayudarte con tus reservas, consultar servicios o cualquier duda que tengas. ¿En qué puedo ayudarte hoy?',
  },
];

const quickActions = [
  { label: 'Ver servicios', icon: '✦' },
  { label: 'Reservar cita', icon: '📅' },
  { label: 'Horarios disponibles', icon: '🕐' },
  { label: 'Precios', icon: '💰' },
];

const conversations = [
  { id: 1, title: 'Consulta sobre faciales', date: 'Hoy' },
  { id: 2, title: 'Reserva de masaje', date: 'Ayer' },
  { id: 3, title: 'Información de horarios', date: 'Hace 3 días' },
];

export default function Assistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulated response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        role: 'assistant',
        content: 'Gracias por tu mensaje. Estoy procesando tu consulta. Un momento por favor... ✨',
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleQuickAction = (label) => {
    setInput(label);
  };

  return (
    <div className="assistant-page">
      <section className="assistant__header">
        <div className="container">
          <h1 className="assistant__title">Asistente Virtual</h1>
          <p className="assistant__subtitle">Tu ayudante inteligente para gestionar tus citas</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--spacing-xl)' }}>
        <div className="container">
          <div className="assistant__layout">
            {/* Sidebar - Conversations */}
            <aside className="assistant__sidebar">
              <div className="assistant__sidebar-header">
                <h3>Conversaciones</h3>
                <button className="assistant__new-chat">+ Nueva</button>
              </div>
              <div className="assistant__conversations">
                {conversations.map((conv) => (
                  <button key={conv.id} className="assistant__conversation">
                    <span className="assistant__conversation-title">{conv.title}</span>
                    <span className="assistant__conversation-date">{conv.date}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Chat Area */}
            <div className="assistant__chat">
              <div className="assistant__messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`assistant__message ${msg.role === 'user' ? 'assistant__message--user' : 'assistant__message--assistant'}`}
                  >
                    <div className="assistant__message-bubble">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="assistant__quick-actions">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="assistant__quick-action"
                    onClick={() => handleQuickAction(action.label)}
                  >
                    <span className="assistant__quick-icon">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="assistant__input-area">
                <input
                  type="text"
                  className="assistant__input"
                  placeholder="Escribe tu mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="assistant__send" onClick={handleSend}>
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
