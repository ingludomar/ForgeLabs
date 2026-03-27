# SyncBridge — Bitácora de trabajo

> Registro cronológico de sesiones. Cada entrada documenta qué se hizo, qué archivos se modificaron y decisiones relevantes.
> Actualizar al final de cada sesión o al completar una fase importante.

---

## Formato de entrada

```
### YYYY-MM-DD — {Entidad o tarea} — {Fase o acción}
**Resultado:** ...
**Archivos modificados:** ...
**Notas:** ...
```

---

## Registro

---

### 2026-03-23 — ItemInventory · ItemNonInventory · ItemService · Customer · Vendor — P5 completo

**Resultado:** Entrega completa de 5 entidades. Correos enviados, Monday actualizado.

**Archivos modificados (LedgerOps):**
- `docs/integration/developer/ItemInventory.md`
- `docs/integration/developer/ItemNonInventory.md`
- `docs/integration/developer/ItemService.md`
- `docs/integration/developer/Customer.md`
- `docs/integration/developer/Vendor.md`
- (+ quickstart, architect, qa, support, executive de cada entidad)

**PROMPTs emitidos:**
- PROMPT-LO-001 a PROMPT-LO-005 (entregas en LedgerOps)
- PROMPT-009 a PROMPT-012 (schemas v13.0 RMX para las 4 entidades en LedgerBridge)

**Versión:** v1.1.0 – v1.5.0

---

### 2026-03-24 — SalesOrder — P5 completo

**Resultado:** SalesOrder Add · Mod · Query entregado. Correo enviado, Monday actualizado.

**Archivos modificados (LedgerOps):**
- `docs/integration/developer/SalesOrder.md` (+ 5 roles)

**PROMPTs emitidos:**
- PROMPT-013 (schemas v13.0 RMX para SalesOrder en LedgerBridge)
- PROMPT-LO-006 (entrega en LedgerOps)

**Versión:** v1.6.0

---

### 2026-03-25 — PurchaseOrder · Invoice · Bill — P5 completo

**Resultado:** 3 entidades entregadas en el mismo día. Correos enviados, Monday actualizado.

**Archivos modificados (LedgerOps):**
- `docs/integration/developer/PurchaseOrder.md` (+ 5 roles)
- `docs/integration/developer/Invoice.md` (+ 5 roles)
- `docs/integration/developer/Bill.md` (+ 5 roles)

**PROMPTs emitidos:**
- PROMPT-014 a PROMPT-016 (schemas v13.0 RMX para PO, Invoice, Bill en LedgerBridge)
- PROMPT-LO-007 a PROMPT-LO-010 (entregas + fix docs PO RMX)

**Correcciones aplicadas (Bill):**
- Workflows BillAdd y BillMod tenían payload en formato antiguo (`object: type`) — corregido a `object: type+'Rq'`
- BillAdd devolvía QB-3180 al usar APAccount en ExpenseLineAdd — corregido a ItemLineAdd
- BillMod requería `RefNumber` en business rules — agregado al payload

**Versión:** v1.7.0 – v1.9.0

---

### 2026-03-26 — InventorySite — P0–P5 completo

**Resultado:** InventorySite Add · Mod · Query entregado. Correo enviado, Monday actualizado.

**Flujo seguido:**
- P0: PROMPT-018 a LedgerBridge solicitando audit de schemas v17.0 + v13.0 — resuelto
- P1/P2: Ejecutados manualmente (analyze-sede-fields falla para InventorySite porque usa MaxReturned internamente, filtro inválido para esta entidad)
- P3: 3 workflows creados y activados en N8N (Add: `GXRx0908KYn9dQBH`, Mod: `PHt2PiZlG6AHw44h`, Query: `PS5bxjSD2vFlmZ30`)
- P4: Testing completo en sede TEST — `verified-inventorysite.json` generado
- P5: 6 docs por rol creados en LedgerOps, PROMPT-LO-011 emitido y confirmado

**Archivos modificados (SyncBridge):**
- `docs/inter-project/ledgerbridge/PROMPT-018-inventorysite-schema.md` (nuevo)
- `docs/inter-project/ledgerops/PROMPT-011-inventorysite-delivery.md` (nuevo)
- `docs/inter-project/README.md` (actualizado)
- `docs/development/roadmap.md` (actualizado)
- `docs/development/features.md` (actualizado)
- `development/inventory/verified-inventorysite.json` (nuevo)

**Archivos modificados (LedgerOps):**
- `docs/integration/developer/InventorySite.md` (+ 5 roles)

**Hallazgos técnicos:**
- `InventorySiteQuery` no acepta `FullName` ni `MaxReturned` — causa QB-PARSE-ERROR
- `InventorySiteAdd` requiere `Name` e `IsActive` (Intuit)
- `InventorySiteMod` requiere `Name` además de `ListID` y `EditSequence`

**Versión:** v1.10.0

**Monday:**
- Item de trabajo: `SyncBridge | LedgerOps | InventorySite` (ID: 11604940789) — 7 subitems, grupo Lanzamiento
- Item de entrega: `LedgerOps | Entrega formal · InventorySite v1.10.0` (ID: 11604953600) — 2 subitems

---

### 2026-03-26 — Docs developer — Sección "Contrato disponible" (9 entidades)

**Resultado:** Agregada sección "Contrato disponible" a todos los docs de desarrollador existentes. Sin eliminar contenido previo.

**Archivos modificados (LedgerOps):**
- `docs/integration/developer/ItemInventory.md`
- `docs/integration/developer/ItemNonInventory.md`
- `docs/integration/developer/ItemService.md`
- `docs/integration/developer/Customer.md`
- `docs/integration/developer/Vendor.md`
- `docs/integration/developer/SalesOrder.md`
- `docs/integration/developer/PurchaseOrder.md`
- `docs/integration/developer/Invoice.md`
- `docs/integration/developer/Bill.md`

**Formato aplicado:** Sección `## Contrato disponible` con JSON completo de Add/Mod/Query, propiedades con valor vacío, comentarios `// requerido` y `// requerido por sede` en campos obligatorios. Insertada antes de los ejemplos con datos reales, sin modificar el contenido existente.

---

### 2026-03-26 — Acuerdos de flujo de trabajo

**Decisión:** Se acordó respetar estrictamente el flujo P0–P5 en orden. Ante cualquier obstáculo o cambio de entidad, pausar y confirmar con el usuario antes de actuar.

**Contexto:** CreditCardCharge fue iniciado sin completar P0 (PROMPT-017 pendiente). InventorySite fue marcado erróneamente como bloqueado antes de que los schemas estuvieran disponibles.

**Regla establecida:** Si se encuentra un obstáculo en cualquier fase, reportar al usuario y esperar instrucción — no saltar a otra entidad ni tomar decisiones autónomas sobre el camino a seguir.

---

---

### 2026-03-26 — CreditCardCharge — P1–P5.2 completo

**Resultado:** CreditCardCharge Add · Mod · Query — P5 completo. Versión v1.11.0 entregada. Correo enviado, Monday actualizado.

**Archivos modificados (SyncBridge):**
- `docs/inter-project/ledgerbridge/PROMPT-017-creditcardcharge-schema.md` (estado → ✅ solved)
- `docs/inter-project/ledgerops/PROMPT-012-creditcardcharge-delivery.md` (nuevo)
- `docs/inter-project/README.md` (actualizado)
- `development/banking/CreditCardChargeAdd.workflow.json` (nuevo)
- `development/banking/CreditCardChargeMod.workflow.json` (nuevo)
- `development/banking/CreditCardChargeQuery.workflow.json` (nuevo)
- `development/banking/verified-creditcardcharge.json` (nuevo)
- `production/banking/CreditCardChargeAdd.workflow.json` (nuevo)
- `production/banking/CreditCardChargeMod.workflow.json` (nuevo)
- `production/banking/CreditCardChargeQuery.workflow.json` (nuevo)
- `production/banking/verified-creditcardcharge.json` (nuevo)

**Archivos modificados (LedgerOps):**
- `docs/integration/developer/CreditCardCharge.md` (nuevo)
- `docs/integration/quickstart/CreditCardCharge.md` (nuevo)
- `docs/integration/architect/CreditCardCharge.md` (nuevo)
- `docs/integration/qa/CreditCardCharge.md` (nuevo)
- `docs/integration/support/CreditCardCharge.md` (nuevo)
- `docs/integration/executive/CreditCardCharge.md` (nuevo)

**P2 — Business rules registradas:**
- Add: TEST/RUS/REC/RBR/RMX — AccountRef/ListID, PayeeEntityRef/ListID (x4), TxnDate, ExchangeRate (x4), RefNumber (x2), Memo (x3)
- Mod: mismos campos + TxnID + EditSequence

**Hallazgos técnicos:**
- `CreditCardChargeAdd` requiere al menos un `ItemLineAdd` — sin líneas QB retorna QB-3180
- `Amount` es campo de solo lectura en Add — incluirlo causa QB-PARSE-ERROR
- `CurrencyRef/ListID` y `CurrencyRef/FullName` no son paths válidos en el schema (v17.0 ni v13.0)
- `FullName` en Refs causa QB-PARSE-ERROR si el valor contiene caracteres especiales (|, :, paréntesis)

**P2 corrección:** Eliminado `FullName` de las business rules en todas las sedes — solo ListID requerido.

---

---

### 2026-03-27 — InventoryTransfer · Assembly — P0–P5.2 completo

**Resultado:** InventoryTransfer (Add · Query) y Assembly (Add · Mod · Query) — P5.2 completo. PROMPTs LO-013 y LO-014 emitidos. Esperando confirmación de LO.

**Flujo seguido:**
- P0: PROMPT-019 a LedgerBridge — schemas v17.0 + v13.0 RMX confirmados disponibles (sesión anterior)
- P1: analyze-sede-fields ejecutado para TransferInventoryAdd y BuildAssemblyAdd en TEST
- P2: business-rules/replace ejecutado para TransferInventoryAdd, BuildAssemblyAdd, BuildAssemblyMod en todas las sedes (TEST · RUS · REC · RBR · RMX)
- P3: 5 workflows creados en N8N y activados — endpoints respondiendo
- P4: Testing completo en TEST — verified JSONs generados
- P5.1: 12 docs por rol creados en LedgerOps (6 por entidad)
- P5.2: PROMPT-LO-013 y PROMPT-LO-014 emitidos

**Archivos modificados (SyncBridge):**
- `docs/inter-project/ledgerbridge/PROMPT-019-inventorytransfer-assembly-schema.md` (estado → ✅ solved)
- `docs/inter-project/ledgerops/PROMPT-013-inventorytransfer-delivery.md` (nuevo)
- `docs/inter-project/ledgerops/PROMPT-014-assembly-delivery.md` (nuevo)
- `docs/inter-project/README.md` (actualizado)
- `docs/development/roadmap.md` (actualizado)
- `development/inventory/TransferInventoryAdd.workflow.json` (nuevo)
- `development/inventory/TransferInventoryQuery.workflow.json` (nuevo)
- `development/inventory/BuildAssemblyAdd.workflow.json` (nuevo)
- `development/inventory/BuildAssemblyMod.workflow.json` (nuevo)
- `development/inventory/BuildAssemblyQuery.workflow.json` (nuevo)
- `development/inventory/verified-inventorytransfer.json` (nuevo)
- `development/inventory/verified-assembly.json` (nuevo)
- `production/inventory/` (5 workflows + 2 verified copiados)

**Archivos preparados (LedgerOps):**
- `docs/integration/developer/InventoryTransfer.md` (nuevo)
- `docs/integration/quickstart/InventoryTransfer.md` (nuevo)
- `docs/integration/architect/InventoryTransfer.md` (nuevo)
- `docs/integration/qa/InventoryTransfer.md` (nuevo)
- `docs/integration/support/InventoryTransfer.md` (nuevo)
- `docs/integration/executive/InventoryTransfer.md` (nuevo)
- `docs/integration/developer/Assembly.md` (nuevo)
- `docs/integration/quickstart/Assembly.md` (nuevo)
- `docs/integration/architect/Assembly.md` (nuevo)
- `docs/integration/qa/Assembly.md` (nuevo)
- `docs/integration/support/Assembly.md` (nuevo)
- `docs/integration/executive/Assembly.md` (nuevo)

**P2 — Business rules registradas:**
- TransferInventoryAdd: TEST/RUS/REC/RBR (v17.0) + RMX (v13.0) — TxnDate, RefNumber, FromInventorySiteRef/ListID, ToInventorySiteRef/ListID
- BuildAssemblyAdd: TEST/RUS/REC/RBR (v17.0) + RMX (v13.0) — ItemInventoryAssemblyRef/ListID, TxnDate, QuantityToBuild, RefNumber
- BuildAssemblyMod: TEST/RUS/REC/RBR (v17.0) + RMX (v13.0) — TxnID, EditSequence, TxnDate, QuantityToBuild, RefNumber

**P3 — Workflows N8N:**
- TransferInventoryAdd: `ITk8Dllh3vHInpEH`
- TransferInventoryQuery: `LCI7zXYd8d8ozcFq`
- BuildAssemblyAdd: `lN5uKrOpfLz1Z0wT`
- BuildAssemblyMod: `0iTkdwSH8O6nZ7uV`
- BuildAssemblyQuery: `dHr98MHz8RXEw7ID`

**Hallazgos técnicos:**
- `BuildAssemblyAdd` requiere `MarkPendingIfRequired` (required by Intuit) — omitirlo causa LB-VALIDATION-MISSING_REQUIRED
- `TransferInventoryAdd`: RefNumber máx ~11 caracteres (QB-3070 si más largo)
- `TransferInventoryAdd`: ItemRef debe ser ItemInventory — otros tipos causan QB-3140
- `BuildAssemblyMod`: `ItemInventoryAssemblyRef/ListID` NO es un path válido en el schema ModRq — paths válidos son TxnID, EditSequence, TxnDate, QuantityToBuild, RefNumber

## Pendientes activos

| Entidad | Estado | Bloqueado por |
|---|---|---|
| CreditCardCharge | ✅ P5 completo | Entregado v1.11.0 · 2026-03-26 |
| InventoryTransfer | ✅ P5 completo | Entregado v1.12.0 · 2026-03-27 |
| Assembly | ✅ P5 completo | Entregado v1.13.0 · 2026-03-27 |
| TSI · RRC | ⏳ Pendiente | Configuración LedgerBridge pendiente |
