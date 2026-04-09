# N8N Webhook Administration — Diseño de Arquitectura

## Componentes

```
WebhookConfigModule (@Global)
├── WebhookConfigController   — GET / PUT / DELETE /api/webhook-config
├── WebhookConfigService      — lógica de negocio, lista de claves conocidas
├── WebhookConfigRepository   — Prisma → tabla webhook_override
└── WebhookResolverService    — cache en memoria, resolución en runtime
```

---

## WebhookResolverService — singleton garantizado

`WebhookConfigModule` está decorado con `@Global()` y registrado **una sola vez** en `AppModule`. Esto garantiza que toda la aplicación comparte una única instancia de `WebhookResolverService` — y por tanto, un único cache.

**Por qué es crítico:** sin `@Global()`, NestJS crea una instancia separada por cada módulo que importe `WebhookConfigModule`. Con `IntegrationModule` e `AppModule` importándolo por separado, habría dos cachés independientes — actualizar una URL desde el panel solo actualizaría uno de los dos, y el otro seguiría usando la URL anterior hasta reinicio.

**Por qué el intento anterior de `@Global()` falló:** durante el desarrollo, varios reinicios rápidos de la aplicación agotaron el pool de conexiones Prisma (`connection_limit=5`). El problema era el pool, no `@Global()`. La solución fue terminar todas las conexiones idle con `pg_terminate_backend` antes de aplicar el cambio.

---

## Flujo de resolución de URL en runtime

```
webhookResolver.resolve('QB_SEDES')
  │
  ├─ cache.get('QB_SEDES')       → si existe → retorna (O(1))
  │
  └─ configService.getOrThrow('webhooks.QB_SEDES')
       │
       ├─ ENV: QB_SEDES_URL      → si definida → retorna
       └─ default en webhooks.config.ts → retorna
```

---

## Tabla `webhook_override` (schema `utils`)

```sql
CREATE TABLE utils.webhook_override (
  id          BIGSERIAL PRIMARY KEY,
  public_id   UUID UNIQUE DEFAULT gen_random_uuid(),
  key         VARCHAR(100) UNIQUE NOT NULL,
  url         VARCHAR(500) NOT NULL,
  description VARCHAR(255),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  created_by  VARCHAR(100) DEFAULT 'system',
  updated_at  TIMESTAMPTZ NOT NULL,
  updated_by  VARCHAR(100) DEFAULT 'system'
);
```

Solo las filas con `is_active = true` se cargan al cache al arrancar. Un `DELETE` hace `is_active = false` (soft delete) y elimina la entrada del cache en memoria.

---

## Seguridad

- `AuthGuard` registrado como `APP_GUARD` global en `AuthModule` — todas las rutas requieren JWT.
- En `NODE_ENV !== 'production'`, el guard inyecta un usuario de desarrollo (`role: 'admin'`) para facilitar el testing local. En producción, el token se verifica con `jwtService.verify()`.
- Los endpoints `PUT` y `DELETE` verifican explícitamente `req.user.role === 'admin'` y lanzan `ForbiddenException` si no se cumple.
- Los endpoints `GET /api/webhook-config` y los endpoints del Playground están excluidos del `CompanyContextMiddleware` en `AppModule`.

---

## Diagrama de flujo — actualización de URL desde el panel

```
Admin → PUT /api/webhook-config/QB_SEDES {url: "nueva-url"}
  → AuthGuard: verifica JWT
  → Controller: verifica role === 'admin'
  → WebhookConfigService.update()
    → WebhookConfigRepository.upsert() → DB
    → WebhookResolverService.invalidate('QB_SEDES', 'nueva-url') → actualiza cache
  → Response 200

Próxima llamada al Playground que usa QB_SEDES:
  → WebhookResolverService.resolve('QB_SEDES')
  → cache.get('QB_SEDES') → 'nueva-url'  ✅ sin reinicio
```
