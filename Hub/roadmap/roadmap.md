# Roadmap del ecosistema

## Prioridad de entidades — LedgerOps

| # | Entidad | Módulo | Estado | Notas |
|---|---|---|---|---|
| 1 | ItemInventory | inventory | ✅ P4 completo | P5 pendiente |
| 2 | ItemNonInventory | inventory | ✅ P4 completo | P5 pendiente |
| 3 | ItemService | inventory | ✅ P5 completo | Entregado |
| 4 | Customer | contacts | ✅ P5 completo | Entregado 2026-03-23 |
| 5 | Vendor | contacts | ✅ P5 completo | Entregado 2026-03-23 |
| 6 | SalesOrder | sales | ⬜ Pendiente | — |
| 7 | PurchaseOrder | purchasing | 🔨 P3 workflow existe | P1+P2+P4 pendientes |
| 8 | Invoice | sales | 🔨 P3 workflow existe | P1+P2+P4 pendientes |
| 9 | Bill | purchasing | 🔨 P3 workflow existe | P1+P2+P4 pendientes |
| 10 | InventorySite | inventory | ⬜ Pendiente | — |
| 11 | InventoryTransfer | inventory | ⬜ Pendiente | — |
| 12 | Assembly | inventory | ⬜ Pendiente | — |
| 13 | CreditCardCharge | banking | 🔨 P3 workflow existe | P1+P2+P4 pendientes |

## Sedes — Estado por entidad

| Entidad | TEST | RUS | REC | RBR | RMX | TSI | RRC |
|---|---|---|---|---|---|---|---|
| ItemInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemNonInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemService | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Customer | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Vendor | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |

## Pendientes técnicos

| Item | Proyecto | Estado |
|---|---|---|
| PROMPT-006 — requiredBySede vacío en GenerateContract | LedgerBridge | ⏳ pending |
| P5 ItemInventory | LedgerOps | ⏳ pendiente |
| P5 ItemNonInventory | LedgerOps | ⏳ pendiente |
| TSI + RRC — configuración LedgerBridge | LedgerBridge | ⏳ bloqueado |
