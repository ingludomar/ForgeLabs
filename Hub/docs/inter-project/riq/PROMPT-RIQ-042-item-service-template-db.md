# PROMPT-RIQ-042 — RIQ · ItemService · Crear template activo en qb_template

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | RIQ |
| **Tipo** | feature |
| **Estado** | ✅ solved |

---

## Contexto

El formulario de `ItemServiceAdd` y `ItemServiceMod` en el QB Playground queda vacío. Causa raíz confirmada (PROMPT-RIQ-041): los campos del formulario se sirven desde la tabla `qb_template` de RIQ (Prisma), y no existe ningún template activo para ItemService.

Las entidades que sí funcionan (Bill, Invoice, InventorySite) tienen templates activos en esa tabla. ItemService no.

---

## Propuesta de FL

Crear registros activos en `qb_template` para `ItemServiceAdd` y `ItemServiceMod` siguiendo el mismo patrón de las entidades existentes.

### Campos sugeridos — ItemServiceAdd

| Campo | Requerido | Notas |
|---|---|---|
| `Name` | ✅ | Requerido por Intuit |
| `SalesOrPurchase.Price` | — | Precio de venta/compra |
| `SalesOrPurchase.AccountRef.FullName` | — | Cuenta contable |
| `SalesTaxCodeRef.FullName` | — | Código de impuesto |
| `IsActive` | — | Estado activo/inactivo |
| `ParentRef.FullName` | — | Servicio padre (jerarquía) |

### Campos sugeridos — ItemServiceMod

| Campo | Requerido | Notas |
|---|---|---|
| `ListID` | ✅ | Identificador — se obtiene via Query |
| `EditSequence` | ✅ | Secuencia de edición — dinámica |
| `Name` | — | |
| `SalesOrPurchaseMod.Price` | — | Contenedor cambia a `SalesOrPurchaseMod` en Mod |
| `SalesOrPurchaseMod.AccountRef.FullName` | — | |
| `SalesTaxCodeRef.FullName` | — | |
| `IsActive` | — | |

> Fill Examples con datos reales de TEST: `Name: RDX-SVC-001` · `ListID: 80009958-1776193394`

---

## Acción requerida

1. Analizar si los campos propuestos son correctos según el patrón de templates existentes en `qb_template` — ajustar si es necesario
2. Responder a FL con análisis o contraopropuesta antes de implementar
3. Esperar aprobación de FL
4. Implementar templates activos + commit
5. Verificar que el formulario muestra los campos en el Playground (Add y Mod)
6. Reportar a FL por separado:
   - `PROMPT-RIQ-042 completado. Commit {hash}`
7. FL cierra el PROMPT

---

## Implementación RIQ (2026-04-15)

Templates creados en `qb_template` · sede TEST · sin commit (solo DB records).

**ItemServiceAdd** — `tpeItemServiceAdd` · publicId `a1a1b718-d810-47a1-a504-6f900e99f19e`

| # | fieldKey | label | required |
|---|---|---|---|
| 0 | `Name` | Service Name | ✓ |
| 1 | `IsActive` | Is Active | — |
| 2 | `SalesTaxCodeRef.ListID` | Sales Tax Code (ListID) | ✓ |
| 3 | `SalesOrPurchase.Desc` | Description | — |
| 4 | `SalesOrPurchase.Price` | Price | ✓ |
| 5 | `SalesOrPurchase.AccountRef.ListID` | Account (ListID) | ✓ |

**ItemServiceMod** — `tpeItemServiceMod` · publicId `b03a584b-0cf4-4a33-aad4-e6389e0bdb58`

| # | fieldKey | label | required |
|---|---|---|---|
| 0 | `ListID` | List ID | ✓ |
| 1 | `EditSequence` | Edit Sequence | ✓ |
| 2 | `Name` | Service Name | ✓ |
| 3 | `IsActive` | Is Active | — |
| 4 | `SalesTaxCodeRef.ListID` | Sales Tax Code (ListID) | — |
| 5 | `SalesOrPurchaseMod.Desc` | Description | — |
| 6 | `SalesOrPurchaseMod.Price` | Price | — |
| 7 | `SalesOrPurchaseMod.AccountRef.ListID` | Account (ListID) | ✓ |

Decisiones de diseño:
- Dot-notation paths → `setNestedValue` los convierte a JSON anidado correctamente
- `SalesOrPurchaseMod.AccountRef.ListID` required — previene error QB-3410
- `isDefault: true` automático — primer template para ese type+sede
- Solo sede TEST — consistente con metodología de testing (Add/Mod solo en TEST)

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Template qb_template para ItemServiceAdd + ItemServiceMod — PROMPT-LO-038 redirigido incorrectamente · causa raíz en RIQ DB |
| 2026-04-15 | Completado RIQ | Templates activos en DB · sede TEST · sin commit · 6 campos Add + 8 campos Mod |
| 2026-04-15 | Cierre FL | E2E verificado en browser — campos visibles en Add (6) y Mod (8) · PROMPT cerrado |
