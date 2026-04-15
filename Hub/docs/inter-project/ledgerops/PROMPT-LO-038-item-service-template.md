# PROMPT-LO-038 — LedgerOps · ItemService · Template activo para QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | feature |
| **Estado** | ❌ cancelado — templates viven en DB de RIQ, no en LO |

---

## Contexto

El QB Playground de RIQ usa dos mecanismos para mostrar campos en el formulario:

- `hasContract: false` → campos estáticos definidos en `contracts.ts` de RIQ
- `hasContract: true` + template activo en LO → campos dinámicos desde LO

`ItemServiceAdd` y `ItemServiceMod` tienen `hasContract: true` con `headerFields: []` — diseño correcto. El formulario queda vacío porque **LO no tiene template activo para ItemService**. `Bill`, `Invoice` e `InventorySite` funcionan porque LO sí tiene templates para ellos.

---

## Propuesta de FL

Crear y activar templates en LO para `ItemServiceAdd` y `ItemServiceMod` siguiendo el mismo patrón de las entidades existentes.

### Campos sugeridos para ItemServiceAdd

Basado en el testing de RIQ (PROMPT-RIQ-040) y el contrato que LO ya sirve:

| Campo | Requerido | Notas |
|---|---|---|
| `Name` | ✅ | Requerido por Intuit |
| `SalesOrPurchase.Price` | — | Precio de venta/compra |
| `SalesOrPurchase.AccountRef.FullName` | — | Cuenta contable |
| `SalesTaxCodeRef.FullName` | — | Código de impuesto |
| `IsActive` | — | Estado activo/inactivo |
| `ParentRef.FullName` | — | Servicio padre (jerarquía) |

### Campos sugeridos para ItemServiceMod

| Campo | Requerido | Notas |
|---|---|---|
| `ListID` | ✅ | Identificador — se obtiene via Query |
| `EditSequence` | ✅ | Secuencia de edición — dinámica |
| `Name` | — | |
| `SalesOrPurchaseMod.Price` | — | Contenedor cambia a `SalesOrPurchaseMod` en Mod |
| `SalesOrPurchaseMod.AccountRef.FullName` | — | |
| `SalesTaxCodeRef.FullName` | — | |
| `IsActive` | — | |

> Fill Examples con datos reales de TEST del testing de RIQ-040:
> `Name: RDX-SVC-001` · `ListID: 80009958-1776193394`

---

## Acción requerida

1. Analizar si la propuesta es acorde al patrón de templates existentes o hay algo que ajustar
2. Responder a FL con análisis o contraopropuesta antes de implementar
3. Esperar aprobación de FL
4. Implementar templates + activarlos + commit
5. Reportar a FL cada paso:
   - `PROMPT-LO-038 completado. Commit {hash}`
6. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Template activo para ItemServiceAdd + ItemServiceMod — formulario vacío en Playground por ausencia de template en LO |
| 2026-04-15 | Análisis LO | Templates no viven en LO — están en la tabla `qb_template` de RIQ (Prisma). LO no tiene responsabilidad en este punto. |
| 2026-04-15 | Cancelado FL | PROMPT redirigido incorrectamente. Solución derivada a RIQ vía PROMPT-RIQ-042. |
