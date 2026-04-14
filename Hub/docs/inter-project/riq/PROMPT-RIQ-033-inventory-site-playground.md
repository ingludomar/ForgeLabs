# PROMPT-RIQ-033 — Inventory Site · Implementación en QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-13 |
| **Proyecto destino** | RIQ |
| **Tipo** | feature |
| **Estado** | ✅ solved |

---

## Contexto

`InventorySite` no está registrado en el QB Playground de Redix.
Los workflows de LedgerOps ya existen y están activos en N8N.
Este PROMPT cubre los 4 cambios necesarios para que aparezca la sección en el UI.

---

## Cambios requeridos

### 1 — `apps/api/src/modules/integration/constants/qb-endpoints.ts`

Agregar después de la línea `ItemInventoryQuery`, dentro del bloque `// Inventory`:

```typescript
  InventorySiteAdd:   'QB_INVENTORY_SITE_ADD',
  InventorySiteMod:   'QB_INVENTORY_SITE_MOD',
  InventorySiteQuery: 'QB_INVENTORY_SITE_QUERY',
```

Resultado esperado del bloque Inventory:

```typescript
  // Inventory
  ItemInventoryAdd:     'QB_INVENTORY_ITEM_ADD',
  ItemInventoryMod:     'QB_INVENTORY_ITEM_MOD',
  ItemInventoryQuery:   'QB_INVENTORY_ITEM_QUERY',
  InventorySiteAdd:     'QB_INVENTORY_SITE_ADD',
  InventorySiteMod:     'QB_INVENTORY_SITE_MOD',
  InventorySiteQuery:   'QB_INVENTORY_SITE_QUERY',
```

---

### 2 — `apps/api/src/common/config/webhooks.config.ts`

**En la interfaz `WebhooksConfig`**, agregar después de `QB_INVENTORY_ITEM_QUERY`:

```typescript
  QB_INVENTORY_SITE_ADD:    string;
  QB_INVENTORY_SITE_MOD:    string;
  QB_INVENTORY_SITE_QUERY:  string;
```

**En el factory `webhooksConfig`**, agregar después de `QB_INVENTORY_ITEM_QUERY`:

```typescript
    QB_INVENTORY_SITE_ADD:   url('/webhook/inventory/site/add'),
    QB_INVENTORY_SITE_MOD:   url('/webhook/inventory/site/mod'),
    QB_INVENTORY_SITE_QUERY: url('/webhook/inventory/site/query'),
```

---

### 3 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts`

#### 3a — Nuevas variables de campos (insertar antes de `// ─── ACTIONS REGISTRY`)

```typescript
// ─── INVENTORY SITE ADD ──────────────────────────────────────────────────────

const inventorySiteAddFields: ContractField[] = [
  f('Name', 'Site Name', 'Warehouse-TEST', true),
  f('IsActive', 'Is Active', 'true'),
  ref('ParentSiteRef', 'Parent Site', ''),
  f('SiteDesc', 'Site Description', 'Main warehouse location'),
  f('Contact', 'Contact', ''),
  f('Phone', 'Phone', ''),
  f('Fax', 'Fax', ''),
  f('Email', 'Email', ''),
  addr('SiteAddr', 'Site Address'),
];

// ─── INVENTORY SITE MOD ──────────────────────────────────────────────────────

const inventorySiteModFields: ContractField[] = [
  f('ListID', 'List ID', '', true),
  dyn('EditSequence', 'Edit Sequence'),
  ...inventorySiteAddFields,
];

// ─── INVENTORY SITE QUERY ────────────────────────────────────────────────────

const inventorySiteQueryFields: ContractField[] = [
  f('ListID', 'List ID', ''),
  f('FullName', 'Full Name', ''),
  f('MaxReturned', 'Max Returned', ''),
  f('ActiveStatus', 'Active Status', ''),
  { path: 'NameFilter', label: 'Name Filter', type: 'group', required: false, example: '', children: [
    f('NameFilter.MatchCriterion', 'Match Criterion', ''),
    f('NameFilter.Name', 'Name', ''),
  ]},
  f('ModifiedDateRangeFilter.FromModifiedDate', 'Modified After', ''),
  f('ModifiedDateRangeFilter.ToModifiedDate', 'Modified Before', ''),
];
```

#### 3b — Entradas en `QB_ACTIONS` (insertar después de `ItemInventoryQuery`, dentro del bloque `// Inventory`)

```typescript
  { id: 'InventorySiteAdd',   label: 'Inventory Site — Add',   category: 'Inventory', operation: 'Add',   type: 'InventorySiteAdd',   object: 'InventorySiteAdd',    version: '17.0', endpoint: 'POST /webhook/inventory/site/add',   hasContract: false, headerFields: inventorySiteAddFields },
  { id: 'InventorySiteMod',   label: 'Inventory Site — Update', category: 'Inventory', operation: 'Mod',   type: 'InventorySiteMod',   object: 'InventorySiteMod',    version: '17.0', endpoint: 'POST /webhook/inventory/site/mod',   hasContract: false, headerFields: inventorySiteModFields },
  { id: 'InventorySiteQuery', label: 'Inventory Site — Query', category: 'Inventory', operation: 'Query', type: 'InventorySiteQuery', object: 'InventorySiteQueryRq', version: '17.0', endpoint: 'POST /webhook/inventory/site/query', hasContract: false, headerFields: inventorySiteQueryFields },
```

---

### 4 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx`

Agregar en `MOD_QUERY_MAP` (línea 690), después de `BillMod`:

```typescript
  InventorySiteMod: { queryType: 'InventorySiteQuery', idField: 'ListID' },
```

InventorySite es una entidad de lista — usa `ListID`, no `TxnID`.

---

## Verificación

Con la app corriendo, confirmar en el Playground:

1. La sección `Inventory` muestra tres nuevas filas: `Inventory Site — Add`, `Inventory Site — Update`, `Inventory Site — Query`
2. Al seleccionar `Inventory Site — Update`, aparece el botón "Obtener EditSequence"
3. Los campos del formulario coinciden con los definidos arriba

---

## Acción requerida

1. Aplicar los 4 cambios
2. Hacer commit en la rama activa
3. Confirmar a ForgeLabs Hub con el hash del commit

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-13 | Emisión | Inventory Site QB Playground — routing · webhooks · contratos · MOD_QUERY_MAP |
| 2026-04-13 | Resolución | 4 archivos aplicados — commit d2ae4ab pusheado |
