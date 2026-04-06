# PROMPT-RIQ-021 — QB Playground · Documentación Sales Order

**Fecha:** 2026-04-06
**Tipo:** docs
**Estado:** ⏳ pending

## PROMPTs relacionados

- [PROMPT-LO-026](../ledgerops/PROMPT-LO-026-qb-playground-salesorder-docs.md) — LedgerOps publica el contenido que este PROMPT genera
- [PROMPT-RIQ-018](PROMPT-RIQ-018-item-inventory-playground-docs.md) — mismo patrón, entidad Item Inventory
- [PROMPT-RIQ-011](PROMPT-RIQ-011-vendor-playground-docs.md) — mismo patrón, entidad Vendor

---

## Objetivo

Generar el **contenido** de la documentación de la entidad Sales Order en el QB Playground de Redix. El archivo será creado y guardado por LedgerOps en su repositorio bajo `docs/qb-playground/SalesOrder.md` — RIQ entrega únicamente el texto en formato Markdown.

---

## Paso previo — Testing

Antes de generar la documentación, ejecutar y verificar todas las operaciones. Metodología: CRUD completo en TEST · solo Query en producción.

| Operación | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| SalesOrderQuery | | | | | |
| SalesOrderAdd | | | | | |
| SalesOrderMod | | | | | |

Reportar resultado (✅ / ❌ + descripción del error si aplica) por cada combinación.

---

## Contenido requerido

### 1. Descripción general
Qué es Sales Order en QuickBooks Desktop y qué operaciones están disponibles en el Playground (Add · Mod · Query).

### 2. Cómo acceder
Pasos para llegar al QB Playground en Redix y seleccionar la entidad Sales Order.

### 3. Operaciones disponibles

Por cada operación (Add · Mod · Query):
- **Campos requeridos** — cuáles son obligatorios (requeridos por Intuit + requeridos por sede)
- **Campos opcionales** — listado breve de los más relevantes
- **Líneas de detalle** — cómo agregar `SalesOrderLineAdd` (campos requeridos por línea)
- **Cómo usar Fill Examples** — qué completa automáticamente y qué debe ingresar el usuario
- **Resultado esperado** — qué debe aparecer en la pestaña Resumen si la operación es exitosa

### 4. Notas importantes
- Para Mod: siempre obtener `EditSequence` con un Query previo antes de enviar
- `CustomerRef.ListID` es específico de cada sede — no portable entre compañías
- `ItemRef.ListID` en las líneas es específico de cada sede
- Fill Examples contiene datos reales de sede TEST
- `TxnID` es asignado por QB al crear — usar para Mod y Query por ID específico

### 5. Casos de prueba rápidos

| # | Operación | Pasos | Resultado esperado |
|---|---|---|---|
| 1 | Query | Fill Examples → Send | Lista de Sales Orders retornada |
| 2 | Add | Fill Examples → completar campos → Send | Nuevo `TxnID` en respuesta |
| 3 | Mod | Query → obtener TxnID + EditSequence → modificar campo → Send | Order modificada confirmada |

### 6. Referencia de errores comunes

Incluir los errores QB más frecuentes para esta entidad (3100, 3120, 3200, 3240, LB-VALIDATION-MISSING_REQUIRED, MISSING-DATA) con causa y solución.

---

## Entrega esperada de RIQ

1. Tabla de resultados de testing (todas las operaciones × 5 sedes)
2. Contenido completo en Markdown listo para publicar en LedgerOps

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-06 | Emisión | PROMPT emitido a RIQ — testing Sales Order en 5 sedes + generar contenido Markdown para QB Playground |
