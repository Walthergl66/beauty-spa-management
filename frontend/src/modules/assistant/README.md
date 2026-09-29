# Módulo assistant

Asistente virtual: página full (`/assistant`) + widget flotante global.

- Página: `pages/assistant/` (chat + sidebar de conversaciones).
- El widget `FloatingAssistant` vive en `@/shared` (se monta en `Layout`) y comparte datos de `@/mocks` (`initialMessages`, `quickActions`, `simulatedReply`).
- Pendiente: conectar a `POST /api/v1/assistant/chat` del backend.
