# PROMPT-RIQ-044 — RIQ · ItemNonInventory · Integración completa QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | RIQ |
| **Tipo** | feature |
| **Estado** | ✅ solved — commit babc414 |

---

## Contexto

`ItemNonInventory` no aparece en el QB Playground. LO ya sirve el contrato correctamente (`GET /webhook/contracts?type=ItemNonInventoryAdd&sede=TEST` → success, 12 campos). El problema es que RIQ no tiene la entidad registrada en QB_ACTIONS ni template activo en `qb_template`.

El patrón es idéntico al que se aplicó para `ItemService` (RIQ-040 + RIQ-042).

---

## Propuesta de FL

Implementar en el mismo PROMPT (scope pequeño):

### 1 — QB_ACTIONS en contracts.ts

Registrar `ItemNonInventoryAdd` y `ItemNonInventoryMod` con `hasContract: true` y `headerFields: []`. Reutilizar las mismas rutas de ItemInventory e ItemService (`/webhook/inventory/item/*`).

### 2 — Template en qb_template (sede TEST)

**ItemNonInventoryAdd**

| # | fieldKey | label | required |
|---|---|---|---|
| 0 | `Name` | Item Name | ✓ |
| 1 | `IsActive` | Is Active | — |
| 2 | `SalesTaxCodeRef.ListID` | Sales Tax Code (ListID) | ✓ |
| 3 | `SalesOrPurchase.Desc` | Description | — |
| 4 | `SalesOrPurchase.Price` | Price | ✓ |
| 5 | `SalesOrPurchase.AccountRef.ListID` | Account (ListID) | ✓ |

**ItemNonInventoryMod**

| # | fieldKey | label | required |
|---|---|---|---|
| 0 | `ListID` | List ID | ✓ |
| 1 | `EditSequence` | Edit Sequence | ✓ |
| 2 | `Name` | Item Name | — |
| 3 | `IsActive` | Is Active | — |
| 4 | `SalesTaxCodeRef.ListID` | Sales Tax Code (ListID) | — |
| 5 | `SalesOrPurchaseMod.Desc` | Description | — |
| 6 | `SalesOrPurchaseMod.Price` | Price | — |
| 7 | `SalesOrPurchaseMod.AccountRef.ListID` | Account (ListID) | ✓ |

### 3 — Fill Examples

Agregar datos reales de TEST en `QB_TEMPLATE_EXAMPLES` para `ItemNonInventoryAdd` y `ItemNonInventoryMod`. Seguir el mismo patrón implementado para ItemService en commit `16996e8`.

> Datos de referencia disponibles via Query en TEST.

---

## Acción requerida

1. Analizar si la propuesta es acorde al patrón existente — ajustar si es necesario
2. Responder a FL con análisis o contrapropuesta antes de implementar
3. Esperar aprobación de FL
4. Implementar todo + commit
5. Verificar en browser: entidad aparece en Playground · formulario Add muestra campos · Fill Example funciona · Mod con Obtener EditSequence funciona
6. Reportar a FL: `PROMPT-RIQ-044 completado. Commit {hash}`
7. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | ItemNonInventory no aparece en Playground — necesita QB_ACTIONS + template qb_template + Fill Examples |
| 2026-04-15 | Completado RIQ | Commit babc414 — routing · QB_ACTIONS · Fill Examples · MOD_QUERY_MAP · templates DB · SalesTaxCodeRef.ListID = 80000001 (NonInventory TEST) |
| 2026-04-15 | FL | Sede rules desactivadas vía toggle-sede — Add y Mod · 5 sedes · Add: 3-4 reglas · Mod: 3-4 reglas |
| 2026-04-15 | Push RIQ | Branch feature/redix-integration-quickbooks-playground pusheada · remoto: redsis-rgh/redix-platform-engine · rango: f6aae04..babc414 |
