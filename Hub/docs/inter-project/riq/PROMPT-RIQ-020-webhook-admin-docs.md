# PROMPT-RIQ-020 — N8N Webhook Administration · Documentación por rol

**Fecha:** 2026-04-04
**Tipo:** docs
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-04

## PROMPTs relacionados

- [PROMPT-RIQ-014](PROMPT-RIQ-014-webhook-config-system.md) — configuración centralizada de webhooks
- [PROMPT-RIQ-015](PROMPT-RIQ-015-webhook-admin-ui.md) — panel de administración visual
- [PROMPT-RIQ-016](PROMPT-RIQ-016-webhook-resolver-singleton.md) — singleton + JWT guard
- [PROMPT-LO-024](../ledgerops/PROMPT-LO-024-webhook-admin-platform-docs.md) — LedgerOps publica el contenido que este PROMPT genera

---

## Objetivo

Generar el contenido completo de documentación del feature **N8N Webhook Administration** para todos los roles. El contenido será publicado por LedgerOps en `docs/platform/WebhookAdmin/`.

RIQ entrega únicamente el texto en formato Markdown — LO crea los archivos.

---

## Documentos requeridos

### 1. Executive.md — Resumen ejecutivo

**Audiencia:** Luis Potte, Mike Habib — sin detalle técnico.

Cubrir:
- Qué problema resuelve: antes, cambiar una URL de webhook requería acceso al servidor y reinicio de la app
- Qué se construyó: panel de administración visual en Redix para gestionar URLs de N8N sin tocar código
- Impacto: un administrador puede actualizar cualquier webhook en segundos, el cambio aplica de inmediato
- Seguridad: solo usuarios con rol de administrador pueden modificar configuraciones
- Base para: conectar módulos comerciales de Redix con QB Desktop sin depender del equipo técnico para cambios de URL

### 2. Developer.md — Guía para desarrolladores

**Audiencia:** desarrolladores que integran nuevos módulos de Redix con N8N.

Cubrir:
- Cómo agregar un nuevo webhook al sistema (añadir entrada en `webhooks.config.ts`)
- Cómo usar `WebhookResolverService` en cualquier módulo NestJS (`resolve(key)`)
- API REST disponible:
  - `GET /api/webhook-config` — lista todos los webhooks con URL efectiva y fuente (DB/ENV)
  - `PUT /api/webhook-config/:key` — actualizar URL (requiere JWT + rol admin)
  - `DELETE /api/webhook-config/:key` — restaurar a valor por defecto (requiere JWT + rol admin)
- Prioridad de resolución: DB override → variable de entorno → valor por defecto en código
- Cómo el cache se invalida automáticamente al hacer PUT/DELETE (sin reinicio)

### 3. Architect.md — Diseño de arquitectura

**Audiencia:** arquitectos y líderes técnicos.

Cubrir:
- `WebhookConfigModule` marcado como `@Global()` — singleton garantizado en todo el sistema
- `WebhookResolverService`: carga overrides de DB en `Map<string, string>` al arrancar (`onModuleInit`), resolución O(1) en runtime
- Tabla `webhook_override` en PostgreSQL: `key`, `url`, `updated_at`, `updated_by`
- Prioridad de resolución: DB → ENV → default en `webhooks.config.ts`
- Seguridad: `AuthGuard` global en PUT/DELETE, validación de `roleId === 1` en controller
- Por qué `@Global()` elimina la doble instancia y cómo se evitó el problema anterior de pool Prisma

### 4. QA.md — Guía de testing

**Audiencia:** equipo de QA.

Cubrir:
- Cómo acceder al panel: Settings → Integrations → Webhooks N8N
- Casos de prueba:
  1. Actualizar URL de un webhook → verificar que el cambio aplica sin reiniciar la app
  2. Restaurar webhook a valor por defecto → URL vuelve al ENV/default
  3. `PUT /api/webhook-config/:key` sin token JWT → debe retornar 401
  4. `PUT` con token de usuario sin rol admin → debe retornar 403
  5. `PUT` con token de admin → debe retornar 200 y reflejarse en `GET`
  6. El QB Playground usa la URL actualizada sin reinicio
- Errores esperados y sus causas

### 5. Support.md — Guía de soporte y uso

**Audiencia:** administradores de la aplicación y equipo de soporte.

Cubrir:
- Cómo acceder al panel de Webhooks N8N en Redix
- Qué muestra el panel: lista de webhooks agrupados por categoría (Infraestructura, Inventario, Contactos, Ventas, Compras, Bancario), con URL efectiva y badge DB/ENV
- Cómo actualizar una URL: botón Editar → ingresar nueva URL → Guardar
- Qué significa el badge DB vs ENV: DB = valor personalizado activo, ENV = usando valor por defecto del sistema
- Cómo restaurar un webhook a su valor por defecto: botón Restaurar
- Cuándo usar esta función: cuando N8N cambia la URL de un workflow, cuando se migra de desarrollo a producción
- Qué NO hacer: no eliminar URLs activas sin coordinar con el equipo técnico

---

## Entrega esperada de RIQ

Cinco archivos Markdown completos listos para publicar:
1. `Executive.md`
2. `Developer.md`
3. `Architect.md`
4. `QA.md`
5. `Support.md`

> **Importante:** RIQ entrega el contenido Markdown directamente en la respuesta a este PROMPT. SyncBridge actualiza el estado del PROMPT y gestiona el flujo hacia LedgerOps. RIQ **no modifica** archivos ni estados en SyncBridge.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-04 | Emisión | PROMPT emitido a RIQ — generar docs por rol del feature N8N Webhook Administration |
| 2026-04-04 | Entrega RIQ | 5 documentos generados. Nota: RIQ creó los archivos en `SyncBridge/docs/platform/WebhookAdmin/` en lugar de entregarlos como Markdown en la respuesta — el PROMPT no fue suficientemente explícito sobre la forma de entrega. Contenido válido, embebido en PROMPT-LO-024. |
