# PROMPT-RIQ-031 — Bill · Registrar BillMod en MOD_QUERY_MAP

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-12 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved |

---

## Contexto

El botón **"Obtener EditSequence"** no aparece en `Bill — Update` porque `BillMod` no está
registrado en `MOD_QUERY_MAP` en `QBPlaygroundSection.tsx`.

Bill ya tiene routing, webhooks y contracts completos. Este es el único bloqueo antes de
poder testear el flujo Mod desde el Playground.

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
  InvoiceMod:       { queryType: 'InvoiceQuery',       idField: 'TxnID'  },
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
  BillMod:          { queryType: 'BillQuery',          idField: 'TxnID'  },
};
```

---

## Verificación

En el Playground con la app corriendo:
1. Seleccionar `Bill — Update` en Purchasing
2. Confirmar que aparece el botón **"Obtener EditSequence"**
3. Ingresar un TxnID válido de TEST → clic en el botón → EditSequence se rellena automáticamente
4. Ejecutar Mod → `success: true`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-12 | Emisión | BillMod no registrado en MOD_QUERY_MAP — botón "Obtener EditSequence" no aparece en Bill Update |
| 2026-04-12 | Resolución | Commit `c13cfb2` — una línea añadida en `QBPlaygroundSection.tsx:697` |
