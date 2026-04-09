# LedgerOps — Tipos XML por carpeta de workflow

> Referencia de qué tipos QB XML pertenecen a cada módulo.
> Cada carpeta en `workflows/` agrupa entidades relacionadas.

---

## workflows/inventory/

Ítems del catálogo de productos y operaciones de inventario.

### Items (Add / Mod / Query)

| Tipo XML | Operación | Workflow |
|----------|-----------|---------|
| `ItemInventoryAdd` | Add | `LedgerOps-ItemAdd.workflow.json` |
| `ItemInventoryMod` | Mod | `LedgerOps-ItemMod.workflow.json` |
| `ItemInventoryQuery` | Query | `LedgerOps-ItemQuery.workflow.json` |
| `ItemNonInventoryAdd` | Add | `LedgerOps-ItemAdd.workflow.json` |
| `ItemNonInventoryMod` | Mod | `LedgerOps-ItemMod.workflow.json` |
| `ItemNonInventoryQuery` | Query | `LedgerOps-ItemQuery.workflow.json` |
| `ItemServiceAdd` | Add | `LedgerOps-ItemAdd.workflow.json` |
| `ItemServiceMod` | Mod | `LedgerOps-ItemMod.workflow.json` |
| `ItemServiceQuery` | Query | `LedgerOps-ItemQuery.workflow.json` |

> Los tres tipos de ítem comparten workflow por operación — el `type` en el body determina cuál se procesa.

### Inventory Management (por crear)

| Tipo XML | Operación | Workflow |
|----------|-----------|---------|
| `InventorySiteAdd` | Add | `LedgerOps-InventorySiteAdd.workflow.json` |
| `InventorySiteMod` | Mod | `LedgerOps-InventorySiteMod.workflow.json` |
| `InventorySiteQuery` | Query | `LedgerOps-InventorySiteQuery.workflow.json` |
| `TransferInventory` | Add | `LedgerOps-InventoryTransferAdd.workflow.json` |
| `TransferInventoryQuery` | Query | `LedgerOps-InventoryTransferQuery.workflow.json` |
| `ItemInventoryAssemblyAdd` | Add | `LedgerOps-AssemblyAdd.workflow.json` |
| `ItemInventoryAssemblyMod` | Mod | `LedgerOps-AssemblyMod.workflow.json` |
| `ItemInventoryAssemblyQuery` | Query | `LedgerOps-AssemblyQuery.workflow.json` |
| `BuildAssembly` | Add | `LedgerOps-BuildAssemblyAdd.workflow.json` |
| `BuildAssemblyQuery` | Query | `LedgerOps-BuildAssemblyQuery.workflow.json` |

---

## workflows/sales/

Transacciones de venta.

| Tipo XML | Operación | Workflow |
|----------|-----------|---------|
| `InvoiceAdd` | Add | `LedgerOps-InvoiceAdd.workflow.json` |
| `InvoiceMod` | Mod | `LedgerOps-InvoiceMod.workflow.json` *(por crear)* |
| `InvoiceQuery` | Query | `LedgerOps-InvoiceQuery.workflow.json` *(por crear)* |
| `SalesOrderAdd` | Add | `LedgerOps-SalesOrderAdd.workflow.json` *(por crear)* |
| `SalesOrderMod` | Mod | `LedgerOps-SalesOrderMod.workflow.json` *(por crear)* |
| `SalesOrderQuery` | Query | `LedgerOps-SalesOrderQuery.workflow.json` *(por crear)* |

---

## workflows/purchasing/

Transacciones de compra.

| Tipo XML | Operación | Workflow |
|----------|-----------|---------|
| `BillAdd` | Add | `LedgerOps-BillAdd.workflow.json` |
| `BillMod` | Mod | `LedgerOps-BillMod.workflow.json` |
| `BillQuery` | Query | `LedgerOps-BillQuery.workflow.json` *(por crear)* |
| `PurchaseOrderAdd` | Add | `LedgerOps-PurchaseOrderAdd.workflow.json` |
| `PurchaseOrderMod` | Mod | `LedgerOps-PurchaseOrderMod.workflow.json` *(por crear)* |
| `PurchaseOrderQuery` | Query | `LedgerOps-PurchaseOrderQuery.workflow.json` *(por crear)* |

---

## workflows/banking/

Transacciones bancarias y de tarjeta.

| Tipo XML | Operación | Workflow |
|----------|-----------|---------|
| `CreditCardChargeAdd` | Add | `LedgerOps-CreditCardChargeAdd.workflow.json` |
| `CreditCardChargeMod` | Mod | `LedgerOps-CreditCardChargeMod.workflow.json` *(por crear)* |
| `CreditCardChargeQuery` | Query | `LedgerOps-CreditCardChargeQuery.workflow.json` *(por crear)* |

---

## workflows/contacts/

Clientes, proveedores y contactos.

| Tipo XML | Operación | Workflow |
|----------|-----------|---------|
| `CustomerAdd` | Add | `LedgerOps-CustomerAdd.workflow.json` |
| `CustomerMod` | Mod | `LedgerOps-CustomerMod.workflow.json` *(por crear)* |
| `CustomerQuery` | Query | `LedgerOps-CustomerQuery.workflow.json` *(por crear)* |
| `VendorAdd` | Add | `LedgerOps-VendorAdd.workflow.json` |
| `VendorMod` | Mod | `LedgerOps-VendorMod.workflow.json` *(por crear)* |
| `VendorQuery` | Query | `LedgerOps-VendorQuery.workflow.json` *(por crear)* |

---

## workflows/tools/

Herramientas internas. No son operaciones QB — son utilitarios del proceso de desarrollo.

| Herramienta | Tipo | Webhook |
|-------------|------|---------|
| `LedgerOps-GenerateContract.workflow.json` | Tool | `POST /webhook/tools/contract` |
| `LedgerOps-AnalyzeSedeFields.workflow.json` | Tool | `POST /webhook/tools/analyze-sede-fields` |

---

## Convención de nombres de archivo

```
LedgerOps-{Entidad}{Operacion}.workflow.json
```

| Operación QB | Sufijo |
|-------------|--------|
| Add | `Add` |
| Mod | `Mod` |
| Query | `Query` |

Ejemplos: `LedgerOps-ItemAdd`, `LedgerOps-SalesOrderMod`, `LedgerOps-CustomerQuery`
