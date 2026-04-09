# PROMPT-017 — LedgerBridge · CreditCardCharge · Schemas v17.0 + v13.0 RMX

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-26 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved — v17.0 + v13.0 RMX disponibles (2026-03-26) |

## PROMPTs relacionados

- [PROMPT-013](PROMPT-013-salesorder-rmx-schema.md) — misma lógica RMX; parte de la cadena de schemas para todas las entidades
- [PROMPT-014](PROMPT-014-purchaseorder-rmx-schema.md) — misma lógica RMX aplicada a PurchaseOrder
- [PROMPT-015](PROMPT-015-invoice-rmx-schema.md) — misma lógica RMX aplicada a Invoice
- [PROMPT-016](PROMPT-016-bill-rmx-schema.md) — misma lógica RMX aplicada a Bill

---

## Contexto

Inicio de desarrollo de la entidad **CreditCardCharge** (posición 13 en roadmap). LedgerBridge no tiene schemas cargados para ninguno de los tipos QBXML de esta entidad — ni en v17.0 ni en v13.0.

El endpoint `/webhook/tools/describe` retorna 404 para `CreditCardChargeAdd`, `CreditCardChargeMod` y `CreditCardChargeQuery` en todas las sedes.

---

## Acción requerida

1. **Cargar schemas v17.0** para las siguientes operaciones (sedes TEST · RUS · REC · RBR):

| Tipo | Operación |
|---|---|
| `CreditCardChargeAdd` | Add |
| `CreditCardChargeMod` | Mod |
| `CreditCardChargeQuery` | Query |

2. **Clonar schemas v13.0** para sede RMX (QB Desktop 2021) — mismo patrón que BillAdd/Mod/Query PROMPT-016:

| Tipo | Operación |
|---|---|
| `CreditCardChargeAdd` | Add |
| `CreditCardChargeMod` | Mod |
| `CreditCardChargeQuery` | Query |

---

## Respuesta esperada

Confirmación de que describe retorna 200 para los 3 tipos en sede TEST (v17.0) y sede RMX (v13.0).

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-26 | Emisión | PROMPT emitido a LedgerBridge — schemas v17.0 + v13.0 RMX para CreditCardCharge (no tenía schemas previos) |
| 2026-03-26 | Resolución | Schemas v17.0 cargados desde SDK y v13.0 clonados; describe responde 200 para los 3 tipos en todas las sedes |
