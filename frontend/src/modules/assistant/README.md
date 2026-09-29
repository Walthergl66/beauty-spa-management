# Módulo assistant

Asistente virtual: página full (`/assistant`, protegida) + widget flotante global.

- Página: `pages/assistant/` (chat + sidebar de conversaciones).
- Estado compartido: `hooks/useAssistantChat.js` contra el backend (`POST /assistant/chat`, `GET /assistant/conversations[/:id]`).
- El widget `FloatingAssistant` vive en `@/shared` (se monta en `Layout`) y usa el mismo hook; si no hay sesión muestra el CTA de login.
