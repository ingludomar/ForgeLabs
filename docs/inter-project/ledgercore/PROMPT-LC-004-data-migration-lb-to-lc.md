# PROMPT-LC-004 — Migración de datos LB → LC (catálogo XML + business rules)

**Fecha:** 2026-04-06
**Tipo:** migration
**Estado:** ⏳ pending

## PROMPTs relacionados

- [PROMPT-LC-003](PROMPT-LC-003-gsd-setup-parity-milestone.md) — Milestone 1 completo: 18 endpoints listos para recibir los datos
- [PROMPT-LB-022](../ledgerbridge/PROMPT-022-service-catalog.md) — catálogo de servicios de LB — fuente de los datos a migrar

---

## Contexto

Milestone 1 (PROMPT-LC-003) entregó los 18 endpoints de LC con paridad de comportamiento respecto a LedgerBridge. Sin embargo, la DB de LC está vacía — no tiene los datos que LB acumula en sus archivos:

- **`requiredByIntuit`** — campos requeridos por el schema QBXML, derivados del catálogo de schemas de LB (`describe.json` + `elementOrder` por tipo y versión)
- **`requiredBySede`** — campos requeridos por las reglas de negocio de cada sede, configurados en LB por tipo + sede

Mientras LC no tenga estos datos, `POST /api/contracts` devuelve `requiredBusinessPaths: []` y `requiredByIntuit` incompleto para todos los tipos — lo que hace que LC no pueda reemplazar a LB en la práctica.

---

## Objetivo

Poblar la DB de LC con todos los datos actuales de LB usando los propios endpoints de LC como destino.

---

## ⚠️ Antes de ejecutar

Entregar a SyncBridge el **plan del script de migración** antes de escribir código. No ejecutar hasta recibir aprobación.

---

## Paso 1 — Propuesta de diseño (entregar primero)

### Fuentes (LedgerBridge — endpoints activos)

| Dato | Endpoint LB | Parámetros |
|---|---|---|
| Schema XML por tipo y versión | `GET https://n8n-development.redsis.ai/webhook/describe` | `?type=X&version=V` |
| Business rules por tipo y sede | `GET https://n8n-development.redsis.ai/webhook/business-rules/read` | `?type=X&sede=Y` |

### Destinos (LedgerCore — endpoints Milestone 1)

| Dato | Endpoint LC | Notas |
|---|---|---|
| Catálogo XML | `POST /api/catalog/xml` | `mode=update` para idempotencia |
| Business rules | `POST /api/rules/replace` | Reemplaza el set completo para ese type+sede |

### Tipos a migrar

LC ya tiene `GET /api/catalog/types` con 239 tipos. Usar ese listado como fuente de iteración.

### Sedes y versiones

| Sede | Versión QBXML |
|---|---|
| TEST | 17.0 |
| RUS | 17.0 |
| REC | 17.0 |
| RBR | 17.0 |
| RMX | 13.0 |

Para el catálogo XML: migrar `v17.0` y `v13.0` por separado.
Para business rules: migrar las 5 sedes × N tipos.

### Preguntas para la propuesta

1. **Estructura del script** — ¿un script TypeScript standalone ejecutado con `ts-node`, o un endpoint interno de LC que se invoca una vez (`POST /api/admin/migrate`)?
2. **Concurrencia** — ¿peticiones en serie o en paralelo con límite (p.ej. 5 concurrent)?
3. **Manejo de errores** — ¿skip + log por tipo fallido, o abort en primer error?
4. **Idempotencia** — ¿el script puede ejecutarse múltiples veces sin duplicar datos?
5. **Reporte de resultado** — ¿qué entrega el script al terminar? (contador de tipos migrados, errores, tiempo)

---

## Respuesta esperada de LC

**Primera entrega — antes de ejecutar:**
1. Respuesta a las 5 preguntas de diseño
2. Estimado de tipos × sedes a migrar (total de llamadas a LB)

**Segunda entrega — tras aprobación:**
1. Script implementado + instrucciones de ejecución
2. Reporte de resultado: tipos migrados, business rules escritas, errores (si los hay)
3. Verificación: `POST /api/contracts` con `type=ItemInventoryAdd&sede=TEST` debe devolver `requiredByIntuit` con al menos 1 path y `requiredBusinessPaths` con los paths configurados en LB para esa combinación

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-06 | Emisión | PROMPT emitido a LedgerCore — migrar catálogo XML y business rules desde LB hacia LC |
