# PROMPT-009 — LedgerOps · Entrega Invoice · Add · Mod · Query

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | delivery |
| **Estado** | ✅ solved — v1.8.0 (2026-03-25) |

---

## Contexto

P4 de Invoice completado en sede TEST. Los 3 workflows están activos en N8N. Docs por los 6 roles creados en el repo LedgerOps.

---

## Acción requerida

Aplicar los siguientes archivos al repo LedgerOps y hacer commit:

### Workflows N8N (ya activos — registrar en repo)

Los 3 workflows están activos en N8N production. Los archivos JSON se encuentran en:

| Archivo | Path en repo |
|---|---|
| `LedgerOps-InvoiceAdd.workflow.json` | `docs/integration/workflows/` *(si aplica — seguir convención del repo)* |
| `LedgerOps-InvoiceMod.workflow.json` | ídem |
| `LedgerOps-InvoiceQuery.workflow.json` | ídem |

### Documentación de integración (6 archivos)

| Archivo | Ruta |
|---|---|
| `Invoice.md` | `docs/integration/developer/Invoice.md` |
| `Invoice.md` | `docs/integration/quickstart/Invoice.md` |
| `Invoice.md` | `docs/integration/architect/Invoice.md` |
| `Invoice.md` | `docs/integration/qa/Invoice.md` |
| `Invoice.md` | `docs/integration/support/Invoice.md` |
| `Invoice.md` | `docs/integration/executive/Invoice.md` |

Los 6 archivos ya están escritos en el repo local de LedgerOps.

---

## Respuesta esperada

Confirmación de commit aplicado con los 6 archivos de documentación.
