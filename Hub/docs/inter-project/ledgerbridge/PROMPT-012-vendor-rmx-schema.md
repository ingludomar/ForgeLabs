# PROMPT-012 — Sede RMX · Vendor — Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-23 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

## PROMPTs relacionados

- [PROMPT-007](PROMPT-007-rmx-sede-schema.md) — primer schema RMX; infraestructura de mapeo usada en este PROMPT
- [PROMPT-009](PROMPT-009-noninventory-rmx-schema.md) — misma lógica RMX aplicada a ItemNonInventory
- [PROMPT-010](PROMPT-010-service-rmx-schema.md) — misma lógica RMX aplicada a ItemService
- [PROMPT-011](PROMPT-011-customer-rmx-schema.md) — misma lógica RMX aplicada a Customer

---

## Contexto

La sede RMX corre QuickBooks Desktop 2021, que solo acepta QBXML versión 13.0. Este patrón ya fue resuelto para:
- **ItemInventory** — PROMPT-007
- **ItemNonInventory** — PROMPT-009
- **ItemService** — PROMPT-010
- **Customer** — PROMPT-011

La infraestructura de mapeo `config/sede-version-map.json → {"RMX": "13.0"}` ya está en producción.

---

## Acción requerida

Aplicar el mismo patrón a **Vendor**:

| Tipo | Acción |
|---|---|
| `VendorAdd` | Clonar/generar schema v13.0 |
| `VendorMod` | Clonar/generar schema v13.0 |
| `VendorQuery` | Clonar/generar schema v13.0 |

LedgerBridge es el experto — aplicar el enfoque que considere más apropiado.

---

## Referencia

| Prompt | Resultado |
|---|---|
| PROMPT-007 (ItemInventory) | ✅ solved |
| PROMPT-009 (ItemNonInventory) | ✅ solved |
| PROMPT-010 (ItemService) | ✅ solved |
| PROMPT-011 (Customer) | ✅ solved |

---

## Respuesta esperada

1. Confirmación de schemas v13.0 disponibles para Vendor en RMX
2. Cualquier diferencia respecto a entidades anteriores

LedgerOps ejecuta P2 RMX (business-rules/replace) al confirmar disponibilidad.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-23 | Emisión | PROMPT emitido a LedgerBridge — schemas v13.0 para Vendor en sede RMX |
| 2026-03-23 | Resolución | Schemas generados con `lb-xml-version-clone`; patrón idéntico a entidades anteriores |
