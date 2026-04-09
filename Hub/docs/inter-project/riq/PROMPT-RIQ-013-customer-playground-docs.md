# PROMPT-RIQ-013 — QB Playground · Documentación Customer

**Fecha:** 2026-03-31
**Tipo:** docs
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-LO-020](../ledgerops/PROMPT-LO-020-qb-playground-customer-docs.md) — LedgerOps publica el contenido que este PROMPT genera

---

## Objetivo

Generar el **contenido** de la documentación de la entidad Customer en el QB Playground de Redix. El archivo será creado y guardado por LedgerOps en su repositorio bajo `docs/qb-playground/Customer.md` — RIQ entrega únicamente el texto en formato Markdown.

---

## Contenido requerido

### 1. Descripción general
Qué es Customer en QuickBooks Desktop y qué operaciones están disponibles en el Playground (Add · Mod · Query).

### 2. Cómo acceder
Pasos para llegar al QB Playground en Redix y seleccionar la entidad Customer.

### 3. Operaciones disponibles

Por cada operación (Add · Mod · Query):
- **Campos requeridos** — cuáles son obligatorios y por qué
- **Campos opcionales** — listado breve
- **Cómo usar Fill Examples** — qué completa automáticamente y qué debe ingresar el usuario
- **Resultado esperado** — qué debe aparecer en la pestaña Resumen si la operación es exitosa

### 4. Notas importantes
- Para Mod: siempre usar "Obtener EditSequence" antes de enviar
- Los ListIDs de referencia (CurrencyRef, SalesTaxCodeRef, etc.) son específicos de cada sede
- Fill Examples contiene datos reales de sede TEST
- Renombrar a un Name ya existente en QB genera error 3170 — usar nombres únicos

### 5. Casos de prueba rápidos

| Operación | Pasos | Resultado esperado |
|---|---|---|
| Query | Fill Examples → Send Query | Customer retornado con sus datos |
| Add | Fill Examples → completar Name único → Send | Nuevo ListID en respuesta |
| Mod | Fill Examples → Obtener EditSequence → cambiar un campo → Send | Customer modificado confirmado |

---

## Verificación

Entregar a SyncBridge:

1. Contenido completo en Markdown (SyncBridge emite PROMPT a LO para crear el archivo)
2. Versión del feature registrada en el changelog o archivo de versiones del proyecto

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a RIQ — generar contenido Markdown de documentación Customer para QB Playground |
| 2026-03-31 | Resolución | Contenido generado y entregado a SyncBridge para publicación en LedgerOps |
