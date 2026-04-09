# PROMPT-001 — Adoptar SemVer como esquema de versioning

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-20 |
| **Proyecto destino** | qbxmlIntegrator |
| **Tipo** | convention |
| **Estado** | ✅ solved |

---

## Contexto

El ecosistema SyncBridge adoptó Semantic Versioning (SemVer) como esquema oficial. Este prompt formaliza la adopción para qbxmlIntegrator.

---

## Esquema acordado

| Componente | Cuándo incrementa |
|---|---|
| `PATCH` (1.0.x) | Bug fix o eliminación de prerrequisito manual |
| `MINOR` (1.x.0) | Feature nuevo compatible hacia atrás |
| `MAJOR` (x.0.0) | Cambio que rompe la interfaz existente |

---

## Reporte confirmado por el proyecto (2026-03-20)

### v1.0.0 — Release inicial estable
Primer commit: `a0984ab` · Fecha: **2025-11-06**

- Estructura modular FastAPI (`/health`, `/qbxml`)
- Autenticación Bearer token
- Integración COM/QBFC con QB Desktop via `win32com.client`
- Método `passthrough()` bidireccional QBXML
- Manejo de errores COM (`QBDComError → HTTP 502`)
- Logger triple: JSONL rotativo + consola + SQLite
- Endpoint `GET /logs` con paginación
- Task Scheduler Windows + `managed/run_api.bat`
- **Limitación:** QB Desktop debía estar abierto manualmente
- **Limitación:** Solo una empresa fija (`COMPANY_FILE` hardcodeado)

### v1.0.1 — Patches en curso
Commit más reciente: `44d79e7` · Fecha: **2026-03-10**

- `BeginSession(COMPANY_FILE, 1)` — QB se abre automáticamente
- Soporte multi-empresa via header `X-Company` (aliases RUS, RRC, TSI)
- `.gitignore` profesional
- Workflow Mac → GitHub → QBAPI-test documentado
- Script de deploy `managed/deploy.bat`
- Rama `dev` para desarrollo aislado

---

## Reflejo en Monday.com

| Item | ID | Estado |
|---|---|---|
| `SyncBridge \| qbxmlIntegrator \| v1.0.0` | `11507020031` | Listo |
| `SyncBridge \| qbxmlIntegrator \| v1.0.1` | pendiente crear | En curso |
