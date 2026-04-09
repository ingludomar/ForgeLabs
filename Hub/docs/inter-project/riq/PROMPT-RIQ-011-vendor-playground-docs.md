# PROMPT-RIQ-011 — QB Playground · Documentación Vendor

**Fecha:** 2026-03-31
**Tipo:** docs
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-LO-019](../ledgerops/PROMPT-LO-019-qb-playground-vendor-docs.md) — LedgerOps publica el contenido que este PROMPT genera
- [PROMPT-RIQ-012](PROMPT-RIQ-012-vendor-feature-delivery.md) — cierre formal del feature Vendor que usa el doc generado aquí

---

## Objetivo

Generar el **contenido** de la documentación de la entidad Vendor en el QB Playground de Redix. El archivo será creado y guardado por LedgerOps en su repositorio bajo `docs/qb-playground/Vendor.md` — RIQ entrega únicamente el texto en formato Markdown.

---

## Contenido requerido

### 1. Descripción general
Qué es Vendor en QuickBooks Desktop y qué operaciones están disponibles en el Playground (Add · Mod · Query).

### 2. Cómo acceder
Pasos para llegar al QB Playground en Redix y seleccionar la entidad Vendor.

### 3. Operaciones disponibles

Por cada operación (Add · Mod · Query):
- **Campos requeridos** — cuáles son obligatorios y por qué
- **Campos opcionales** — listado breve
- **Cómo usar Fill Examples** — qué completa automáticamente y qué debe ingresar el usuario
- **Resultado esperado** — qué debe aparecer en la pestaña Resumen si la operación es exitosa

### 4. Notas importantes
- Para Mod: siempre usar "Obtener EditSequence" antes de enviar
- Los ListIDs de referencia (CurrencyRef, etc.) son específicos de cada sede
- Fill Examples contiene datos reales de sede TEST

### 5. Casos de prueba rápidos

| Operación | Pasos | Resultado esperado |
|---|---|---|
| Query | Fill Examples → Send Query | Vendor `REDSIS CORP-USD` retornado |
| Add | Fill Examples → completar IsActive=true → Send | Nuevo ListID en respuesta |
| Mod | Fill Examples → Obtener EditSequence → Send | Vendor modificado confirmado |

---

## Verificación

Confirmar a SyncBridge con enlace al documento generado.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a RIQ — generar contenido Markdown de documentación Vendor para QB Playground |
| 2026-03-31 | Resolución | Contenido generado y entregado a SyncBridge para publicación en LedgerOps |
