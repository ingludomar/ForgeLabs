# Roadmap — LedgerGateway

Entidades QB Desktop integradas vía LedgerOps. Flujo: P0-P5.

---

## Entidades P1 — estado de entrega

| # | Entidad | Módulo | LG | Notas |
|---|---|---|---|---|
| 1 | ItemInventory | inventory | ✅ P5 completo | — |
| 2 | ItemNonInventory | inventory | ✅ P5 completo | — |
| 3 | ItemService | inventory | ✅ P5 completo | — |
| 4 | InventorySite | inventory | ✅ P5 completo | — |
| 5 | TransferInventory | inventory | ✅ P5 completo | — |
| 6 | BuildAssembly | inventory | ✅ P5 completo | — |
| 7 | Customer | contacts | ✅ P5 completo | — |
| 8 | Vendor | contacts | ✅ P5 completo | — |
| 9 | SalesOrder | sales | ✅ P5 completo | — |
| 10 | Invoice | sales | ✅ P5 completo | — |
| 11 | PurchaseOrder | purchasing | ✅ P5 completo | — |
| 12 | Bill | purchasing | ✅ P5 completo | — |
| 13 | CreditCardCharge | banking | ✅ P5 completo | — |

---

## Estado por sede

| Entidad | TEST | RUS | REC | RBR | RMX | TSI | RRC |
|---|---|---|---|---|---|---|---|
| ItemInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemNonInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemService | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| InventorySite | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| TransferInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| BuildAssembly | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Customer | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Vendor | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| SalesOrder | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Invoice | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| PurchaseOrder | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Bill | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| CreditCardCharge | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |

> TSI y RRC: bloqueadas — esperan qbxmlIntegrator multiempresa (pendiente testing).

---

## Pendientes técnicos

| Item | Proyecto | Estado |
|---|---|---|
| qbxmlIntegrator multiempresa | qbxmlIntegrator | ⏳ Pendiente testing — desbloquea TSI · RRC |
| Configuración LedgerBridge para TSI + RRC | LedgerBridge | ⏳ Bloqueado hasta qbxmlIntegrator multiempresa |

---

## Próximas entidades (P2+)

Ver catálogo completo: [`Hub/docs/development/roadmap.md`](../docs/development/roadmap.md)
