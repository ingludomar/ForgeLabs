# PROMPT-RIQ-018 — QB Playground · Documentación Item Inventory

**Fecha:** 2026-04-03
**Tipo:** docs
**Estado:** ⏳ pending

## PROMPTs relacionados

- [PROMPT-LO-022](../ledgerops/PROMPT-LO-022-qb-playground-item-inventory-docs.md) — LedgerOps publica el contenido que este PROMPT genera
- [PROMPT-RIQ-011](PROMPT-RIQ-011-vendor-playground-docs.md) — mismo patrón, entidad Vendor
- [PROMPT-RIQ-013](PROMPT-RIQ-013-customer-playground-docs.md) — mismo patrón, entidad Customer

---

## Objetivo

Generar el **contenido** de la documentación de la entidad Item Inventory en el QB Playground de Redix. El archivo será creado y guardado por LedgerOps en su repositorio bajo `docs/qb-playground/ItemInventory.md` — RIQ entrega únicamente el texto en formato Markdown.

---

## Paso previo — Testing

Antes de generar la documentación, ejecutar y verificar todas las operaciones en las 5 sedes:

| Operación | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| ItemInventoryQuery | | | | | |
| ItemInventoryAdd | | | | | |
| ItemInventoryMod | | | | | |

Reportar resultado (✅ / ❌ + descripción del error si aplica) por cada combinación.

---

## Contenido requerido

### 1. Descripción general
Qué es Item Inventory en QuickBooks Desktop y qué operaciones están disponibles en el Playground (Add · Mod · Query).

### 2. Cómo acceder
Pasos para llegar al QB Playground en Redix y seleccionar la entidad Item Inventory.

### 3. Operaciones disponibles

Por cada operación (Add · Mod · Query):
- **Campos requeridos** — cuáles son obligatorios y por qué (incluir los requeridos por Intuit y los requeridos por sede)
- **Campos opcionales** — listado breve de los más relevantes
- **Cómo usar Fill Examples** — qué completa automáticamente y qué debe ingresar el usuario
- **Resultado esperado** — qué debe aparecer en la pestaña Resumen si la operación es exitosa

### 4. Notas importantes
- Para Mod: siempre usar "Obtener EditSequence" antes de enviar
- Los ListIDs de referencia (IncomeAccountRef, AssetAccountRef, COGSAccountRef, etc.) son específicos de cada sede
- Fill Examples contiene datos reales de sede TEST
- El `Name` del item debe ser único en QB — duplicados generan error

### 5. Casos de prueba rápidos

| Operación | Pasos | Resultado esperado |
|---|---|---|
| Query | Fill Examples → Send Query | Item retornado con sus datos |
| Add | Fill Examples → completar Name único → Send | Nuevo ListID en respuesta |
| Mod | Fill Examples → Obtener EditSequence → cambiar un campo → Send | Item modificado confirmado |

### 6. Referencia de errores comunes

Incluir los errores QB más frecuentes para esta entidad (códigos 3100, 3170, 3200, LB-VALIDATION-MISSING_REQUIRED) con causa y solución.

---

## Entrega esperada de RIQ

1. Tabla de resultados de testing (todas las operaciones × 5 sedes)
2. Contenido completo en Markdown listo para publicar en LedgerOps

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-03 | Emisión | PROMPT emitido a RIQ — testing Item Inventory en 5 sedes + generar contenido Markdown para QB Playground |
