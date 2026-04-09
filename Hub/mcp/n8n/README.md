# LedgerOps — MCP Server para N8N

Servidor MCP (Model Context Protocol) que expone la API REST de N8N como herramientas para agentes de IA compatibles (Claude Code, Claude Desktop).

---

## Requisitos

- Node.js 18+
- npm
- Acceso a la instancia N8N con API key

---

## Setup

### 1. Instalar dependencias

```bash
cd mcp/n8n
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
N8N_BASE_URL=https://n8n-development.redsis.ai
N8N_API_KEY=tu_api_key_aqui
```

La API key se obtiene en N8N → Settings → API → Create API Key.

### 3. Compilar

```bash
npm run build
```

Genera `dist/index.js`.

### 4. Registrar en Claude Code

```bash
claude mcp add ledgerops-n8n node /ruta/absoluta/LedgerOps/mcp/n8n/dist/index.js
```

Verificar que esté conectado:

```bash
claude mcp list
```

Debe aparecer `ledgerops-n8n: ✓ Connected`.

---

## Herramientas expuestas

| Herramienta | Parámetros | Descripción |
|---|---|---|
| `n8n_list_workflows` | — | Lista todos los workflows (id, nombre, activo, tags) |
| `n8n_get_workflow` | `id` | JSON completo de un workflow |
| `n8n_create_workflow` | `workflow` (JSON) | Crea un workflow nuevo |
| `n8n_update_workflow` | `id`, `workflow` (JSON) | Reemplaza un workflow existente |
| `n8n_activate_workflow` | `id` | Activa el webhook del workflow |
| `n8n_deactivate_workflow` | `id` | Desactiva el webhook |
| `n8n_delete_workflow` | `id` | Elimina permanentemente |
| `n8n_get_executions` | `workflowId?`, `limit?` | Ejecuciones recientes |
| `n8n_get_execution` | `id` | Detalle completo de una ejecución |

---

## Flujo típico con Claude Code

1. **Listar** workflows existentes → `n8n_list_workflows`
2. **Crear o actualizar** un workflow → `n8n_create_workflow` / `n8n_update_workflow`
3. **Guardar** el JSON en `workflows/{module}/LedgerOps-{EntityAction}.workflow.json`
4. **Activar** desde la UI de N8N (no por API — ver nota abajo)
5. **Hacer commit** en el repo

> **Nota crítica:** Activar via API (`n8n_activate_workflow`) registra el workflow como activo en la base de datos, pero puede no registrar el webhook en el router interno de N8N. Siempre confirmar activación desde la UI con el toggle.

---

## Si usas otro agente (Codex, Gemini CLI, etc.)

Este MCP usa el protocolo de Anthropic y no es compatible directamente con otros agentes. Para trabajar con N8N desde otra IA, usa la API REST directamente:

```
Base URL : https://n8n-development.redsis.ai/api/v1
Auth     : Header  X-N8N-API-KEY: <key>

GET    /workflows           → listar
POST   /workflows           → crear
GET    /workflows/{id}      → obtener
PUT    /workflows/{id}      → actualizar
DELETE /workflows/{id}      → eliminar
POST   /workflows/{id}/activate    → activar
POST   /workflows/{id}/deactivate  → desactivar
GET    /executions          → listar ejecuciones
GET    /executions/{id}     → detalle
```

Consultar también `CLAUDE.md` en la raíz del repo para convenciones completas del proyecto.

---

## Recompilar tras cambios

```bash
cd mcp/n8n
npm run build
```

Claude Code recarga el MCP automáticamente al iniciar una nueva sesión.
