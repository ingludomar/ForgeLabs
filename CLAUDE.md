# Forge Labs Hub — Instrucciones para Claude Code

## Qué es este proyecto

Forge Labs Hub (FLH) es el espacio central de trabajo de **Forge Labs** — el estudio de desarrollo formado por Luis Domínguez y Claude. Es el responsable del ciclo completo de desarrollo de todos los ecosistemas y proyectos — desde el análisis hasta el cierre formal. Gestiona tres tipos de features:

| Tipo | Descripción | Flujo |
|---|---|---|
| **Tipo 1 — Entidad QB** | Integración QB Desktop (ItemInventory, Vendor, etc.) | P0-P5 · correo a Celia Giraldo |
| **Tipo 2 — Feature de plataforma** | Funcionalidad Redix visible al usuario (QB Playground, Webhook Admin) | F1-F8 · correo a Luis Potte CC Mike Habib |
| **Tipo 3 — Infraestructura** | Mejora interna sin entrega al usuario (singleton, DB migration) | I1-I4 · sin correo |

Ver proceso completo: `docs/development/feature-dev-process.md`

**FLH hace todo. Los proyectos técnicos reciben PROMPTs y ejecutan.**

---

## Comunicación
- Con el usuario: **español**
- Código, paths, nombres técnicos: **inglés**
- Documentación: **español**

---

## El ecosistema — 5 componentes

| Proyecto | Rol | Repo local |
|---|---|---|
| **LedgerOps** | Capa de aplicación N8N. Expone webhooks, valida, aplica reglas de negocio, delega a LedgerExec. | `/Users/luisdominguez/Documents/GitHub/LedgerOps` |
| **LedgerExec** | Orquestador N8N genérico. Recibe de LedgerOps, invoca LedgerBridge vía SSH. Sin lógica de negocio. | — |
| **LedgerBridge** | Fuente de verdad. Construye QBXML, valida schemas, aplica business rules, parsea respuestas QB. | `/opt/LedgerBridge` |
| **qbxmlIntegrator** | Interfaz COM. Recibe QBXML de LedgerBridge, lo ejecuta en QB Desktop via win32com. | `/Users/luisdominguez/Documents/GitHub/qbxmlIntegrator` |
| **LedgerCore** | Evolución de LedgerBridge como producto multi-empresa. Reemplaza archivos por PostgreSQL. Incluye templates de formulario configurables por sede. LedgerBridge sigue operando sin cambios. | `/Users/luisdominguez/Documents/GitHub/LedgerCore` |

---

## Relación de SB con cada proyecto

```
SB
    ├── Ejecuta P0-P5 completo de cada entidad
    ├── Dirige vía PROMPT → LedgerBridge (business rules, schemas)
    ├── Dirige vía PROMPT → LedgerExec
    ├── Dirige vía PROMPT → qbxmlIntegrator
    └── Genera PROMPT final → LO aplica archivos + commit
```

**SB nunca modifica código de LedgerBridge, LedgerExec ni qbxmlIntegrator.**
**SB nunca hace commit en LO — genera el PROMPT y LO lo ejecuta.**

---

## Flujo de trabajo de SB

**Tipo 1 — Entidad QB:**
```
P0  PROMPT RMX global → LedgerBridge (una sola vez por entidad)
P1  AnalyzeSedeFields en todas las sedes
P2  business-rules/replace en todas las sedes (Add + Mod)
P3  Workflow en LedgerGateway/development/ → N8N → activar → probar
P4  Testing CRUD en TEST → verified.json → mover a LedgerGateway/production/
P5  Docs por rol → PROMPT a LO → LO confirma → correo Celia → Monday
```

**Tipo 2 — Feature de plataforma:**
```
F1  PROMPT con propuesta de diseño → SB aprueba
F2  Implementación confirmada en el PROMPT
F3  E2E desde el UI de Redix (no solo API)
F4  Docs 5 roles → PROMPT a LO → LO confirma
F5  Push del proyecto responsable confirmado
F6  Correo Luis Potte CC Mike Habib → usuario confirma
F7  Monday (work item + delivery item)
F8  Commit en ForgeLabs Hub
```

**Tipo 3 — Infraestructura:**
```
I1  PROMPT con propuesta → FLH aprueba
I2  Implementación confirmada
I3  Verificación técnica E2E
I4  Push confirmado → commit en ForgeLabs Hub
```

---

## Estructura de trabajo

```
LedgerGateway/development/    ← entidad en proceso (workflow, tests, docs en borrador)
LedgerGateway/production/     ← entidad verificada, lista para clonar en LO
```

Cuando P4 completo → mover de `LedgerGateway/development/` a `LedgerGateway/production/`.

---

## PROMPTs — regla de emisión

Todo hallazgo que requiere acción en otro proyecto se documenta como PROMPT antes de comunicarlo.
Ver estándar completo: `methodology/prompts-standard.md`

**Ubicación:** `docs/inter-project/{proyecto}/PROMPT-{NNN}-{tema}.md`
**Índice:** `docs/inter-project/README.md`

---

## Infraestructura del ecosistema

- **N8N base:** `https://n8n-development.redsis.ai/webhook/`
- **N8N API:** `https://n8n-development.redsis.ai/api/v1`
- **LedgerBridge tools:** `https://n8n-development.redsis.ai/webhook/` (describe, business-rules, analyze-sede-fields, etc.)
- **Sede de pruebas:** `TEST` — nunca usar REC, RUS, RBR, RMX sin confirmación explícita

---

## Sedes del ecosistema

| Sede | QB Desktop | QBXML | Tipo |
|---|---|---|---|
| TEST | 2024 | 17.0 | Pruebas |
| RUS | 2024 | 17.0 | Producción |
| REC | 2024 | 17.0 | Producción |
| RBR | 2024 | 17.0 | Producción |
| RMX | 2021 | 13.0 | Producción — LB remapea versión |
| TSI | — | — | Pendiente |
| RRC | — | — | Pendiente |

**Regla RMX:** Emitir PROMPT a LedgerBridge al inicio de cada entidad nueva — necesita schemas v13.0 antes de P1+P2.

---

## Monday.com

LedgerOps gestiona Monday para todo el ecosistema. Ver estándar: `methodology/monday-standard.md`

- **Board:** `18386559547` (Quickbooks Tools)
- **Owner (Luis):** `56420968`

---

## Estructura del proyecto

| Carpeta | Contenido |
|---|---|
| `LedgerGateway/` | Ecosistema QB Desktop — development, production, architecture |
| `Redix/` | Ecosistema Redix ERP — RIQ y proyectos futuros |
| `methodology/` | WF Tipo 1/2/3, estándar de entrega, PROMPTs, Monday |
| `research/` | Investigaciones por proyecto y generales |
| `roadmap/` | Estado actual de entidades y sedes |
| `docs/inter-project/` | PROMPTs emitidos a otros proyectos (fuente de verdad) |
| `docs/development/` | Proceso de desarrollo, tipos XML, casos de prueba |

---

## REGLA CRÍTICA — Antes de responder cualquier petición

Antes de responder, identificar qué tipo de tarea es y leer el archivo correspondiente. **Nunca responder de memoria.**

| Si el usuario pide... | Leer primero |
|---|---|
| Correo de entrega de una entidad QB (Tipo 1) | `docs/development/release-notification-template.md` |
| Correo de entrega de un feature de plataforma (Tipo 2) | `docs/development/feature-dev-process.md` → sección F6 |
| Estado de una entidad o qué sigue | `docs/development/roadmap.md` |
| Planificar cualquier tipo de feature | `docs/development/feature-dev-process.md` |
| Emitir un PROMPT a otro proyecto | `docs/inter-project/README.md` |
| Casos de prueba o testing | `docs/development/test-cases.md` |
| Tipos XML disponibles | `docs/development/xml-types.md` |
| PROMPTs previos a un proyecto | `docs/inter-project/{proyecto}/` |

---

## Correo de entrega (P5) — formato exacto

Cuando el usuario pida el correo de entrega de una entidad, entregar EXACTAMENTE esto — reemplazando solo `{Entidad}`, `{descripcion}` y `{accion}`:

ASUNTO:
```
[LedgerOps] ✅ {Entidad} — Add · Mod · Query lista para testing (TEST · RUS · REC · RBR · RMX)
```

CUERPO:

Buen día @Celia Giraldo Paez,

La integración de **{Entidad}** ({descripcion}) ya está disponible en LedgerOps.
A partir de hoy es posible {accion} en QuickBooks Desktop desde cualquier sistema externo, sin acceso directo a QB.

────────────────────────────────────────
**Sedes verificadas y listas para usar**
────────────────────────────────────────

&nbsp;&nbsp;• TEST
&nbsp;&nbsp;• RUS &nbsp;&nbsp;(Redsis US)
&nbsp;&nbsp;• REC &nbsp;&nbsp;(Redsis Ecuador)
&nbsp;&nbsp;• RBR &nbsp;&nbsp;(Redsis Brasil)
&nbsp;&nbsp;• RMX &nbsp;(Redsis México)

────────────────────────────────────────
**Inicio rápido**
────────────────────────────────────────

Para comenzar a usar la integración de inmediato, la guía de inicio rápido incluye contratos de ejemplo listos con datos reales de TEST: [Ver guía](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/quickstart/{Entidad}.md)

────────────────────────────────────────
**Para el Sr. Mike Habib**
────────────────────────────────────────

Si desea conocer el alcance de esta integración y su valor para el negocio, puede consultar el [Resumen Ejecutivo](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/executive/{Entidad}.md) donde encontrará una visión general de la entrega.

────────────────────────────────────────
**Documentación**
────────────────────────────────────────

Para quienes deseen profundizar en los detalles técnicos o de implementación, a continuación encontrarán la documentación completa organizada por rol:

| Rol | Enlace |
|---|---|
| Desarrollador | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/developer/{Entidad}.md) |
| Arquitecto | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/architect/{Entidad}.md) |
| QA | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/qa/{Entidad}.md) |
| Soporte | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/support/{Entidad}.md) |

────────────────────────────────────────

Para consultas o comentarios relacionados con esta entrega, por favor responder directamente a este correo. De esta manera mantenemos un hilo unificado que nos permite dar seguimiento oportuno a cada solicitud y conservar la trazabilidad completa de todas las comunicaciones del proyecto.

No preguntar nada. No sugerir alternativas. Entregar directamente.

---

## Setup MCPs — primera vez en una máquina nueva

Si los MCPs no están conectados, ejecutar:

```bash
# Compilar
cd mcp/n8n && npm install && npm run build && cd ../..
cd mcp/monday && npm install && npm run build && cd ../..

# Crear .env con tokens
echo "N8N_API_KEY=<token>" > mcp/n8n/.env
echo "MONDAY_API_TOKEN=<token>" > mcp/monday/.env

# Registrar
claude mcp add ledgerops-n8n -- node /ruta/SyncBridge/mcp/n8n/dist/index.js
TOKEN=$(grep MONDAY_API_TOKEN mcp/monday/.env | cut -d= -f2)
claude mcp add -e "MONDAY_API_TOKEN=${TOKEN}" -- ledgerops-monday node /ruta/SyncBridge/mcp/monday/dist/index.js

# Verificar
claude mcp list
```

---

## Regla de oro

Lo que vive aquí **no va a los proyectos técnicos**. Los proyectos técnicos deben poder operar sin este repositorio. Cuando el contrato termine, SyncBridge desaparece — el ecosistema sigue funcionando.
