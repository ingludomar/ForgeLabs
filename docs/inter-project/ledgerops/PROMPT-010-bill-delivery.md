# PROMPT-010 — LedgerOps · Entrega Bill · Add · Mod · Query

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | delivery |
| **Estado** | ✅ solved — v1.9.0 (2026-03-25) |

---

## Contexto

P4 de Bill completado en sede TEST. Los 3 workflows están activos en N8N. Docs por los 6 roles creados en el repo LedgerOps.

---

## Acción requerida

Aplicar los siguientes archivos al repo LedgerOps y hacer commit:

### Workflows N8N (ya activos — registrar en repo)

Los 3 workflows están activos en N8N production. Los archivos JSON se encuentran en:

| Archivo | Path en repo |
|---|---|
| `LedgerOps-BillAdd.workflow.json` | `docs/integration/workflows/` *(si aplica — seguir convención del repo)* |
| `LedgerOps-BillMod.workflow.json` | ídem |
| `LedgerOps-BillQuery.workflow.json` | ídem |

### Documentación de integración (6 archivos)

| Archivo | Ruta |
|---|---|
| `Bill.md` | `docs/integration/developer/Bill.md` |
| `Bill.md` | `docs/integration/quickstart/Bill.md` |
| `Bill.md` | `docs/integration/architect/Bill.md` |
| `Bill.md` | `docs/integration/qa/Bill.md` |
| `Bill.md` | `docs/integration/support/Bill.md` |
| `Bill.md` | `docs/integration/executive/Bill.md` |

Los 6 archivos ya están escritos en el repo local de LedgerOps.

---

## Respuesta esperada

Confirmación de commit aplicado con los 6 archivos de documentación.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-25 | Emisión | PROMPT emitido a LedgerOps — entrega de Bill (Add · Mod · Query) con docs de 6 roles |
| 2026-03-25 | Resolución | Docs aplicados al repo (v1.9.0) |
