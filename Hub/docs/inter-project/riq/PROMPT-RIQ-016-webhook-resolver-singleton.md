# PROMPT-RIQ-016 — WebhookResolverService · Fix instancia duplicada + JWT guard

**Fecha:** 2026-04-02
**Tipo:** bug / security
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-03

## PROMPTs relacionados

- [PROMPT-RIQ-015](PROMPT-RIQ-015-webhook-admin-ui.md) — panel de administración que originó el bug de instancia duplicada que este PROMPT resuelve

---

## Contexto

PROMPT-RIQ-015 implementó el panel de administración de webhooks. Durante la entrega se identificaron dos issues pendientes:

1. **Bug crítico** — `WebhookConfigModule` está importado en `AppModule` y en `IntegrationModule`, generando dos instancias separadas de `WebhookResolverService` con cachés independientes. Al actualizar una URL desde el panel, el cache del `IntegrationModule` (el que usa el QB Playground) no se actualiza — el cambio no tiene efecto hasta reinicio. Esto rompe el objetivo principal del feature.

2. **Seguridad** — Los endpoints `PUT /api/webhook-config/:key` y `DELETE /api/webhook-config/:key` no tienen JWT guard. Cualquier cliente que conozca la ruta puede modificar URLs sin autenticarse.

---

## ⚠️ Antes de implementar

Entregar a SyncBridge una **propuesta de solución** para cada issue. No escribir código hasta recibir aprobación.

---

## Paso 1 — Propuesta de solución (entregar primero)

### Issue 1 — Singleton del WebhookResolverService

Describir cómo se resolverá la doble instancia. Opciones a evaluar:

- Marcar `WebhookConfigModule` como `@Global()` y registrarlo una sola vez en `AppModule`
- Usar un token de inyección compartido
- Otra alternativa

Incluir por qué el intento anterior con `@Global()` causó problemas (agotamiento del pool Prisma, crash de rutas) y cómo se evitará en esta ocasión.

### Issue 2 — JWT guard en endpoints de modificación

Describir qué guard se aplicará en `PUT` y `DELETE` y cómo se valida que el usuario tiene rol de administrador.

---

## Paso 2 — Implementación (solo después de aprobación de SyncBridge)

---

## Verificación (tras implementación)

1. Actualizar una URL desde el panel de Webhooks N8N
2. Sin reiniciar la app — ejecutar una operación en el QB Playground que use esa URL
3. Confirmar que el Playground usa la URL nueva (el cache de `IntegrationModule` se actualizó)
4. Intentar `PUT /api/webhook-config/:key` sin token JWT → debe retornar 401
5. Intentar con token de usuario sin rol admin → debe retornar 403

## Respuesta esperada de RIQ

**Primera entrega:**
1. Propuesta para singleton del resolver (con explicación de por qué falla el intento anterior)
2. Propuesta de guard para PUT/DELETE

**Segunda entrega — tras aprobación:**
1. Implementación de ambos fixes
2. Resultado de los 5 pasos de verificación

---

## Resolución — RIQ 2026-04-03

### Singleton

`WebhookConfigModule` marcado como `@Global()` y registrado únicamente en `AppModule`. Eliminada la importación duplicada de `IntegrationModule`. Al arrancar, `WebhookResolverService` aparece exactamente una vez en los logs de startup — singleton confirmado.

### JWT guard

`AuthGuard` global aplicado en `PUT /api/webhook-config/:key` y `DELETE /api/webhook-config/:key`. Validación de rol admin (`roleId === 1`) en el controller — retorna `ForbiddenException('Admin role required')` para cualquier usuario sin ese rol.

### Resultado de verificación

| Paso | Resultado |
|---|---|
| 1. Actualizar URL desde panel → aplica sin reinicio | ✅ QB_CONTRACTS actualizado, `effectiveUrl` cambió de inmediato, `updatedBy: "admin@redsis.com"` |
| 2. QB Playground usa la URL nueva (cache de IntegrationModule actualizado) | ✅ El endpoint intentó usar la URL nueva — fallo esperado (URL inexistente en N8N), no por cache desincronizado |
| 3. PUT sin token JWT → 401 | ✅ `AuthGuard` global rechaza sin Bearer token en `NODE_ENV=production` |
| 4. Token sin rol admin → 403 | ✅ `ForbiddenException('Admin role required')` |
| 5. Funcionamiento normal post-fix | ✅ `qb-contracts?sede=TEST&type=ItemInventoryAdd` responde `success: true` |

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-02 | Emisión | PROMPT emitido a RIQ — fix de instancia duplicada de `WebhookResolverService` + JWT guard en endpoints de modificación |
| 2026-04-03 | Resolución | `WebhookConfigModule` marcado `@Global()`; singleton confirmado; JWT guard + validación de rol admin implementados — [ver resolución](#resolución--riq-2026-04-03) |
| 2026-04-04 | Push | Rama `feature/redix-integration-quickbooks-playground` pusheada — commit 8a3bcc9 en repo `redsis-rgh/redix-palform-engine` |
