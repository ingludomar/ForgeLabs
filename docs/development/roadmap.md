# SyncBridge — Roadmap

> Prioridad oficial de desarrollo. Cuando un grupo se complete, actualizar `features.md`.
> Proceso de desarrollo: ver [`feature-dev-process.md`](feature-dev-process.md)

---

## Prioridad de desarrollo

| # | Entidad | Estado | Notas |
|---|---------|--------|-------|
| 1 | **ItemInventory** | ✅ P5 completo | Entregado 2026-03-23 |
| 2 | **ItemNonInventory** | ✅ P5 completo | Entregado 2026-03-23 |
| 3 | **ItemService** | ✅ P5 completo | Entregado 2026-03-23 |
| 4 | **Customer** | ✅ P5 completo | Entregado 2026-03-23 |
| 5 | **Vendor** | ✅ P5 completo | Entregado 2026-03-23 |
| 6 | **SalesOrder** | ⬜ | Workflows por crear |
| 7 | **PurchaseOrder** | 🔨 | Add existe — P1+P2+P4 pendientes |
| 8 | **Invoice** | 🔨 | Add existe — P1+P2+P4 pendientes |
| 9 | **Bill** | 🔨 | Add+Mod existen — P1+P2+P4 pendientes |
| 10 | **InventorySite** | ⬜ | Workflows por crear |
| 11 | **InventoryTransfer** | ⬜ | Workflows por crear |
| 12 | **Assembly** | ⬜ | Workflows por crear |
| 13 | **CreditCardCharge** | 🔨 | Add existe — P1+P2+P4 pendientes |

---

## Estado por sede

| Entidad | TEST | RUS | REC | RBR | RMX | TSI | RRC |
|---|---|---|---|---|---|---|---|
| ItemInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemNonInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemService | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Customer | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Vendor | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |

---

## Pendientes técnicos

| Item | Proyecto | Estado |
|---|---|---|
| PROMPT-006 — requiredBySede vacío en GenerateContract | LedgerBridge | ⏳ pending |
| TSI + RRC — configuración LedgerBridge | LedgerBridge | ⏳ bloqueado |
