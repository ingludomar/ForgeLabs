# PROMPT-LO-017 — P2.5 Retroalimentación · Nota de versión en contratos (13 entidades)

**Fecha:** 2026-03-30
**Tipo:** docs
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-016](PROMPT-016-sedes-config-contract-endpoint.md) — endpoint de contratos dinámicos cuya invarianza v17.0/v13.0 documenta este PROMPT

---

## Contexto

Se ejecutó P2.5 — comparación de contratos QBXML v17.0 vs v13.0 para las 13 entidades entregadas.

**Resultado:** Los contratos son idénticos en todas las entidades. Mismos campos disponibles, mismos `requiredBySede` y mismas restricciones Intuit entre v17.0 (TEST · RUS · REC · RBR) y v13.0 (RMX).

---

## Acción requerida

En la sección `## Contrato disponible` de cada developer doc, agregar la siguiente nota debajo del título de la sección:

```
> El contrato es válido para todas las sedes y versiones — QBXML v17.0 (TEST · RUS · REC · RBR) y v13.0 (RMX). No hay diferencias estructurales entre versiones.
```

---

## Entidades a actualizar — 13 archivos

```
docs/integration/developer/ItemInventory.md
docs/integration/developer/ItemNonInventory.md
docs/integration/developer/ItemService.md
docs/integration/developer/Customer.md
docs/integration/developer/Vendor.md
docs/integration/developer/SalesOrder.md
docs/integration/developer/PurchaseOrder.md
docs/integration/developer/Invoice.md
docs/integration/developer/Bill.md
docs/integration/developer/CreditCardCharge.md
docs/integration/developer/InventorySite.md
docs/integration/developer/InventoryTransfer.md
docs/integration/developer/Assembly.md
```

---

## Formato exacto a aplicar

Buscar en cada archivo:

```markdown
## Contrato disponible
```

Reemplazar por:

```markdown
## Contrato disponible

> El contrato es válido para todas las sedes y versiones — QBXML v17.0 (TEST · RUS · REC · RBR) y v13.0 (RMX). No hay diferencias estructurales entre versiones.
```

Sin modificar ningún otro contenido del archivo.

---

## Verificación

Confirmar commit con los 13 archivos modificados.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-30 | Emisión | PROMPT emitido a LedgerOps — agregar nota de versión en contratos para 13 entidades (contratos idénticos en v17.0 y v13.0) |
| 2026-03-30 | Resolución | 13 archivos de developer docs actualizados con la nota de versión |
