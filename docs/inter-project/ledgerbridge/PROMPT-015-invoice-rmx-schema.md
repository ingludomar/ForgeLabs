# PROMPT-015 — LedgerBridge · Invoice RMX · Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved (2026-03-25) |

---

## Contexto

Inicio de desarrollo de la entidad **Invoice** (P0). La sede RMX usa QB Desktop 2021 — requiere schemas QBXML v13.0 clonados desde v17.0 antes de poder ejecutar P1+P2 en esa sede.

---

## Acción requerida

Clonar los schemas v17.0 → v13.0 para los siguientes tipos en sede RMX:

| Tipo | Operación |
|---|---|
| `InvoiceAdd` | Add |
| `InvoiceMod` | Mod |
| `InvoiceQuery` | Query |

---

## Respuesta esperada

Confirmación de que los schemas v13.0 están disponibles para InvoiceAdd · InvoiceMod · InvoiceQuery en sede RMX.
