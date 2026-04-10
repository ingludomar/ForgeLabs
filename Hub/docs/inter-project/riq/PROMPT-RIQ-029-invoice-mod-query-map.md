# PROMPT-RIQ-029 — Invoice · Registrar InvoiceMod en MOD_QUERY_MAP

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved |

---

## Contexto

El botón **"Obtener EditSequence"** no aparece en `Invoice — Update` porque `InvoiceMod` no
está registrado en `MOD_QUERY_MAP` en `QBPlaygroundSection.tsx`.

Este mapa controla qué operaciones Mod tienen el botón — y qué Query + campo ID usar para
obtener el EditSequence automáticamente.

---

## Fix requerido

**Archivo:** `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx`

**Ubicación:** constante `MOD_QUERY_MAP` (~línea 690)

**Antes:**
```typescript
const MOD_QUERY_MAP: Record<string, { queryType: string; idField: 'ListID' | 'TxnID' }> = {
  ItemInventoryMod: { queryType: 'ItemInventoryQuery', idField: 'ListID' },
  CustomerMod:      { queryType: 'CustomerQuery',      idField: 'ListID' },
  VendorMod:        { queryType: 'VendorQuery',        idField: 'ListID' },
  SalesOrderMod:    { queryType: 'SalesOrderQuery',    idField: 'TxnID'  },
  PurchaseOrderMod: { queryType: 'PurchaseOrderQuery', idField: 'TxnID'  },
};
```

**Después:**
```typescript
const MOD_QUERY_MAP: Record<string, { queryType: string; idField: 'ListID' | 'TxnID' }> = {
  ItemInventoryMod: { queryType: 'ItemInventoryQuery', idField: 'ListID' },
  CustomerMod:      { queryType: 'CustomerQuery',      idField: 'ListID' },
  VendorMod:        { queryType: 'VendorQuery',        idField: 'ListID' },
  SalesOrderMod:    { queryType: 'SalesOrderQuery',    idField: 'TxnID'  },
  PurchaseOrderMod: { queryType: 'PurchaseOrderQuery', idField: 'TxnID'  },
  InvoiceMod:       { queryType: 'InvoiceQuery',       idField: 'TxnID'  },
};
```

---

## Verificación

En el Playground con la app corriendo:
1. Seleccionar `Invoice — Update` en Sales
2. Confirmar que aparece el botón **"Obtener EditSequence"**
3. Ingresar un TxnID válido de TEST (`626CC-1775750031`) → clic en el botón → EditSequence se rellena automáticamente
4. Ejecutar Mod → `success: true`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | InvoiceMod no registrado en MOD_QUERY_MAP — botón "Obtener EditSequence" no aparece |
| 2026-04-09 | Resolución | Commit `4699e8d` — una línea añadida en `QBPlaygroundSection.tsx:695` · verificación pendiente |
