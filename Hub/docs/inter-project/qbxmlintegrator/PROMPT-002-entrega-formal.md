# PROMPT-002 — Entrega formal v1.0.1 · Estándar de documentación por rol

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-21 |
| **Proyecto destino** | qbxmlIntegrator |
| **Tipo** | standard |
| **Estado** | ✅ solved |

---

## Contexto

El ecosistema SyncBridge ha establecido un estándar de documentación por rol para todas las entregas formales. LedgerOps ya lo implementó para ItemInventory como referencia.

qbxmlIntegrator está en **v1.0.0** como versión estable y entregable. Existe trabajo adelantado hacia v1.0.1 (multi-empresa) pero aún no está verificado — la entrega formal cubre únicamente lo probado en producción.

---

## Estándar de documentación requerido

Cada proyecto debe tener la siguiente estructura dentro de su repositorio:

```
docs/integration/
├── quickstart/     ← para todos — cómo usar el proyecto con ejemplos reales
├── executive/      ← resumen de negocio para gerencia y dueños
├── developer/      ← endpoints, payloads, ejemplos, qué cambiar
├── architect/      ← diseño, decisiones técnicas, dependencias del ecosistema
├── qa/             ← casos de prueba, resultados verificados, issues conocidos
└── support/        ← catálogo de errores, troubleshooting
```

---

## Acción requerida — 3 pasos

### Paso 1 — Auditoría de documentación existente

Listar toda la documentación actual del proyecto e indicar:
- Qué docs existen y dónde están
- Qué cubre cada uno
- Qué falta para cumplir el estándar

### Paso 2 — Crear docs faltantes

Para cada carpeta del estándar que no esté cubierta, generar el documento correspondiente. Referencia de contenido por carpeta:

| Carpeta | Contenido esperado |
|---|---|
| `quickstart/` | Cómo levantar el servicio, endpoint `/qbxml`, ejemplo de request/response con datos reales, qué cambiar para pruebas propias |
| `executive/` | Qué es qbxmlIntegrator, qué problema resuelve, en qué sedes opera, limitaciones actuales |
| `developer/` | Endpoints disponibles (`/health`, `/qbxml`, `/logs`), autenticación Bearer, estructura del request, manejo de errores |
| `architect/` | Posición en el ecosistema SyncBridge, integración COM/QBFC, decisiones de diseño, dependencias |
| `qa/` | Casos de prueba verificados, cómo ejecutar pruebas, versiones testeadas |
| `support/` | Errores comunes (`QBDComError`, `HTTP 502`, etc.), troubleshooting, qué verificar cuando falla |

### Paso 3 — Crear RELEASE-v1.0.0.md

Siguiendo el template del ecosistema. **Solo incluir lo verificado en producción** — no incluir features de v1.0.1 que no hayan sido probados.

```markdown
# RELEASE — qbxmlIntegrator v1.0.0

| Campo | Detalle |
|---|---|
| Versión | 1.0.1 |
| Fecha de cierre | YYYY-MM-DD |
| Commit | {hash} |
| GitHub | {url} |

## Cambios incluidos
{lista de cambios desde v1.0.0}

## Limitaciones conocidas
{lista}

## Contexto en el ecosistema
qbxmlIntegrator es la interfaz COM entre LedgerBridge y QB Desktop.
Recibe QBXML via HTTP y lo ejecuta en QB Desktop via win32com.
```

---

## Respuesta esperada

Reportar a LedgerOps:
1. Lista de docs existentes (con paths)
2. Docs creados (con paths)
3. Contenido de `RELEASE-v1.0.1.md`
4. URL del repositorio en GitHub

LedgerOps se encarga de registrar en Monday.com y coordinar el correo de entrega al equipo.

---

## Reporte recibido — 2026-03-21 · commit `f12123a` (rama dev)

### Documentación existente auditada
| Documento | Path | Cubría |
|---|---|---|
| Bitácora de desarrollo | `docs/bitacora.md` | Historial de fases, versioning, workflow |
| Release v1.0.0 | `docs/RELEASE-v1.0.0.md` | Notas de release inicial |
| README principal | `README.md` | Instalación, contrato HTTP, multi-empresa |
| CLAUDE.md | `CLAUDE.md` | Uso interno del asistente |
| docs/integration/ | — | Vacío — no existía |

### Documentos creados
| Carpeta | Path |
|---|---|
| quickstart/ | `docs/integration/quickstart/index.md` |
| executive/ | `docs/integration/executive/index.md` |
| developer/ | `docs/integration/developer/index.md` |
| architect/ | `docs/integration/architect/index.md` |
| qa/ | `docs/integration/qa/index.md` |
| support/ | `docs/integration/support/index.md` |

### RELEASE-v1.0.1.md
- Path: `docs/RELEASE-v1.0.0.md`
- Versión: 1.0.0 · Fecha de cierre: 2026-03-21 · Commit: `c30b034`
- GitHub: https://github.com/redsis-rgh/qbxmlIntegrator

### Cambios verificados en producción
- API FastAPI `/health`, `/qbxml`, `/logs` + autenticación Bearer token
- Integración COM/QBFC real con QB Desktop (CompanyQueryRq / CompanyRet OK)
- QB auto-open: `BeginSession(COMPANY_FILE, omMultiUser=1)`
- Logger triple: JSONL + consola + SQLite con purge 14 días
- Task Scheduler + `managed/deploy.bat`

### Limitaciones declaradas
- Empresa única en v1.0.0 — multi-empresa (`X-Company`) implementado pero pendiente de pruebas → v1.0.1
- Tarea programada requiere usuario interactivo (no sesión 0)
- Primera conexión requiere aprobación manual en QB

---

## Referencia Monday.com

| Item | ID |
|---|---|
| qbxmlIntegrator \| Entrega formal | `11559194978` |
