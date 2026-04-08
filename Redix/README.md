# Redix

**Propósito:** ERP personalizado para la empresa. Plataforma de usuario en evolución continua que centraliza operaciones de negocio.

---

## Proyectos

| Proyecto | Descripción | Estado | Repo local |
|---|---|---|---|
| **RIQ** (Redix-Integration-Quickbooks) | Integración de Redix con el ecosistema LedgerGateway. Permite operar entidades QB Desktop directamente desde Redix. | 🔧 En desarrollo | — |

---

## Rama activa: RIQ

RIQ conecta Redix con LedgerGateway para que los usuarios de Redix puedan realizar operaciones en QuickBooks Desktop sin salir de la plataforma.

### Entidades integradas en RIQ

| Entidad | Add | Mod | Query | Estado |
|---|---|---|---|---|
| ItemInventory | ✅ | ✅ | ✅ | ✅ Completada |
| Vendor | ✅ | ✅ | ✅ | ✅ Completada |
| Customer | ✅ | ✅ | ✅ | ✅ Completada |
| SalesOrder | ✅ | ✅ | ✅ | ✅ Completada |
| PurchaseOrder | ✅ | ✅ | ✅ | ✅ Completada |
| Invoice | ➕ | ✏️ | 🔍 | 🔧 En progreso |
| Bill | — | — | — | ⏳ Pendiente |
| ItemNonInventory | — | — | — | ⏳ Pendiente |
| ItemService | — | — | — | ⏳ Pendiente |
| CreditCardCharge | — | — | — | ⏳ Pendiente |
| InventorySite | — | — | — | ⏳ Pendiente |
| InventoryTransfer | — | — | — | ⏳ Pendiente |
| Assembly | — | — | — | ⏳ Pendiente |

---

## Flujo de integración

```
Usuario en Redix
    ↓ acción en UI
[RIQ — Redix-Integration-Quickbooks]
    - Construye el payload con type, sede, data
    - Envía a LedgerOps via API
    ↓
[LedgerGateway]
    - Procesa la operación en QB Desktop
    ↑ respuesta
[RIQ muestra resultado al usuario en Redix]
```
