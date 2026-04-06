# PROMPT-013 — Sede RMX · SalesOrder — Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-24 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

## PROMPTs relacionados

- [PROMPT-012](PROMPT-012-vendor-rmx-schema.md) — misma lógica RMX; Vendor fue la entidad inmediatamente anterior en la cadena de schemas RMX

---

## Contexto

La sede RMX corre QuickBooks Desktop 2021, que solo acepta QBXML versión 13.0. Este patrón ya fue resuelto para:
- **ItemInventory** — PROMPT-007
- **ItemNonInventory** — PROMPT-009
- **ItemService** — PROMPT-010
- **Customer** — PROMPT-011
- **Vendor** — PROMPT-012

La infraestructura de mapeo `config/sede-version-map.json → {"RMX": "13.0"}` ya está en producción.

---

## Acción requerida

Aplicar el mismo patrón a **SalesOrder**:

| Tipo | Acción |
|---|---|
| `SalesOrderAdd` | Clonar/generar schema v13.0 |
| `SalesOrderMod` | Clonar/generar schema v13.0 |
| `SalesOrderQuery` | Clonar/generar schema v13.0 |

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

---

## Respuesta esperada

1. Confirmación de schemas v13.0 disponibles para SalesOrder en RMX
2. Cualquier diferencia respecto a entidades anteriores

LedgerOps ejecuta P2 RMX (business-rules/replace) al confirmar disponibilidad.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-24 | Emisión | PROMPT emitido a LedgerBridge — schemas v13.0 para SalesOrder en sede RMX |
| 2026-03-24 | Resolución | Schemas generados con `lb-xml-version-clone`; patrón idéntico a entidades anteriores |
