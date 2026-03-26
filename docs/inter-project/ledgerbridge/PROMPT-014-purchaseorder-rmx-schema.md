# PROMPT-014 — Sede RMX · PurchaseOrder — Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

---

## Contexto

La sede RMX corre QuickBooks Desktop 2021, que solo acepta QBXML versión 13.0. Este patrón ya fue resuelto para:
- **ItemInventory** — PROMPT-007
- **ItemNonInventory** — PROMPT-009
- **ItemService** — PROMPT-010
- **Customer** — PROMPT-011
- **Vendor** — PROMPT-012
- **SalesOrder** — PROMPT-013

La infraestructura de mapeo `config/sede-version-map.json → {"RMX": "13.0"}` ya está en producción.

---

## Acción requerida

Aplicar el mismo patrón a **PurchaseOrder**:

| Tipo | Acción |
|---|---|
| `PurchaseOrderAdd` | Clonar/generar schema v13.0 |
| `PurchaseOrderMod` | Clonar/generar schema v13.0 |
| `PurchaseOrderQuery` | Clonar/generar schema v13.0 |

LedgerBridge es el experto — aplicar el enfoque que considere más apropiado.

---

## Referencia

| Prompt | Resultado |
|---|---|
| PROMPT-007 (ItemInventory) | ✅ solved |
| PROMPT-009 (ItemNonInventory) | ✅ solved |
| PROMPT-010 (ItemService) | ✅ solved |
| PROMPT-011 (Customer) | ✅ solved |
| PROMPT-012 (Vendor) | ✅ solved |
| PROMPT-013 (SalesOrder) | ✅ solved |

---

## Respuesta esperada

1. Confirmación de schemas v13.0 disponibles para PurchaseOrder en RMX
2. Cualquier diferencia respecto a entidades anteriores

LedgerOps ejecuta P1+P2 RMX al confirmar disponibilidad.
