import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssistantChat } from '@/modules/assistant/index.js';
import { useAuth } from '@/modules/auth/index.js';
import { ROUTES } from '@/routes/index.js';
import './FloatingAssistant.css';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { isAuthenticated } = useAuth();
  const { messages, sending, error, sendMessage } = useAssistantChat();

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className={`floating-assistant ${isOpen ? 'floating-assistant--open' : ''}`}>
      <div className="floating-assistant__panel" role="dialog" aria-label="Asistente virtual">
        <div className="floating-assistant__header">
          <div className="floating-assistant__header-info">
            <span className="floating-assistant__avatar">✦</span>
            <div>
              <h3 className="floating-assistant__title">Asistente Virtual</h3>
              <span className="floating-assistant__status">
                <span className="floating-assistant__status-dot"></span>
                En línea
              </span>
            </div>
          </div>
          <button
            className="floating-assistant__close"
            onClick={toggleChat}
            aria-label="Cerrar chat"
          >
            ✕
          </button>
        </div>

        <div className="floating-assistant__messages">
          {messages
            .filter((msg) => msg.role !== 'system')
            .map((msg) => (
              <div
                key={msg.id}
                className={`floating-assistant__message ${msg.role === 'user' ? 'floating-assistant__message--user' : 'floating-assistant__message--assistant'}`}
              >
                <div className="floating-assistant__bubble">
                  {msg.content}
                </div>
              </div>
            ))}
          {sending && (
            <div className="floating-assistant__message floating-assistant__message--assistant">
              <div className="floating-assistant__bubble floating-assistant__bubble--typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {messages.length === 0 && !sending && (
            <div className="floating-assistant__message floating-assistant__message--assistant">
              <div className="floating-assistant__bubble">
                ¡Hola! Puedo ayudarte a reservar o ver tus citas.
              </div>
            </div>
          )}
        </div>
        {error && (
          <p className="floating-assistant__error" role="alert">
            {error}
          </p>
        )}

        {isAuthenticated ? (
          <div className="floating-assistant__input-area">
            <input
              type="text"
              className="floating-assistant__input"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSend()}
              disabled={sending}
            />
            <button className="floating-assistant__send" onClick={handleSend} disabled={sending}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        ) : (
          <div className="floating-assistant__input-area">
            <Link to={ROUTES.login} className="btn btn--primary btn--block btn--sm">
              Inicia sesión para chatear
            </Link>
          </div>
        )}
      </div>

      <button
        className="floating-assistant__button"
        onClick={toggleChat}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 2C13.5 4.5 15 7 12 10C9 7 10.5 4.5 12 2Z" />
            <path d="M4 8C7.5 8.5 10 10 12 13C14 10 16.5 8.5 20 8C18.5 11 16 13.5 12 15C8 13.5 5.5 11 4 8Z" opacity="0.85" />
            <path d="M5 14C8.5 14 11 15.5 12 18C13 15.5 15.5 14 19 14C17.5 16.5 15 18.5 12 20C9 18.5 6.5 16.5 5 14Z" opacity="0.7" />
          </svg>
        )}
      </button>
    </div>
  );
}
