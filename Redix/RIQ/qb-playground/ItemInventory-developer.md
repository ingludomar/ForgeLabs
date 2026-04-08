# ItemInventory — Referencia para Desarrolladores

**Entidad:** `ItemInventory`
**Operaciones:** Add · Mod · Query
**Audiencia:** Desarrollador
**Actualizado:** 2026-04-07

---

## Endpoint

```
POST /api/integration/qb-playground
Content-Type: application/json
Authorization: Bearer <token>
```

---

## Routing de operaciones

| QB Type | Webhook Key | Módulo |
|---------|-------------|--------|
| `ItemInventoryAdd` | `qb-item-inventory-add` | Inventory |
| `ItemInventoryMod` | `qb-item-inventory-mod` | Inventory |
| `ItemInventoryQuery` | `qb-item-inventory-query` | Inventory |

---

## Tabla de campos requeridos

### ItemInventoryAdd

| Campo | Tipo | Requerido por Intuit | Requerido por sede TEST | Requerido por RMX |
|-------|------|--------------------|------------------------|-------------------|
| `Name` | string | ✅ | ✅ | ✅ |
| `IncomeAccountRef.ListID` | string | ✅ | ✅ | ✅ |
| `COGSAccountRef.ListID` | string | ✅ | ✅ | ✅ |
| `AssetAccountRef.ListID` | string | ✅ | ✅ | ✅ |
| `SalesDesc` | string | No | ✅ | ✅ |
| `PurchaseDesc` | string | No | ✅ | ✅ |
| `SalesPrice` | string | No | ✅ | ✅ |
| `PurchaseCost` | string | No | No | ✅ |
| `Max` | string | No | ✅ | ✅ |

> Los tres `AccountRef` son obligatorios por Intuit — sin ellos QB rechaza el Add.
> `SalesDesc`, `PurchaseDesc`, `SalesPrice` y `Max` son requeridos por regla de negocio TEST.
> RMX suma `PurchaseCost` como requerido adicional.

### ItemInventoryAdd — campos opcionales relevantes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `IsActive` | string | `"true"` / `"false"` (default: `"true"`) |
| `ManufacturerPartNumber` | string | Número de parte del fabricante |
| `QuantityOnHand` | string | Cantidad inicial en stock |
| `InventoryDate` | string | Fecha de valorización inicial (YYYY-MM-DD) |
| `ReorderPoint` | string | Punto de reorden |
| `TotalValue` | string | Valor total inicial del inventario |
| `ParentRef.ListID` | string | Artículo padre (para sub-ítems) |
| `PrefVendorRef.ListID` | string | Proveedor preferido — específico por sede |
| `SalesTaxCodeRef.ListID` | string | Código de impuesto de venta — específico por sede |
| `UnitOfMeasureSetRef.ListID` | string | Unidad de medida — específico por sede |
| `BarCode` | string | Código de barras |

### ItemInventoryMod — campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ListID` | string | ID interno del artículo en QB |
| `EditSequence` | string | Token de concurrencia — debe ser el valor **actual** |
| `Name` | string | Nombre del artículo — requerido por TEST aunque no cambie |
| `SalesDesc` | string | Requerido por TEST aunque no cambie |
| `PurchaseDesc` | string | Requerido por TEST aunque no cambie |
| `IncomeAccountRef.ListID` | string | Requerido por TEST aunque no cambie |
| `COGSAccountRef.ListID` | string | Requerido por TEST aunque no cambie |

---

## Payloads completos

### ItemInventoryAdd

```json
{
  "type": "ItemInventoryAdd",
  "sede": "TEST",
  "data": {
    "Name": "RDX-ITEM-TEST-001",
    "IncomeAccountRef": { "ListID": "80000078-1597178857" },
    "COGSAccountRef":   { "ListID": "8000007C-1597178857" },
    "AssetAccountRef":  { "ListID": "80000034-1597178856" },
    "SalesDesc": "Artículo de inventario Redix",
    "SalesPrice": "125.00",
    "PurchaseDesc": "RDX-ITEM-TEST-001 Compra",
    "PurchaseCost": "85.00",
    "Max": "100",
    "QuantityOnHand": "50",
    "InventoryDate": "2026-01-01",
    "IsActive": "true"
  }
}
```

### ItemInventoryMod

```json
{
  "type": "ItemInventoryMod",
  "sede": "TEST",
  "data": {
    "ListID": "<obtener de ItemInventoryQuery>",
    "EditSequence": "<obtener de ItemInventoryQuery>",
    "Name": "RDX-ITEM-TEST-001",
    "SalesDesc": "Artículo modificado desde Redix",
    "SalesPrice": "130.00",
    "PurchaseDesc": "RDX-ITEM-TEST-001 Compra MOD",
    "PurchaseCost": "88.00",
    "Max": "150",
    "IncomeAccountRef": { "ListID": "80000078-1597178857" },
    "COGSAccountRef":   { "ListID": "8000007C-1597178857" }
  }
}
```

### ItemInventoryQuery

```json
{
  "type": "ItemInventoryQuery",
  "sede": "TEST",
  "data": {
    "ActiveStatus": "ActiveOnly",
    "MaxReturned": "10",
    "NameFilter": {
      "MatchCriterion": "StartsWith",
      "Name": "RDX-"
    }
  }
}
```

> **IMPORTANTE:** `ItemInventoryQuery` NO acepta payload vacío — retorna `MISSING-DATA`.
> Siempre incluir al menos `ActiveStatus` o `MaxReturned`.

---

## ListIDs de referencia — sede TEST

| Referencia | ListID | Cuenta |
|------------|--------|--------|
| `IncomeAccountRef` | `80000078-1597178857` | Income (ventas) |
| `COGSAccountRef` | `8000007C-1597178857` | COGS |
| `AssetAccountRef` | `80000034-1597178856` | Inventory Asset |
| `ItemRef` (ítem de referencia) | `80000026-1597198891` | #2 CLEAR |

> Los ListIDs de cuentas contables son específicos por compañía QB. No son portables entre sedes.
> Para otras sedes: `ItemInventoryQuery { "ActiveStatus": "ActiveOnly", "MaxReturned": "1" }` → extraer los `*AccountRef` de un ítem existente.

---

## Timeouts

| Capa | Timeout | Comportamiento |
|------|---------|---------------|
| Frontend (fetch) | 20 s | `AbortError` — botón Run se desbloquea |
| Backend → LedgerOps | 15 s | `INTERNAL_ERROR — timeout` |
| QB Desktop en sedes grandes (REC: 569 ítems) | ~25 s sin filtro | Usar `MaxReturned` para evitar timeout |

---

## Errores frecuentes

| Código | Causa | Condición | Solución |
|--------|-------|-----------|----------|
| `QB-3100` | `Name` duplicado | Ya existe un ítem con ese nombre | Usar un `Name` único |
| `QB-3170` | Cuenta contable inactiva o tipo incorrecto | `IncomeAccountRef` apunta a cuenta de tipo incorrecto | Verificar tipo de cuenta en QB Desktop (debe ser Income / COGS / Asset) |
| `QB-3200` | `EditSequence` desactualizado | Otro proceso modificó el ítem | Obtener `EditSequence` fresco con `ItemInventoryQuery` |
| `QB-3240` | `ListID` no encontrado | `ListID` de otra sede o inválido | Verificar con `ItemInventoryQuery` en la misma sede |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido faltante | Sin `Name`, `IncomeAccountRef`, etc. | Revisar `details.details[]` — indica campo y origen |
| `MISSING-DATA` | Payload de Query vacío | `data: {}` sin ningún filtro | Incluir al menos `ActiveStatus: "ActiveOnly"` |
| `INTERNAL_ERROR — timeout` | QB Desktop sin respuesta | Inventario grande sin `MaxReturned` | Agregar `MaxReturned` al Query |
