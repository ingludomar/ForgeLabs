# ItemInventory — Referencia para Arquitectos

**Entidad:** `ItemInventory`
**Operaciones:** Add · Mod · Query
**Audiencia:** Arquitecto de software / Tech Lead
**Actualizado:** 2026-04-07

---

## Flujo completo

```
Redix Web (React 19)
  └── POST /api/integration/qb-playground
        └── QBPlaygroundController (NestJS 11)
              └── QB_TYPE_TO_WEBHOOK_KEY  →  "qb-item-inventory-add/mod/query"
                    └── IntegrationService → LedgerOps (N8N webhook)
                          └── LedgerBridge (validation + QBXML transform)
                                └── qbxmlIntegrator → QB Desktop SDK
                                      └── QB Desktop — companyFile sede
```

---

## Routing table

`QB_TYPE_TO_WEBHOOK_KEY` en `apps/api/src/modules/integration/qb-endpoints.ts`:

| QB Type | Webhook Key | Módulo QB |
|---------|-------------|-----------|
| `ItemInventoryAdd` | `qb-item-inventory-add` | Inventory |
| `ItemInventoryMod` | `qb-item-inventory-mod` | Inventory |
| `ItemInventoryQuery` | `qb-item-inventory-query` | Inventory |

---

## Contratos dinámicos

```
GET /webhook/contracts?type=ItemInventoryAdd&sede=TEST
→ {
    requiredFields: ["Name", "IncomeAccountRef.ListID", "COGSAccountRef.ListID",
                     "AssetAccountRef.ListID", "SalesDesc", "PurchaseDesc",
                     "SalesPrice", "Max"],
    ...
  }
```

Para RMX el overlay agrega `PurchaseCost` a los requeridos. El frontend fusiona el overlay
con el contrato estático de `contracts.ts` en tiempo de ejecución.

---

## Versiones QBXML por sede

| Sede | Versión QBXML | Notas |
|------|--------------|-------|
| TEST | 17.0 | Versión completa |
| RUS | 17.0 | — |
| REC | 17.0 | 569 artículos activos — usar `MaxReturned` en Query |
| RBR | 17.0 | — |
| RMX | 13.0 | `PurchaseCost` y `Max` requeridos por reglas de sede |

---

## Estructura del payload

Para ItemInventory, los campos van directamente en `data` (no hay objeto contenedor con el
nombre de la operación). Mismo patrón que `Vendor` y `Customer`.

```typescript
// Add
{
  type: "ItemInventoryAdd",
  sede: string,
  data: {
    Name: string,
    IncomeAccountRef: { ListID: string },
    COGSAccountRef:   { ListID: string },
    AssetAccountRef:  { ListID: string },
    SalesDesc?: string,
    SalesPrice?: string,
    PurchaseDesc?: string,
    PurchaseCost?: string,
    Max?: string,
    QuantityOnHand?: string,
    InventoryDate?: string,
    // ...campos opcionales
  }
}

// Mod
{
  type: "ItemInventoryMod",
  sede: string,
  data: {
    ListID: string,
    EditSequence: string,
    Name?: string,
    SalesDesc?: string,
    // ...campos a modificar
  }
}

// Query
{
  type: "ItemInventoryQuery",
  sede: string,
  data: {
    ActiveStatus: string,    // REQUERIDO — no puede omitirse
    MaxReturned?: string,
    NameFilter?: { MatchCriterion: string, Name: string },
    ListIDList?: { ListID: string[] },
    FromModifiedDate?: string,
  }
}
```

> **Query no acepta payload vacío.** LedgerOps retorna `MISSING-DATA` si `data` no tiene
> ningún campo. A diferencia de `SalesOrderQuery` y `PurchaseOrderQuery`, que aceptan
> `MaxReturned` sin otros filtros, `ItemInventoryQuery` requiere al menos `ActiveStatus`.

---

## Relación con otras entidades

`ItemInventory.ListID` es la referencia usada en:
- `SalesOrderAdd` → `SalesOrderLineAdd.ItemRef.ListID`
- `PurchaseOrderAdd` → `PurchaseOrderLineAdd.ItemRef.ListID`
- `InvoiceAdd` → `InvoiceLineAdd.ItemRef.ListID`
- `BillAdd` → `BillItemLineAdd.ItemRef.ListID`

La consistencia es crítica: un `ItemRef.ListID` en una transacción debe corresponder a un
`ItemInventory` activo en la misma compañía QB. Si el ítem es de tipo `ItemNonInventory` o
`ItemService`, su `ListID` no puede usarse en contextos de inventario rastreado.

---

## Control de concurrencia — EditSequence

Mismo mecanismo que Vendor/Customer. El `EditSequence` es un string numérico que QB incrementa
en cada modificación del registro.

1. `ItemInventoryQuery { ListID o NameFilter }` → obtiene `EditSequence` actual
2. `ItemInventoryMod { ListID, EditSequence, ...fields }` — enviado inmediatamente

Si `EditSequence` no coincide → `QB-3200`.

---

## Restricción de unicidad de Name

`Name` debe ser único dentro del archivo QB Desktop. QB no distingue entre tipos de ítem
(`ItemInventory`, `ItemNonInventory`, `ItemService`) para esta validación — no pueden existir
dos ítems de cualquier tipo con el mismo nombre. `QB-3100` si se intenta duplicar.

---

## Cuentas contables — tipos requeridos

QB Desktop valida que los `AccountRef` sean del tipo correcto:

| Campo | Tipo de cuenta QB esperado |
|-------|--------------------------|
| `IncomeAccountRef` | Income (ingresos) |
| `COGSAccountRef` | Cost of Goods Sold |
| `AssetAccountRef` | Other Current Asset (inventario) |

Si se usa una cuenta de tipo incorrecto (ej. un Expense como IncomeAccountRef), QB retorna
`QB-3170`. Verificar los tipos de cuenta en QB Desktop → Chart of Accounts.

---

## Timeout en sedes con inventario grande

QB Desktop en sedes con catálogos grandes (REC: 569 ítems) puede superar los 25s de respuesta
cuando `ItemInventoryQuery` no tiene `MaxReturned`. El timeout del backend (15s) retorna
`INTERNAL_ERROR — timeout` antes de que QB complete la respuesta. Siempre incluir `MaxReturned`
en Queries a sedes de producción.

---

## Archivos relevantes

| Artefacto | Ruta |
|-----------|------|
| Contrato frontend | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts` |
| Componente principal | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx` |
| Routing table | `apps/api/src/modules/integration/qb-endpoints.ts` |
| Webhook config | `apps/api/src/modules/integration/webhooks.config.ts` |
