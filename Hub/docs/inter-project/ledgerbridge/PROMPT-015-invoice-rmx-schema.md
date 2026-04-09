# PROMPT-015 — LedgerBridge · Invoice RMX · Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved (2026-03-25) |

## PROMPTs relacionados

- [PROMPT-013](PROMPT-013-salesorder-rmx-schema.md) — misma lógica RMX aplicada a SalesOrder
- [PROMPT-014](PROMPT-014-purchaseorder-rmx-schema.md) — misma lógica RMX aplicada a PurchaseOrder

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

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-25 | Emisión | PROMPT emitido a LedgerBridge — schemas v13.0 para Invoice en sede RMX |
| 2026-03-25 | Resolución | Schemas generados con `lb-xml-version-clone`; InvoiceAdd · InvoiceMod · InvoiceQuery disponibles en RMX |
