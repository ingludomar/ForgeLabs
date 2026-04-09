# PROMPT-002 — Entrega formal · Estándar de documentación por rol

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-21 |
| **Proyecto destino** | LedgerExec |
| **Tipo** | standard |
| **Estado** | ✅ solved |

---

## Contexto

El ecosistema SyncBridge ha establecido un estándar de documentación por rol para todas las entregas formales. qbxmlIntegrator y LedgerBridge ya lo implementaron como referencia.

La entrega formal cubre la **versión estable verificada en producción**. El trabajo adelantado que no ha sido probado no forma parte de la entrega — se declara como limitación o versión en curso.

---

## Estándar de documentación requerido

```
docs/integration/
├── quickstart/     ← para todos — cómo interactuar con el tool con ejemplos reales
├── executive/      ← qué problema resuelve, valor en el ecosistema, limitaciones
├── developer/      ← endpoints, payloads, ejemplos, qué cambiar
├── architect/      ← diseño, decisiones técnicas, dependencias del ecosistema
├── qa/             ← casos de prueba, resultados verificados, issues conocidos
└── support/        ← catálogo de errores, troubleshooting
```

---

## Acción requerida — 3 pasos

### Paso 1 — Auditoría de documentación existente

Listar toda la documentación actual e indicar:
- Qué docs existen y dónde están
- Qué cubre cada uno
- Qué falta para cumplir el estándar

### Paso 2 — Crear docs faltantes

| Carpeta | Contenido esperado |
|---|---|
| `quickstart/` | Cómo invocar LedgerExec, ejemplo de request/response real, qué cambiar para pruebas |
| `executive/` | Qué es LedgerExec, qué problema resuelve en el ecosistema, limitaciones actuales |
| `developer/` | Endpoint `/webhook/ledgerexec`, estructura del payload, manejo de errores, routing a LedgerBridge |
| `architect/` | Posición en el ecosistema, decisiones de diseño, gestión de sesiones QB, dependencias |
| `qa/` | Casos de prueba verificados, issues conocidos |
| `support/` | Catálogo de errores, troubleshooting, logs |

### Paso 3 — Crear RELEASE-v{X}.{Y}.{Z}.md

Solo incluir lo verificado en producción. Formato:

```markdown
# RELEASE — LedgerExec v{X}.{Y}.{Z}

| Campo | Detalle |
|---|---|
| Versión | X.Y.Z |
| Fecha de cierre | YYYY-MM-DD |
| Commit | {hash} |
| GitHub | {url} |

## Cambios verificados en producción
{lista}

## Limitaciones conocidas
{lista}

## Contexto en el ecosistema
LedgerExec es el orquestador genérico del ecosistema SyncBridge.
Recibe instrucciones de LedgerOps y las enruta a LedgerBridge via SSH
sin contener lógica de negocio propia.
```

---

## Respuesta esperada

Reportar a LedgerOps:
1. Lista de docs existentes (con paths)
2. Docs creados (con paths)
3. Contenido de `RELEASE-v{X}.{Y}.{Z}.md`
4. URL del repositorio en GitHub
5. Versión entregada y versión en curso (si aplica)

LedgerOps se encarga de registrar en Monday.com y coordinar el correo de entrega.

---

## Reporte recibido — 2026-03-21 · commit `bf011b0`

### Documentación existente auditada
`docs/ARCHITECTURE.md` · `docs/CHANGELOG.md` · `docs/CONTRACT.md` · `docs/NODES.md` — ninguno cumplía el estándar por rol.

### Documentos creados — integration/
`quickstart/index.md` · `executive/index.md` · `developer/index.md` · `architect/index.md` · `qa/index.md` (5 casos, 3 issues) · `support/index.md` · `releases/RELEASE-v1.0.0.md`

### RELEASE-v1.0.0.md
- Versión entregada: **v1.0.0** · Fecha de cierre: 2026-02-23 · Commit: `4060dd8`
- GitHub: https://github.com/redsis-rgh/LedgerExec
- Cambios verificados: flujo completo, parser QB XML→JSON, respuestas estandarizadas, routing 5 sedes, manejo de errores en todos los nodos
- Limitaciones: QB Desktop manual, sin auth en webhook, bug BarCode en LedgerBridge (v17.0), sin retry automático

### Versión en curso
v1.0.1 — Normalize Input node + fix unwrap + documentación formal + SemVer

---

## Referencia Monday.com

| Item | ID |
|---|---|
| LedgerExec \| Entrega formal | `11559199010` |

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-21 | Emisión | PROMPT emitido a LedgerExec — estándar de documentación por rol para entrega formal |
| 2026-03-21 | Resolución | Docs `integration/` creados (6 roles), RELEASE-v1.0.0.md generado (commit `bf011b0`) |
