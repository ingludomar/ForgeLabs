# PROMPT-RIQ-027 — Invoice · Routing InvoiceMod + InvoiceQuery

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved |

---

## Contexto

Durante el testing de Invoice QB Playground se detectó que solo `InvoiceAdd` estaba registrado
en el routing table. `InvoiceMod` e `InvoiceQuery` no tenían entrada — el botón Run quedaría
inactivo en el Playground para esas dos operaciones.

---

## Cambios aplicados

Los cambios ya están aplicados en el repo. Confirmar y hacer commit.

### `apps/api/src/common/config/webhooks.config.ts`

**Interfaz `WebhooksConfig` — antes:**
```typescript
QB_SALES_INVOICE_ADD: string;
```

**Después:**
```typescript
QB_SALES_INVOICE_ADD:   string;
QB_SALES_INVOICE_MOD:   string;
QB_SALES_INVOICE_QUERY: string;
```

**Factory — antes:**
```typescript
QB_SALES_INVOICE_ADD: url('/webhook/sales/invoice/add'),
```

**Después:**
```typescript
QB_SALES_INVOICE_ADD:   url('/webhook/sales/invoice/add'),
QB_SALES_INVOICE_MOD:   url('/webhook/sales/invoice/mod'),
QB_SALES_INVOICE_QUERY: url('/webhook/sales/invoice/query'),
```

### `apps/api/src/modules/integration/constants/qb-endpoints.ts`

**Antes:**
```typescript
InvoiceAdd: 'QB_SALES_INVOICE_ADD',
```

**Después:**
```typescript
InvoiceAdd:   'QB_SALES_INVOICE_ADD',
InvoiceMod:   'QB_SALES_INVOICE_MOD',
InvoiceQuery: 'QB_SALES_INVOICE_QUERY',
```

---

## Verificación

Confirmar en el Playground que los 3 tipos de Invoice activan el botón Run:
- `InvoiceAdd` en TEST → `success: true`
- `InvoiceMod` en TEST → `success: true`
- `InvoiceQuery` en TEST → `success: true`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | Routing incompleto — InvoiceMod e InvoiceQuery faltaban en qb-endpoints.ts y webhooks.config.ts |
| 2026-04-09 | Resolución | Commit `594501f` en branch `feature/redix-integration-quickbooks-playground` — verificación en Playground pendiente |
