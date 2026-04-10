# PROMPT-RIQ-028 — Invoice · Agregar InvoiceMod + InvoiceQuery en contracts.ts

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved |

---

## Contexto

`InvoiceMod` e `InvoiceQuery` no estaban registrados en `contracts.ts` — solo existía `InvoiceAdd`.
Esto hacía que los dos botones no aparecieran en la sección Sales del QB Playground.

Los cambios ya están aplicados en el archivo. Verificar, ajustar si es necesario y hacer commit.

---

## Cambios aplicados en `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts`

### Nuevas variables declaradas (antes de la sección BILL ADD)

```typescript
// ─── INVOICE MOD ─────────────────────────────────────────────────────────────

const invoiceModHeader: ContractField[] = [
  f('TxnID', 'Transaction ID', '626CC-1775750031', true),
  dyn('EditSequence', 'Edit Sequence'),
  ...invoiceAddHeader.filter(fld => fld.path !== 'ExternalGUID'),
];

const invoiceLineModFields: ContractField[] = [
  f('TxnLineID', 'Transaction Line ID', '-1', true),
  ...invoiceLineFields,
];

// ─── INVOICE QUERY ───────────────────────────────────────────────────────────

const invoiceQueryFields: ContractField[] = [
  f('TxnID', 'Transaction ID', '626CC-1775750031'),
  f('RefNumber', 'Invoice Number', ''),
  f('MaxReturned', 'Max Returned', ''),
  { path: 'TxnDateRangeFilter', label: 'Date Range', type: 'group', required: false, example: '', children: [
    f('TxnDateRangeFilter.FromTxnDate', 'From Date', ''),
    f('TxnDateRangeFilter.ToTxnDate', 'To Date', ''),
  ]},
  { path: 'EntityFilter', label: 'Customer Filter', type: 'group', required: false, example: '', children: [
    f('EntityFilter.FullName', 'Customer Full Name', ''),
    f('EntityFilter.ListID', 'Customer List ID', ''),
  ]},
  { path: 'RefNumberFilter', label: 'Ref Number Filter', type: 'group', required: false, example: '', children: [
    f('RefNumberFilter.MatchCriterion', 'Match Criterion', ''),
    f('RefNumberFilter.RefNumber', 'Ref Number', ''),
  ]},
  f('ModifiedDateRangeFilter.FromModifiedDate', 'Modified After', ''),
  f('ModifiedDateRangeFilter.ToModifiedDate', 'Modified Before', ''),
];
```

> **Nota:** `ActiveStatus` no se incluye en `invoiceQueryFields` — `InvoiceQuery` no acepta ese
> filtro en QB Desktop (retorna `QB-PARSE-ERROR`).

### Entradas agregadas al array de contratos (después de InvoiceAdd)

```typescript
{ id: 'InvoiceMod',   label: 'Invoice — Update', category: 'Sales', operation: 'Mod',   type: 'InvoiceMod',   object: 'InvoiceMod',      version: '17.0', endpoint: 'POST /webhook/sales/invoice/mod',   hasContract: false, headerFields: invoiceModHeader,   lineFields: invoiceLineModFields, lineLabel: 'InvoiceLineMod' },
{ id: 'InvoiceQuery', label: 'Invoice — Query',  category: 'Sales', operation: 'Query', type: 'InvoiceQuery', object: 'InvoiceQueryRq',  version: '17.0', endpoint: 'POST /webhook/sales/invoice/query', hasContract: false, headerFields: invoiceQueryFields },
```

---

## Verificación

Confirmar en el Playground (con la app corriendo) que:
- `Invoice — Update` aparece en Sales y el botón Run se activa con TxnID + EditSequence válidos
- `Invoice — Query` aparece en Sales y retorna `success: true` con `MaxReturned: "1"` en TEST

---

## Acción requerida

1. Verificar que los cambios están correctos en el archivo
2. Hacer commit en la rama activa
3. Confirmar a ForgeLabs Hub con el commit

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | InvoiceMod + InvoiceQuery faltaban en contracts.ts — cambios aplicados, pendiente verificación y commit |
| 2026-04-09 | Resolución parcial | Commit `c88e088` en branch `feature/redix-integration-quickbooks-playground` — botón "Obtener EditSequence" no aparece en InvoiceMod |
