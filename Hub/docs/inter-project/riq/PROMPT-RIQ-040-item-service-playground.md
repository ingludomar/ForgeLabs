# PROMPT-RIQ-040 — ItemService · Implementación en QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-14 |
| **Proyecto destino** | RIQ |
| **Tipo** | feature |
| **Estado** | ✅ solved — commit f6aae04 |

---

## Contexto

`ItemService` no está registrado en el QB Playground de Redix.
Los workflows de LedgerOps ya existen y están activos en N8N.
Este PROMPT cubre los 4 cambios necesarios para que aparezca la sección en el UI.

`ItemService` es una entidad de lista — usa `ListID`, no `TxnID`.
`Add` y `Mod` usan `hasContract: true` (campos dinámicos desde LO).
`Query` usa `hasContract: false` (campos estáticos en contracts.ts).

---

## Verificación previa requerida

Antes de implementar, confirmar:

1. Las rutas exactas de los webhooks de ItemService en LO N8N
2. La categoría (`category`) que usa `ItemInventory` en `QB_ACTIONS` — `ItemService` debe usar la misma
3. El prefijo de constante usado para ItemInventory en `qb-endpoints.ts` — usar el mismo patrón

---

## Cambios requeridos

### 1 — `apps/api/src/modules/integration/constants/qb-endpoints.ts`

Agregar junto al bloque de ItemInventory (usar el mismo prefijo de constante):

```typescript
  ItemServiceAdd:   'QB_ITEM_SERVICE_ADD',
  ItemServiceMod:   'QB_ITEM_SERVICE_MOD',
  ItemServiceQuery: 'QB_ITEM_SERVICE_QUERY',
```

> ⚠️ Verificar el prefijo exacto contra el que usa ItemInventory en este archivo.

---

### 2 — `apps/api/src/common/config/webhooks.config.ts`

**En la interfaz `WebhooksConfig`**, agregar:

```typescript
  QB_ITEM_SERVICE_ADD:    string;
  QB_ITEM_SERVICE_MOD:    string;
  QB_ITEM_SERVICE_QUERY:  string;
```

**En el factory `webhooksConfig`**, agregar:

```typescript
    QB_ITEM_SERVICE_ADD:   url('/webhook/items/item-service/add'),
    QB_ITEM_SERVICE_MOD:   url('/webhook/items/item-service/mod'),
    QB_ITEM_SERVICE_QUERY: url('/webhook/items/item-service/query'),
```

> ⚠️ Verificar las rutas exactas contra los workflows activos en LO N8N antes de aplicar.

---

### 3 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts`

#### 3a — Variable de campos Query (insertar antes de `// ─── ACTIONS REGISTRY`)

```typescript
// ─── ITEM SERVICE QUERY ───────────────────────────────────────────────────────

const itemServiceQueryFields: ContractField[] = [
  f('ListID', 'List ID', ''),
  f('FullName', 'Full Name', ''),
  f('MaxReturned', 'Max Returned', ''),
  f('ActiveStatus', 'Active Status', 'All'),
  f('FromModifiedDate', 'Modified After', ''),
  f('ToModifiedDate', 'Modified Before', ''),
  f('NameFilter.MatchCriterion', 'Name Match', ''),
  f('NameFilter.Name', 'Name', ''),
  f('NameRangeFilter.FromName', 'Name From', ''),
  f('NameRangeFilter.ToName', 'Name To', ''),
  f('ClassFilter.ListID', 'Class ListID', ''),
  f('ClassFilter.FullName', 'Class FullName', ''),
];
```

#### 3b — Entradas en `QB_ACTIONS` (insertar en el mismo bloque de ItemInventory)

```typescript
  { id: 'ItemServiceAdd',   label: 'Item Service — Add',   category: '<misma que ItemInventory>', operation: 'Add',   type: 'ItemServiceAdd',   object: 'ItemServiceAdd',    version: '17.0', endpoint: 'POST /webhook/items/item-service/add',   hasContract: true,  headerFields: [] },
  { id: 'ItemServiceMod',   label: 'Item Service — Update', category: '<misma que ItemInventory>', operation: 'Mod',   type: 'ItemServiceMod',   object: 'ItemServiceMod',    version: '17.0', endpoint: 'POST /webhook/items/item-service/mod',   hasContract: true,  headerFields: [] },
  { id: 'ItemServiceQuery', label: 'Item Service — Query',  category: '<misma que ItemInventory>', operation: 'Query', type: 'ItemServiceQuery', object: 'ItemServiceQueryRq', version: '17.0', endpoint: 'POST /webhook/items/item-service/query', hasContract: false, headerFields: itemServiceQueryFields },
```

> Reemplazar `<misma que ItemInventory>` con la categoría real de ItemInventory en QB_ACTIONS.

---

### 4 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx`

Agregar en `MOD_QUERY_MAP` junto a ItemInventory:

```typescript
  ItemServiceMod: { queryType: 'ItemServiceQuery', idField: 'ListID' },
```

`ItemService` es una entidad de lista — usa `ListID`, no `TxnID`.

---

## Verificación

Con la app corriendo, confirmar en el Playground:

1. La sección de Items muestra las nuevas filas: `Item Service — Add`, `Item Service — Update`, `Item Service — Query`
2. Al seleccionar `Item Service — Add` o `Update`, el formulario carga los campos dinámicos desde LO
3. Al seleccionar `Item Service — Update`, aparece el botón "Obtener EditSequence"
4. Al seleccionar `Item Service — Query`, el formulario muestra los campos estáticos definidos arriba
5. El dropdown de sedes lista correctamente las sedes disponibles

---

## Acción requerida

1. **Analizar viabilidad** — confirmar rutas LO N8N y categoría de ItemInventory antes de implementar
2. Aplicar los 4 cambios
3. Verificar rutas webhook contra LO N8N
4. Hacer commit en la rama activa
5. Confirmar a FL: `PROMPT-RIQ-040 completado. Commit {hash}`

---

## Corrección aplicada

Las rutas `/webhook/items/item-service/*` del PROMPT no existen en N8N. ItemService reutiliza las mismas rutas que ItemInventory:

| QB Type | Webhook Key | URL |
|---|---|---|
| ItemServiceAdd | QB_INVENTORY_ITEM_ADD | `/webhook/inventory/item/add` |
| ItemServiceMod | QB_INVENTORY_ITEM_MOD | `/webhook/inventory/item/mod` |
| ItemServiceQuery | QB_INVENTORY_ITEM_QUERY | `/webhook/inventory/item/query` |

Sin cambios en `webhooks.config.ts` — las URLs ya estaban definidas.

---

## Resultados de testing

| Operación | Sede | Payload | Resultado |
|---|---|---|---|
| Query | TEST | MaxReturned: 1 · ActiveStatus: All | ✅ |
| Add | TEST | Name: RDX-SVC-001 · SalesTaxCodeRef · SalesOrPurchase.Price: 100.00 · AccountRef | ✅ ListID: 80009958-1776193394 |
| Query | TEST | ListID: 80009958-1776193394 | ✅ |
| Mod | TEST | ListID + EditSequence + SalesOrPurchaseMod + AccountRef | ✅ Name: RDX-SVC-001-MOD |
| Query | RUS | MaxReturned: 1 | ✅ |
| Query | RBR | MaxReturned: 1 | ✅ |
| Query | RMX | MaxReturned: 1 | ✅ |

### Hallazgo — Campos requeridos por sede TEST

`SalesTaxCodeRef`, `SalesOrPurchase.Price` y `SalesOrPurchase.AccountRef.ListID` son requeridos por regla de negocio en sede TEST. No son requeridos por Intuit.
En Mod el contenedor cambia de `SalesOrPurchase` a `SalesOrPurchaseMod`.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-14 | Emisión | ItemService QB Playground — routing · webhooks · contratos · MOD_QUERY_MAP |
| 2026-04-14 | Completado | Commit f6aae04 — rutas reutilizadas de ItemInventory · CRUD TEST ✅ · RUS/RBR/RMX Query ✅ |
