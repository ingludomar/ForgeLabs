# PROMPT-RIQ-037 — CreditCardCharge · Implementación en QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-14 |
| **Proyecto destino** | RIQ |
| **Tipo** | feature |
| **Estado** | 🔵 pending |

---

## Contexto

`CreditCardCharge` no está registrado en el QB Playground de Redix.
Los workflows de LedgerOps ya existen y están activos en N8N.
Este PROMPT cubre los 4 cambios necesarios para que aparezca la sección en el UI.

`CreditCardCharge` es una entidad de transacción — usa `TxnID`, no `ListID`.
`Add` y `Mod` usan `hasContract: true` (campos dinámicos desde LO).
`Query` usa `hasContract: false` (campos estáticos en contracts.ts).

---

## Cambios requeridos

### 1 — `apps/api/src/modules/integration/constants/qb-endpoints.ts`

Agregar un nuevo bloque `// Banking` después del último bloque existente:

```typescript
  // Banking
  CreditCardChargeAdd:   'QB_CREDIT_CARD_CHARGE_ADD',
  CreditCardChargeMod:   'QB_CREDIT_CARD_CHARGE_MOD',
  CreditCardChargeQuery: 'QB_CREDIT_CARD_CHARGE_QUERY',
```

---

### 2 — `apps/api/src/common/config/webhooks.config.ts`

**En la interfaz `WebhooksConfig`**, agregar al final del bloque existente:

```typescript
  QB_CREDIT_CARD_CHARGE_ADD:    string;
  QB_CREDIT_CARD_CHARGE_MOD:    string;
  QB_CREDIT_CARD_CHARGE_QUERY:  string;
```

**En el factory `webhooksConfig`**, agregar al final:

```typescript
    QB_CREDIT_CARD_CHARGE_ADD:   url('/webhook/banking/credit-card-charge/add'),
    QB_CREDIT_CARD_CHARGE_MOD:   url('/webhook/banking/credit-card-charge/mod'),
    QB_CREDIT_CARD_CHARGE_QUERY: url('/webhook/banking/credit-card-charge/query'),
```

> ⚠️ Verificar las rutas exactas contra los workflows activos en LO N8N antes de aplicar.

---

### 3 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts`

#### 3a — Variable de campos Query (insertar antes de `// ─── ACTIONS REGISTRY`)

```typescript
// ─── CREDIT CARD CHARGE QUERY ────────────────────────────────────────────────

const creditCardChargeQueryFields: ContractField[] = [
  f('TxnID', 'Transaction ID', ''),
  f('RefNumber', 'Ref Number', ''),
  f('MaxReturned', 'Max Returned', ''),
  f('TxnDateRangeFilter.FromTxnDate', 'Date From', ''),
  f('TxnDateRangeFilter.ToTxnDate', 'Date To', ''),
  f('ModifiedDateRangeFilter.FromModifiedDate', 'Modified After', ''),
  f('ModifiedDateRangeFilter.ToModifiedDate', 'Modified Before', ''),
  f('EntityFilter.ListID', 'Payee ListID', ''),
  f('EntityFilter.FullName', 'Payee FullName', ''),
  f('AccountFilter.ListID', 'Account ListID', ''),
  f('AccountFilter.FullName', 'Account FullName', ''),
];
```

> `Add` y `Mod` no requieren campos en contracts.ts — usan `hasContract: true` (contrato dinámico desde LO).

#### 3b — Entradas en `QB_ACTIONS` (insertar en el bloque `// Banking`, crearlo si no existe)

```typescript
  { id: 'CreditCardChargeAdd',   label: 'Credit Card Charge — Add',   category: 'Banking', operation: 'Add',   type: 'CreditCardChargeAdd',   object: 'CreditCardChargeAdd',    version: '17.0', endpoint: 'POST /webhook/banking/credit-card-charge/add',   hasContract: true,  headerFields: [] },
  { id: 'CreditCardChargeMod',   label: 'Credit Card Charge — Update', category: 'Banking', operation: 'Mod',   type: 'CreditCardChargeMod',   object: 'CreditCardChargeMod',    version: '17.0', endpoint: 'POST /webhook/banking/credit-card-charge/mod',   hasContract: true,  headerFields: [] },
  { id: 'CreditCardChargeQuery', label: 'Credit Card Charge — Query',  category: 'Banking', operation: 'Query', type: 'CreditCardChargeQuery', object: 'CreditCardChargeQueryRq', version: '17.0', endpoint: 'POST /webhook/banking/credit-card-charge/query', hasContract: false, headerFields: creditCardChargeQueryFields },
```

---

### 4 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx`

Agregar en `MOD_QUERY_MAP` después de `InventorySiteMod`:

```typescript
  CreditCardChargeMod: { queryType: 'CreditCardChargeQuery', idField: 'TxnID' },
```

`CreditCardCharge` es una transacción — usa `TxnID`, no `ListID`.

---

## Verificación

Con la app corriendo, confirmar en el Playground:

1. La sección `Banking` muestra tres nuevas filas: `Credit Card Charge — Add`, `Credit Card Charge — Update`, `Credit Card Charge — Query`
2. Al seleccionar `Credit Card Charge — Add` o `Update`, el formulario carga los campos dinámicos desde LO (no campos vacíos)
3. Al seleccionar `Credit Card Charge — Update`, aparece el botón "Obtener EditSequence"
4. Al seleccionar `Credit Card Charge — Query`, el formulario muestra los campos estáticos definidos arriba
5. Verificar que el sedes dropdown lista correctamente las sedes disponibles

---

## Acción requerida

1. Aplicar los 4 cambios
2. Verificar rutas webhook contra LO N8N
3. Hacer commit en la rama activa
4. Confirmar a FL: `PROMPT-RIQ-037 completado. Commit {hash}`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-14 | Emisión | CreditCardCharge QB Playground — routing · webhooks · contratos · MOD_QUERY_MAP |
