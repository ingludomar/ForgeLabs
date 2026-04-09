# PROMPT-RIQ-004 — QB Playground · Datos de ejemplo reales por entidad (sede TEST)

**Fecha:** 2026-03-30
**De:** SyncBridge
**Para:** RIQ (redix-integration-quickbooks)
**Tipo:** data
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-001](PROMPT-RIQ-001-qb-playground-integration.md) — integración base que este PROMPT ejercita con datos reales de TEST

---

## Objetivo

Actualizar los valores `example` en `contracts.ts` para cada entidad con datos reales de la sede TEST. Esto permite que el botón `Fill Examples` genere un payload válido y listo para enviar sin que el usuario tenga que buscar ListIDs manualmente.

---

## IDs de referencia confirmados en TEST

Estos IDs son fijos — pertenecen a entidades permanentes de TEST.

### Cuentas contables
| Referencia | ListID | Descripción |
|---|---|---|
| IncomeAccountRef | `80000078-1597178857` | Sales income |
| COGSAccountRef | `8000007C-1597178857` | Cost of Goods Sold |
| AssetAccountRef | `80000034-1597178856` | Inventory Asset |
| CreditCard AccountRef | `800000FF-1601048998` | American Express 1008 |

### Impuestos y moneda
| Referencia | ListID | Descripción |
|---|---|---|
| SalesTaxCodeRef | `80000001-1597174715` | Tax |
| CurrencyRef | `80000096-1597174726` | US Dollar |

### Contactos
| Referencia | ListID | FullName |
|---|---|---|
| CustomerRef | `800002C4-1597179052` | Lenovo Mexico USD |
| VendorRef | `800001F1-1597178964` | REDSIS CORP-USD |
| PrefVendorRef | `800001EA-1597178964` | R. T. RESEACH CORP. |
| PayeeEntityRef | `8000032A-1607638179` | AMERICAN EXPRESS |

### Items
| Referencia | ListID | Name |
|---|---|---|
| ItemRef | `80000026-1597198891` | #2 CLEAR |

### Transacciones existentes (para Mod y Query)
| Tipo | TxnID | EditSequence |
|---|---|---|
| SalesOrder | `1-1597258879` | *(query primero para obtener EditSequence)* |
| Invoice | `12B8-1597547050` | *(query primero)* |
| PurchaseOrder | `F8C-1597523528` | *(query primero)* |
| Bill | `100D-1597526169` | *(query primero)* |
| CreditCardCharge | `13FF4-1612545981` | *(query primero)* |

### Items existentes (para Mod y Query)
| Tipo | ListID | EditSequence |
|---|---|---|
| ItemInventory | `80000026-1597198891` | `1597198891` |
| Customer | `800002C4-1597179052` | *(query primero)* |
| Vendor | `800001F1-1597178964` | *(query primero)* |

---

## Payloads de ejemplo por operación

### INVENTORY

**ItemInventoryAdd**
```json
{
  "Name": "RDX-ITEM-001",
  "IsActive": "true",
  "SalesDesc": "Item created from Redix",
  "SalesPrice": "125.00",
  "PurchaseDesc": "RDX-ITEM-001 Purchase",
  "PurchaseCost": "85.00",
  "Max": "100",
  "ReorderPoint": "10",
  "IncomeAccountRef": { "ListID": "80000078-1597178857" },
  "COGSAccountRef": { "ListID": "8000007C-1597178857" },
  "AssetAccountRef": { "ListID": "80000034-1597178856" },
  "SalesTaxCodeRef": { "ListID": "80000001-1597174715" }
}
```

**ItemInventoryMod**
```json
{
  "ListID": "80000026-1597198891",
  "EditSequence": "1597198891",
  "SalesPrice": "130.00",
  "Max": "150",
  "IncomeAccountRef": { "ListID": "80000078-1597178857" },
  "COGSAccountRef": { "ListID": "8000007C-1597178857" },
  "AssetAccountRef": { "ListID": "80000034-1597178856" }
}
```

**ItemInventoryQuery**
```json
{
  "ListID": "80000026-1597198891"
}
```

---

### CONTACTS

**CustomerAdd**
```json
{
  "Name": "RDX-CUSTOMER-001",
  "JobStatus": "None",
  "CurrencyRef": { "ListID": "80000096-1597174726" },
  "SalesTaxCodeRef": { "ListID": "80000001-1597174715" }
}
```

**CustomerMod**
```json
{
  "ListID": "800002C4-1597179052",
  "EditSequence": "{{query primero para obtener EditSequence}}",
  "CurrencyRef": { "ListID": "80000096-1597174726" },
  "SalesTaxCodeRef": { "ListID": "80000001-1597174715" }
}
```

**CustomerQuery**
```json
{
  "ListID": "800002C4-1597179052"
}
```

**VendorAdd**
```json
{
  "Name": "RDX-VENDOR-001",
  "IsVendorEligibleFor1099": "false",
  "CurrencyRef": { "ListID": "80000096-1597174726" }
}
```

**VendorMod**
```json
{
  "ListID": "800001F1-1597178964",
  "EditSequence": "{{query primero para obtener EditSequence}}",
  "IsVendorEligibleFor1099": "false",
  "CurrencyRef": { "ListID": "80000096-1597174726" }
}
```

**VendorQuery**
```json
{
  "ListID": "800001F1-1597178964"
}
```

---

### SALES

**SalesOrderAdd**
```json
{
  "header": {
    "CustomerRef": { "ListID": "800002C4-1597179052" },
    "TxnDate": "2026-03-30",
    "RefNumber": "SO-RDX-001"
  },
  "lines": [
    {
      "ItemRef": { "ListID": "80000026-1597198891" },
      "Quantity": "5",
      "Rate": "125.00"
    }
  ]
}
```

**SalesOrderMod**
```json
{
  "header": {
    "TxnID": "1-1597258879",
    "EditSequence": "{{query primero}}",
    "RefNumber": "SO-RDX-001-MOD"
  }
}
```

**SalesOrderQuery**
```json
{
  "TxnID": "1-1597258879"
}
```

**InvoiceAdd**
```json
{
  "header": {
    "CustomerRef": { "ListID": "800002C4-1597179052" },
    "TxnDate": "2026-03-30",
    "RefNumber": "INV-RDX-001"
  },
  "lines": [
    {
      "ItemRef": { "ListID": "80000026-1597198891" },
      "Quantity": "2",
      "Rate": "125.00"
    }
  ]
}
```

---

### PURCHASING

**PurchaseOrderAdd**
```json
{
  "header": {
    "VendorRef": { "ListID": "800001F1-1597178964" },
    "TxnDate": "2026-03-30",
    "RefNumber": "PO-RDX-001"
  },
  "lines": [
    {
      "ItemRef": { "ListID": "80000026-1597198891" },
      "Quantity": "10",
      "Rate": "85.00"
    }
  ]
}
```

**PurchaseOrderMod**
```json
{
  "header": {
    "TxnID": "F8C-1597523528",
    "EditSequence": "{{query primero}}",
    "RefNumber": "PO-RDX-001-MOD"
  }
}
```

**PurchaseOrderQuery**
```json
{
  "TxnID": "F8C-1597523528"
}
```

**BillAdd**
```json
{
  "header": {
    "VendorRef": { "ListID": "800001F1-1597178964" },
    "TxnDate": "2026-03-30",
    "RefNumber": "BILL-RDX-001"
  },
  "lines": [
    {
      "ItemRef": { "ListID": "80000026-1597198891" },
      "Quantity": "5",
      "Cost": "85.00"
    }
  ]
}
```

**BillMod**
```json
{
  "header": {
    "TxnID": "100D-1597526169",
    "EditSequence": "{{query primero}}",
    "RefNumber": "BILL-RDX-001-MOD"
  }
}
```

---

### BANKING

**CreditCardChargeAdd**
```json
{
  "header": {
    "AccountRef": { "ListID": "800000FF-1601048998" },
    "PayeeEntityRef": { "ListID": "8000032A-1607638179" },
    "TxnDate": "2026-03-30",
    "RefNumber": "CC-RDX-001"
  },
  "lines": [
    {
      "ItemRef": { "ListID": "80000026-1597198891" },
      "Quantity": "1",
      "Cost": "85.00"
    }
  ]
}
```

---

## Implementación en contracts.ts

Actualizar el campo `example` de cada `ContractField` con los valores de la tabla de IDs de referencia. Los campos Ref deben usar el ListID correspondiente como valor de ejemplo en el sub-campo `ListID`.

Para campos Mod y Query que requieren TxnID/EditSequence obtenidos en runtime, el placeholder `{{query primero}}` indica que el usuario debe hacer primero un Query para obtener el valor actual antes de ejecutar el Mod.

---

## Verificación — Fill Examples

Después de actualizar `contracts.ts`, usar `Fill Examples` en cada entidad y confirmar que el JSON Output generado coincide con los payloads de esta sección. Reportar a SyncBridge cualquier discrepancia.

---

## Test Cases — Pruebas funcionales por operación

Ejecutar cada test case desde el QB Playground usando `Fill Examples` + Send. Registrar el resultado en la tabla de resultados al final.

**Criterio de éxito general:**
- ✅ `success: true` + `data` con campos del tipo correspondiente (`ItemInventoryRet`, `CustomerRet`, etc.)
- ❌ Cualquier `success: false` o error QB

---

### TC-INV-01 — ItemInventoryAdd
**Payload:** usar Fill Examples de `Item — Add` (sede TEST)
**Criterio:** response contiene `ItemInventoryRet.ListID` — guardar ese ListID para TC-INV-02

### TC-INV-02 — ItemInventoryQuery (por ListID creado en TC-INV-01)
**Payload:** `{ "ListID": "<ListID de TC-INV-01>" }`
**Criterio:** response contiene `ItemInventoryRet.Name = "RDX-ITEM-001"`

### TC-INV-03 — ItemInventoryMod
**Payload:** usar Fill Examples de `Item — Update` (sede TEST)
**Criterio:** response contiene `ItemInventoryRet.SalesPrice = "130.00"`

---

### TC-CON-01 — CustomerAdd
**Payload:** usar Fill Examples de `Customer — Add` (sede TEST)
**Criterio:** response contiene `CustomerRet.ListID` — guardar para TC-CON-02

### TC-CON-02 — CustomerQuery
**Payload:** `{ "ListID": "800002C4-1597179052" }`
**Criterio:** response contiene `CustomerRet.FullName = "Lenovo Mexico USD"`

### TC-CON-03 — VendorAdd
**Payload:** usar Fill Examples de `Vendor — Add` (sede TEST)
**Criterio:** response contiene `VendorRet.ListID`

### TC-CON-04 — VendorQuery
**Payload:** `{ "ListID": "800001F1-1597178964" }`
**Criterio:** response contiene `VendorRet.ListID = "800001F1-1597178964"`

---

### TC-SAL-01 — SalesOrderAdd
**Payload:** usar Fill Examples de `Sales Order — Add` (sede TEST)
**Criterio:** response contiene `SalesOrderRet.TxnID` — guardar para TC-SAL-02

### TC-SAL-02 — SalesOrderQuery
**Payload:** `{ "TxnID": "1-1597258879" }`
**Criterio:** response contiene `SalesOrderRet.CustomerRef.ListID = "800002C4-1597179052"`

### TC-SAL-03 — InvoiceAdd
**Payload:** usar Fill Examples de `Invoice — Add` (sede TEST)
**Criterio:** response contiene `InvoiceRet.TxnID`

---

### TC-PUR-01 — PurchaseOrderAdd
**Payload:** usar Fill Examples de `Purchase Order — Add` (sede TEST)
**Criterio:** response contiene `PurchaseOrderRet.TxnID`

### TC-PUR-02 — PurchaseOrderQuery
**Payload:** `{ "TxnID": "F8C-1597523528" }`
**Criterio:** response contiene `PurchaseOrderRet.VendorRef.ListID = "800001F1-1597178964"`

### TC-PUR-03 — BillAdd
**Payload:** usar Fill Examples de `Bill — Add` (sede TEST)
**Criterio:** response contiene `BillRet.TxnID`

### TC-PUR-04 — BillQuery (via BillMod form — Query de verificación)
**Payload:** `{ "TxnID": "100D-1597526169" }`
**Criterio:** response contiene `BillRet.VendorRef.ListID = "800001F1-1597178964"`

---

### TC-BNK-01 — CreditCardChargeAdd
**Payload:** usar Fill Examples de `CC Charge — Add` (sede TEST)
**Criterio:** response contiene `CreditCardChargeRet.TxnID`

---

## Tabla de resultados — completar y reportar a SyncBridge

| TC | Operación | Resultado | TxnID / ListID obtenido | Observaciones |
|---|---|---|---|---|
| TC-INV-01 | ItemInventoryAdd | ⬜ | | |
| TC-INV-02 | ItemInventoryQuery | ⬜ | | |
| TC-INV-03 | ItemInventoryMod | ⬜ | | |
| TC-CON-01 | CustomerAdd | ⬜ | | |
| TC-CON-02 | CustomerQuery | ⬜ | | |
| TC-CON-03 | VendorAdd | ⬜ | | |
| TC-CON-04 | VendorQuery | ⬜ | | |
| TC-SAL-01 | SalesOrderAdd | ⬜ | | |
| TC-SAL-02 | SalesOrderQuery | ⬜ | | |
| TC-SAL-03 | InvoiceAdd | ⬜ | | |
| TC-PUR-01 | PurchaseOrderAdd | ⬜ | | |
| TC-PUR-02 | PurchaseOrderQuery | ⬜ | | |
| TC-PUR-03 | BillAdd | ⬜ | | |
| TC-PUR-04 | BillQuery | ⬜ | | |
| TC-BNK-01 | CreditCardChargeAdd | ⬜ | | |

**Entregar tabla completa a SyncBridge con resultado ✅ / ❌ y el TxnID o ListID obtenido en cada operación de Add.**

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-30 | Emisión | PROMPT emitido a RIQ — actualizar datos de ejemplo en `contracts.ts` con IDs reales de TEST y ejecutar 15 TCs |
| 2026-03-30 | Resolución | Datos actualizados; 15/15 TCs pasados en TEST |
