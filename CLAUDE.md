# SyncBridge — Instrucciones para Claude Code

## Qué es este proyecto

SyncBridge es el timón del ecosistema. No es un componente técnico — es el espacio donde se planifica, se decide y se dirige. No se despliega, no tiene webhooks, no tiene código de producción.

Cuando el usuario abre SyncBridge, el modo es **planificación y dirección**. Cuando necesita implementar, abre LedgerOps.

---

## Comunicación
- Con el usuario: **español**
- Código, paths, nombres técnicos: **inglés**
- Documentación: **español**

---

## El ecosistema — 4 componentes

| Proyecto | Rol | Repo local |
|---|---|---|
| **LedgerOps** | Capa de aplicación N8N. Expone webhooks, valida, aplica reglas de negocio, delega a LedgerExec. | `/Users/luisdominguez/Documents/GitHub/LedgerOps` |
| **LedgerExec** | Orquestador N8N genérico. Recibe de LedgerOps, invoca LedgerBridge vía SSH. Sin lógica de negocio. | — |
| **LedgerBridge** | Fuente de verdad. Construye QBXML, valida schemas, aplica business rules, parsea respuestas QB. | `/opt/LedgerBridge` |
| **qbxmlIntegrator** | Interfaz COM. Recibe QBXML de LedgerBridge, lo ejecuta en QB Desktop via win32com. | `/Users/luisdominguez/Documents/GitHub/qbxmlIntegrator` |

---

## Relación de SyncBridge con cada proyecto

```
SyncBridge
    ├── Dirige vía PROMPT → LedgerBridge
    ├── Dirige vía PROMPT → LedgerExec
    ├── Dirige vía PROMPT → qbxmlIntegrator
    └── Planifica → el usuario implementa abriendo LedgerOps
```

**SyncBridge nunca modifica código de LedgerBridge, LedgerExec ni qbxmlIntegrator.**
Puede leer esos proyectos para recopilar evidencia técnica al construir un PROMPT.
La implementación de LedgerOps ocurre en el proyecto LedgerOps — no aquí.

---

## Modo de trabajo en SyncBridge

### Cuándo estás aquí, el agente debe:
- Planificar entidades nuevas y el ciclo P1-P5
- Redactar PROMPTs a otros proyectos con contexto técnico completo
- Actualizar roadmap, decisiones (ADRs) e ideas
- Proponer y discutir arquitectura
- Preparar el plan de implementación para que el usuario lo ejecute en LedgerOps

### Cuándo NO:
- Modificar workflows de LedgerOps directamente
- Ejecutar comandos curl de testing (eso es P4 en LedgerOps)
- Modificar código de LedgerBridge, LedgerExec ni qbxmlIntegrator

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
| `ecosystem/` | Arquitectura, roles de los 4 componentes, convenciones, ADRs |
| `methodology/` | P1-P5, estándar de entrega, PROMPTs, Monday |
| `roadmap/` | Estado actual de entidades y sedes |
| `ideas/` | Borradores, experimentos, conversaciones |
| `docs/inter-project/` | PROMPTs emitidos a otros proyectos (fuente de verdad) |
| `docs/development/` | Proceso de desarrollo, tipos XML, casos de prueba |

---

## REGLA CRÍTICA — Antes de responder cualquier petición

Antes de responder, identificar qué tipo de tarea es y leer el archivo correspondiente. **Nunca responder de memoria.**

| Si el usuario pide... | Leer primero |
|---|---|
| Correo de entrega de una entidad | `docs/development/release-notification-template.md` |
| Estado de una entidad o qué sigue | `docs/development/roadmap.md` |
| Planificar una entidad nueva | `docs/development/feature-dev-process.md` |
| Emitir un PROMPT a otro proyecto | `docs/inter-project/README.md` |
| Casos de prueba o testing | `docs/development/test-cases.md` |
| Tipos XML disponibles | `docs/development/xml-types.md` |
| PROMPTs previos a un proyecto | `docs/inter-project/{proyecto}/` |

---

## REGLA CRÍTICA — Correo de entrega (P5)

Cuando el usuario pida el correo de entrega de una entidad:

1. **LEER** el archivo `docs/development/release-notification-template.md` ANTES de generar cualquier texto
2. **COPIAR** la sección "EJEMPLO REAL — Vendor" como base
3. **REEMPLAZAR** únicamente `Vendor`, `proveedores` y la acción por los valores de la entidad actual
4. **NUNCA** generar el correo de memoria — siempre leer el template primero
5. **NUNCA** omitir los links `[texto](URL)` de la tabla de documentación
6. **NUNCA** reemplazar los separadores `────` por `---` o headers markdown
7. **NUNCA** agregar texto, preguntas ni comentarios después de "Quedamos atentos ante cualquier consulta."

Entregar ASUNTO y CUERPO listos para copiar y pegar. Nada más.

---

## Regla de oro

Lo que vive aquí **no va a los proyectos técnicos**. Los proyectos técnicos deben poder operar sin este repositorio. Cuando el contrato termine, SyncBridge desaparece — el ecosistema sigue funcionando.
