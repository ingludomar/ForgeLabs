# QB Playground — Item Inventory

**Entidad:** `ItemInventory` (Inventario de Artículos)
**Operaciones disponibles:** Add · Mod · Query
**Versiones QBXML:** 17.0 (TEST · RUS · REC · RBR) · 13.0 (RMX)

---

## Descripción general

`ItemInventory` representa los artículos de inventario rastreados en QuickBooks Desktop. Cada
artículo tiene un nombre único dentro de la compañía y está asociado a tres cuentas contables
obligatorias: Income, COGS y Asset. Las operaciones disponibles desde el Playground permiten
crear (Add), modificar (Mod) y consultar (Query) artículos directamente en el archivo de QB
Desktop de cada sede.

---

## Cómo acceder al Playground

1. Ir a **Configuración → Integraciones → QB Playground**
2. Seleccionar la operación en el selector **Tipo** (sección Inventory)
3. Seleccionar la **Sede**
4. Completar los campos del formulario y ejecutar con **Run**

> Si existe un template para la combinación tipo+sede, el formulario mostrará solo los campos
> del template. Usar el selector en el action bar para cambiar de template o elegir
> "Todos los campos".

---

## Estado por sede (smoke tests 2026-04-06)

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| **Query** | ✅ OK | ✅ OK | ✅ OK (569 items) | ✅ OK | ✅ OK |
| **Add** | ✅ OK | — | — | — | — |
| **Mod** | ✅ OK | — | — | — | — |

> **Metodología de testing:** CRUD completo solo en TEST. Para sedes de producción
> (RUS · REC · RBR · RMX) se ejecuta únicamente Query — si funciona en TEST funciona en
> producción ya que comparten la misma implementación. Los AccountRef ListIDs se obtuvieron
> con un Query previo al primer ítem activo de cada sede.

---

## ItemInventoryAdd

### Campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Name` | string | Nombre único del artículo en la compañía QB |
| `IncomeAccountRef.ListID` | ref | Cuenta de ingresos por ventas |
| `COGSAccountRef.ListID` | ref | Cuenta de costo de ventas (COGS) |
| `AssetAccountRef.ListID` | ref | Cuenta de activo de inventario |
| `SalesDesc` | string | Descripción para facturas de venta |
| `SalesPrice` | string | Precio de venta unitario |
| `PurchaseDesc` | string | Descripción para órdenes de compra |
| `PurchaseCost` | string | Costo de compra unitario |
| `Max` | string | Cantidad máxima en inventario |

> **RMX requiere adicionalmente:** `SalesPrice`, `PurchaseCost`, `Max` (reglas de negocio de sede).
> Estos campos son opcionales en otras sedes pero están incluidos en los requeridos de RMX.

### Campos opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `IsActive` | string | `"true"` / `"false"` — activo por defecto |
| `ManufacturerPartNumber` | string | Número de parte del fabricante |
| `QuantityOnHand` | string | Cantidad inicial en stock |
| `InventoryDate` | string | Fecha de valorización inicial (YYYY-MM-DD) |
| `ReorderPoint` | string | Punto de reorden |
| `TotalValue` | string | Valor total inicial del inventario |
| `IncomeAccountRef.FullName` | string | Nombre completo de la cuenta de ingresos |
| `COGSAccountRef.FullName` | string | Nombre completo de la cuenta COGS |
| `AssetAccountRef.FullName` | string | Nombre completo de la cuenta de activo |
| `ParentRef.ListID` | ref | Artículo padre (para sub-artículos) |
| `PrefVendorRef.ListID` | ref | Proveedor preferido |
| `ClassRef.ListID` | ref | Clase contable |
| `SalesTaxCodeRef.ListID` | ref | Código de impuesto de venta |
| `PurchaseTaxCodeRef.ListID` | ref | Código de impuesto de compra |
| `UnitOfMeasureSetRef.ListID` | ref | Unidad de medida |
| `BarCode` | string | Código de barras |
| `IsTaxIncluded` | string | Impuesto incluido en el precio |
| `ExternalGUID` | string | Identificador externo |

### Fill Examples (valores de referencia para TEST)

```json
{
  "Name": "RDX-ITEM-001",
  "IncomeAccountRef": { "ListID": "80000078-1597178857" },
  "COGSAccountRef":   { "ListID": "8000007C-1597178857" },
  "AssetAccountRef":  { "ListID": "80000034-1597178856" },
  "SalesDesc": "Artículo de inventario Redix",
  "SalesPrice": "125.00",
  "PurchaseDesc": "RDX-ITEM-001 Compra",
  "PurchaseCost": "85.00",
  "Max": "100",
  "QuantityOnHand": "50",
  "InventoryDate": "2026-01-01"
}
```

> Los `ListID` de cuentas son específicos por compañía QB. Obtenerlos con
> `ItemInventoryQuery` o desde QB Desktop → Charts of Accounts.

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "ItemInventoryRet": {
      "ListID": "80000XXX-XXXXXXXXXX",
      "TimeCreated": "2026-04-06T...",
      "EditSequence": "1234567890",
      "Name": "RDX-ITEM-001",
      "IsActive": "true",
      ...
    }
  }
}
```

---

## ItemInventoryMod

### Campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ListID` | string | Identificador QB del artículo a modificar |
| `EditSequence` | string | Token de concurrencia — debe ser el valor actual |

> **`EditSequence` es dinámico**: debe obtenerse de un `ItemInventoryQuery` previo o de la
> respuesta de un `ItemInventoryAdd`. No puede pre-llenarse con Fill Examples. Usar un
> `EditSequence` desactualizado retorna QB-3200.

### Campos adicionales requeridos por sede

| Campo | TEST | RUS | REC | RBR | RMX |
|-------|------|-----|-----|-----|-----|
| `Name` | req | req | req | req | req |
| `SalesDesc` | req | req | req | req | req |
| `PurchaseDesc` | req | req | req | req | req |
| `IncomeAccountRef` | req | req | req | req | req |
| `COGSAccountRef` | req | req | req | req | req |
| `SalesPrice` | — | — | — | — | req |
| `PurchaseCost` | — | — | — | — | req |
| `Max` | — | — | — | — | req |

> En TEST se requieren 5 campos de negocio adicionales (Name, SalesDesc, PurchaseDesc,
> IncomeAccountRef, COGSAccountRef). RMX suma SalesPrice, PurchaseCost y Max.

### Fill Examples

```json
{
  "ListID": "<obtener de Query>",
  "EditSequence": "<obtener de Query>",
  "Name": "RDX-ITEM-001-MOD",
  "SalesDesc": "Artículo modificado desde Redix",
  "SalesPrice": "130.00",
  "PurchaseDesc": "RDX-ITEM-001 Compra MOD",
  "PurchaseCost": "88.00",
  "Max": "150",
  "IncomeAccountRef": { "ListID": "80000078-1597178857" },
  "COGSAccountRef":   { "ListID": "8000007C-1597178857" }
}
```

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "ItemInventoryRet": {
      "ListID": "80000XXX-XXXXXXXXXX",
      "EditSequence": "1744XXXXXXXXX",
      "Name": "RDX-ITEM-001-MOD",
      ...
    }
  }
}
```

---

## ItemInventoryQuery

### Nota importante sobre el payload

LedgerOps rechaza un objeto de datos vacío con `MISSING-DATA`. Se debe incluir al menos un
campo de filtro. El filtro más común es `ActiveStatus`.

### Campos de filtro disponibles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ActiveStatus` | string | `"ActiveOnly"` · `"InactiveOnly"` · `"All"` |
| `FromModifiedDate` | string | Fecha de modificación desde (YYYY-MM-DD) |
| `ToModifiedDate` | string | Fecha de modificación hasta (YYYY-MM-DD) |
| `NameFilter` | object | `{"MatchCriterion": "StartsWith", "Name": "RDX-"}` |
| `ListIDList` | object | `{"ListID": ["80000XXX-...", "80000YYY-..."]}` — query por IDs específicos |
| `MaxReturned` | string | Límite de resultados (usar para evitar timeouts en inventarios grandes) |

### Fill Examples

```json
{
  "ActiveStatus": "ActiveOnly",
  "MaxReturned": "50",
  "NameFilter": {
    "MatchCriterion": "StartsWith",
    "Name": "RDX-"
  }
}
```

> Para inventarios con cientos de artículos (ej. REC: 569 items), usar `MaxReturned` para
> evitar timeouts. Sin este filtro, QB puede tardar más de 25 s en responder.

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "ItemInventoryRet": [
      {
        "ListID": "80000168-1690487454",
        "EditSequence": "1697738381",
        "Name": "RDX-ITEM-001",
        "IsActive": "true",
        "SalesPrice": "125.00",
        "IncomeAccountRef": { "ListID": "...", "FullName": "..." },
        "COGSAccountRef":   { "ListID": "...", "FullName": "..." },
        "AssetAccountRef":  { "ListID": "...", "FullName": "..." },
        ...
      }
    ]
  }
}
```

---

## Notas importantes

### Name único por compañía

`Name` debe ser único dentro del archivo QB Desktop. Intentar crear un artículo con un nombre
ya existente retorna **QB-3100**. Para modificaciones, el `Name` puede cambiarse siempre que
el nuevo valor tampoco exista.

### ListIDs son específicos por compañía

Los `ListID` de cuentas contables (Income, COGS, Asset) son internos de cada archivo QB
Desktop y **no son portables entre sedes**. Un ListID válido en TEST no existe en RUS ni REC.
Para obtener los ListIDs correctos de cada sede:
1. Ejecutar `ItemInventoryQuery` en esa sede y revisar los campos `*AccountRef` de un artículo existente
2. O consultar el Chart of Accounts de QB Desktop en esa sede

### EditSequence en Mod

`EditSequence` es un token de control de concurrencia que QB incrementa en cada modificación.
Si se intenta un Mod con un `EditSequence` desactualizado, QB retorna **QB-3200** (object
modified). El flujo correcto es:
1. `ItemInventoryQuery` con `ListID` del artículo → obtener `EditSequence` actual
2. Usar ese `EditSequence` inmediatamente en el `ItemInventoryMod`

---

## Tabla de casos de prueba rápidos

| # | Operación | Sede | Payload | Resultado esperado |
|---|-----------|------|---------|-------------------|
| 1 | Query | TEST | `ActiveStatus: "ActiveOnly", MaxReturned: "1"` | `success: true` + ítem con ListIDs reales |
| 2 | Query | RUS · REC · RBR · RMX | `ActiveStatus: "ActiveOnly", MaxReturned: "1"` | `success: true` — conectividad confirmada |
| 3 | Query | cualquiera | Sin filtros (payload vacío) | `MISSING-DATA` |
| 4 | Add | TEST | Campos completos con ListIDs de TEST | `success: true` + `ListID` nuevo |
| 5 | Add | TEST | Sin `Name` | `LB-VALIDATION-MISSING_REQUIRED` |
| 6 | Add | TEST | `Name` de artículo ya existente | `QB-3100` |
| 7 | Mod | TEST | `ListID` y `EditSequence` del ítem creado en TC-4 | `success: true` |
| 8 | Mod | TEST | `EditSequence` desactualizado | `QB-3200` — object modified |
| 9 | Mod | TEST | `ListID` inexistente | `QB-3240` — object not found |
| 10 | Mod | TEST | Sin `SalesDesc` ni `IncomeAccountRef` | `LB-VALIDATION-MISSING_REQUIRED` |

---

## Referencia de errores comunes

| Código | Fuente | Descripción | Solución |
|--------|--------|-------------|----------|
| `QB-3100` | QB Desktop | Name ya existe en la compañía | Usar un `Name` único |
| `QB-3170` | QB Desktop | Cuenta contable inactiva o tipo incorrecto | Verificar que IncomeAccountRef/COGS/Asset estén activos y sean del tipo correcto |
| `QB-3200` | QB Desktop | EditSequence desactualizado (objeto modificado) | Obtener `EditSequence` fresco con un Query previo |
| `QB-3240` | QB Desktop | ListID no encontrado en la compañía | Verificar que el ListID exista en esa sede específica |
| `LB-VALIDATION-MISSING_REQUIRED` | LedgerBridge | Faltan campos requeridos por Intuit o por reglas de sede | Revisar `details.details[]` en la respuesta — indica exactamente qué campos faltan y su origen (`intuit` o `sede`) |
| `MISSING-DATA` | LedgerOps | Payload de Query vacío | Incluir al menos un campo de filtro (ej. `ActiveStatus: "All"`) |
| `INTERNAL_ERROR — timeout` | RIQ | El agente QB Desktop no respondió en 15 s | El agente QB Connector de esa sede puede estar inactivo; verificar con el equipo de infraestructura |
