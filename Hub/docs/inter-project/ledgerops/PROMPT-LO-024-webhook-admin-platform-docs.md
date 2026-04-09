# PROMPT-LO-024 — N8N Webhook Administration · Hospedar documentación por rol

**Fecha:** 2026-04-04
**Tipo:** docs
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-04

## PROMPTs relacionados

- [PROMPT-RIQ-020](../riq/PROMPT-RIQ-020-webhook-admin-docs.md) — RIQ generó el contenido Markdown que este PROMPT publica

---

## Objetivo

Crear los archivos de documentación del feature **N8N Webhook Administration** en el repositorio de LedgerOps bajo `docs/platform/WebhookAdmin/`.

---

## Acción requerida

Crear los siguientes 5 archivos con el contenido que se incluye a continuación:

```
docs/platform/WebhookAdmin/
├── Executive.md
├── Developer.md
├── Architect.md
├── QA.md
└── Support.md
```

> **Importante:** LO crea los archivos en su propio repositorio y confirma a SyncBridge con rutas, commit y URLs de GitHub. LO **no modifica** archivos ni estados en SyncBridge.

---

## Contenido — Executive.md

```markdown
# N8N Webhook Administration — Resumen Ejecutivo

## Qué problema resolvía el modelo anterior

Las URLs de los webhooks N8N que conectan Redix con QuickBooks Desktop estaban definidas directamente en el servidor. Cada vez que una URL cambiaba —por una actualización de N8N, una migración de entorno o un cambio de workflow— un desarrollador debía acceder al servidor, editar archivos de configuración y reiniciar la aplicación. El proceso tomaba entre 15 y 30 minutos y requería coordinación con el equipo técnico.

## Qué se construyó

**Panel de administración visual en Redix** — accesible desde `Configuración → Integraciones → Webhooks N8N`.

Un administrador de la plataforma puede ver, editar y restaurar cualquiera de las 23 URLs de webhooks N8N directamente desde la interfaz, sin tocar código ni el servidor. El cambio se guarda en base de datos y aplica de manera inmediata — sin reinicio de la aplicación.

## Impacto operativo

| Antes | Ahora |
|---|---|
| Cambiar una URL: 15–30 min + desarrollador disponible | Cambiar una URL: < 60 segundos, desde el navegador |
| Requería acceso al servidor y reinicio de la app | Sin acceso al servidor, sin reinicio |
| Sin visibilidad de qué URLs están activas | Panel centralizado con 23 webhooks agrupados por categoría |

## Seguridad

Solo usuarios con rol de **Administrador** pueden modificar configuraciones de webhooks. Los intentos sin autenticación o con un rol menor son rechazados automáticamente.

## Base para el futuro

Este panel es la capa de configuración que permite conectar cualquier módulo comercial de Redix —ventas, compras, inventario, facturación— con QuickBooks Desktop a través de N8N, sin depender del equipo técnico para ajustes de URL. Cuando N8N cambia una URL, el administrador la actualiza en segundos desde Redix.
```

---

## Contenido — Developer.md

```markdown
# N8N Webhook Administration — Guía para Desarrolladores

## Cómo agregar un webhook nuevo al sistema

### 1. Registrar la clave en `webhooks.config.ts`

```typescript
// apps/api/src/common/config/webhooks.config.ts

export interface WebhooksConfig {
  // ...claves existentes...
  MY_NEW_WEBHOOK: string;  // descripción del propósito
}

export const webhooksConfig = registerAs('webhooks', (): WebhooksConfig => {
  const base = process.env['LEDGER_OPS_BASE_URL']!;
  return {
    // ...existentes...
    MY_NEW_WEBHOOK: resolve('MY_NEW_WEBHOOK_URL', `${base}/webhook/mi-ruta`),
  };
});
```

### 2. Agregar la clave al catálogo de `WebhookConfigService`

```typescript
// apps/api/src/modules/webhook-config/webhook-config.service.ts
export const WEBHOOK_KEYS = [
  // ...existentes...
  'MY_NEW_WEBHOOK',
] as const;

const WEBHOOK_DESCRIPTIONS: Record<string, string> = {
  // ...existentes...
  MY_NEW_WEBHOOK: 'Descripción visible en el panel de administración',
};
```

Eso es todo — la nueva clave aparece automáticamente en el panel de administración con su descripción.

---

## Cómo usar `WebhookResolverService` en un módulo NestJS

`WebhookConfigModule` está marcado como `@Global()` — `WebhookResolverService` está disponible en cualquier módulo sin necesidad de importarlo.

```typescript
import { WebhookResolverService } from '../webhook-config/webhook-resolver.service.js';

@Injectable()
export class MyService {
  constructor(private readonly webhookResolver: WebhookResolverService) {}

  async callN8n() {
    const url = this.webhookResolver.resolve('MY_NEW_WEBHOOK');
    const response = await fetch(url, { method: 'POST', ... });
  }
}
```

La resolución sigue este orden de prioridad:
1. **DB override** — si el administrador configuró una URL personalizada en el panel
2. **Variable de entorno** — `MY_NEW_WEBHOOK_URL` en `.env`
3. **Valor por defecto** — el `${base}/webhook/...` definido en `webhooks.config.ts`

---

## API REST

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/webhook-config` | Lista los 23 webhooks con URL efectiva, fuente (db/env) y metadatos | JWT |
| `PUT` | `/api/webhook-config/:key` | Actualiza URL override en DB; invalida cache inmediatamente | JWT + rol admin |
| `DELETE` | `/api/webhook-config/:key` | Elimina override de DB; URL vuelve al valor ENV/default | JWT + rol admin |

### Ejemplo — GET

```json
{
  "success": true,
  "data": [
    {
      "key": "QB_SEDES",
      "description": "Lista de sedes QB Desktop disponibles",
      "effectiveUrl": "https://n8n-production.redsis.ai/webhook/sedes",
      "dbUrl": "https://n8n-production.redsis.ai/webhook/sedes",
      "isActive": true,
      "source": "db",
      "updatedAt": "2026-04-04T10:00:00.000Z",
      "updatedBy": "admin@redsis.com"
    }
  ]
}
```

### Ejemplo — PUT

```bash
curl -X PUT /api/webhook-config/QB_SEDES \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://n8n-production.redsis.ai/webhook/sedes"}'
```

---

## Invalidación del cache

`WebhookResolverService` mantiene un `Map<string, string>` en memoria cargado al arrancar (`onModuleInit`). Al hacer `PUT` o `DELETE`, el service llama a `resolver.invalidate(key, newUrl?)` en el mismo request — el cache se actualiza sin reinicio. La resolución es O(1).
```

---

## Contenido — Architect.md

```markdown
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
```

---

## Contenido — QA.md

```markdown
# N8N Webhook Administration — Guía de Testing

## Acceso al panel

`Redix → Configuración → Integraciones → Webhooks N8N`

---

## Casos de prueba

### TC-01 — Actualizar URL y verificar que aplica sin reinicio

**Precondición:** usuario autenticado con rol Admin.

1. En el panel, localizar `QB_INVENTORY_ITEM_QUERY` (categoría Inventario).
2. Clic en **Editar** → ingresar una URL de prueba → **Guardar**.
3. Verificar que el badge cambia a **DB** y la URL efectiva muestra el nuevo valor.
4. Sin reiniciar la app, abrir QB Playground → seleccionar ItemInventoryQuery → ejecutar.
5. **Resultado esperado:** la solicitud usa la URL nueva (verificable en logs de N8N).

---

### TC-02 — Restaurar webhook a valor por defecto

**Precondición:** TC-01 ejecutado (hay un override activo en `QB_INVENTORY_ITEM_QUERY`).

1. En el panel, clic en **Restaurar** sobre `QB_INVENTORY_ITEM_QUERY`.
2. Verificar que el badge cambia a **ENV** y la URL vuelve al valor original.
3. **Resultado esperado:** `GET /api/webhook-config` retorna `source: "env"` para esa clave.

---

### TC-03 — PUT sin token JWT → 401

```bash
curl -X PUT /api/webhook-config/QB_SEDES \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ejemplo.com/webhook"}'
```

**Resultado esperado:** `401 Unauthorized` — `"Missing token"`.

> Este caso solo aplica en `NODE_ENV=production`. En entorno de desarrollo el AuthGuard bypass está activo.

---

### TC-04 — PUT con usuario sin rol admin → 403

```bash
curl -X PUT /api/webhook-config/QB_SEDES \
  -H "Authorization: Bearer <token-usuario-normal>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ejemplo.com/webhook"}'
```

**Resultado esperado:** `403 Forbidden` — `"Admin role required"`.

---

### TC-05 — PUT con token de admin → 200

```bash
curl -X PUT /api/webhook-config/QB_SEDES \
  -H "Authorization: Bearer <token-admin>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://n8n-production.redsis.ai/webhook/sedes"}'
```

**Resultado esperado:** `200 OK` con la entidad actualizada. `GET /api/webhook-config` refleja el cambio en `QB_SEDES`.

---

### TC-06 — QB Playground usa URL actualizada sin reinicio

**Precondición:** TC-05 ejecutado.

1. Sin reiniciar la app, abrir QB Playground → seleccionar sede TEST → ejecutar una operación.
2. **Resultado esperado:** el Playground usa la URL configurada en TC-05.

---

## Errores esperados y sus causas

| Error | Causa | Solución |
|---|---|---|
| `401 Unauthorized` en PUT/DELETE | Token JWT ausente o expirado | Autenticarse y obtener token válido |
| `403 Forbidden — Admin role required` | Usuario autenticado sin rol admin | Usar cuenta con rol de Administrador |
| `500 Internal Server Error` en GET | Base de datos no accesible | Verificar conexión a PostgreSQL |
| URL efectiva no cambia tras PUT | Cache no invalidado | Verificar que `WebhookConfigModule` es `@Global()` y solo se importa en `AppModule` |
```

---

## Contenido — Support.md

```markdown
# N8N Webhook Administration — Guía de Soporte y Uso

## ¿Qué es esta sección?

El panel de **Webhooks N8N** permite a los administradores de Redix gestionar las URLs de los workflows N8N que conectan la plataforma con QuickBooks Desktop. Cuando N8N cambia la dirección de un workflow, el administrador puede actualizarla aquí en segundos, sin necesidad de contactar al equipo técnico.

---

## Cómo acceder

1. Iniciar sesión en Redix con una cuenta de **Administrador**.
2. Ir a **Configuración** (ícono de engranaje, esquina superior derecha).
3. En el menú lateral, seleccionar **Integraciones → Webhooks N8N**.

---

## Qué muestra el panel

El panel lista los 23 webhooks del sistema agrupados en 7 categorías:

| Categoría | Webhooks incluidos |
|---|---|
| Infraestructura | URL base de LedgerOps, Sedes, Contratos |
| Inventario | Alta, modificación y consulta de ítems |
| Contactos — Cliente | Alta, modificación y consulta de clientes |
| Contactos — Proveedor | Alta, modificación y consulta de proveedores |
| Ventas | Órdenes de venta (Add/Mod/Query), Facturas |
| Compras | Órdenes de compra y facturas de proveedor (Add/Mod/Query) |
| Bancario | Cargo de tarjeta de crédito |

Cada webhook muestra:
- **Clave** — nombre técnico (ej. `QB_SEDES`)
- **Descripción** — propósito en lenguaje natural
- **URL efectiva** — la dirección que usa el sistema en este momento
- **Badge DB / ENV** — indica si la URL es un valor personalizado (DB) o el valor por defecto del sistema (ENV)

---

## Cómo actualizar una URL

1. Localizar el webhook en la lista.
2. Clic en **Editar**.
3. Ingresar la nueva URL en el campo de texto.
4. Clic en **Guardar** (o presionar `Enter`).

El cambio aplica **de inmediato** — no es necesario reiniciar la aplicación ni contactar al equipo técnico.

---

## Qué significa el badge DB vs ENV

| Badge | Significado |
|---|---|
| **DB** (violeta) | La URL fue personalizada por un administrador y está guardada en la base de datos. Esta URL tiene prioridad sobre cualquier configuración del servidor. |
| **ENV** (gris) | El sistema usa el valor por defecto definido en el servidor. No hay personalización activa. |

---

## Cómo restaurar un webhook a su valor por defecto

Si una URL fue personalizada (badge **DB**) y se necesita volver al valor original del sistema:

1. Localizar el webhook en la lista.
2. Clic en **Restaurar**.
3. El badge cambia a **ENV** y la URL vuelve al valor del servidor.

---

## Cuándo usar esta función

- **N8N actualizó la URL de un workflow** — actualizar la entrada correspondiente en el panel.
- **Migración de entorno** — al pasar de desarrollo a producción, actualizar las URLs base a las de producción.
- **Pruebas** — apuntar temporalmente un webhook a un entorno de staging sin afectar la configuración del servidor.

---

## Qué NO hacer

- **No restaurar URLs activas sin coordinar con el equipo técnico** — restaurar un webhook a ENV puede romper integraciones si el valor del servidor ya no es válido.
- **No compartir tokens de administrador** — cada cambio queda registrado con el email del usuario que lo realizó (`updatedBy`).
- **No modificar `QB_LEDGER_OPS_BASE` sin verificar** — esta URL es la base de todas las rutas relativas; cambiarla afecta todos los webhooks que no tengan override individual.
```

---

## Verificación

Confirmar a SyncBridge:

1. Rutas de los 5 archivos creados en el repo de LedgerOps
2. Commit y rama donde fueron aplicados
3. URLs directas a los 5 archivos en GitHub

> **Importante:** LO crea los archivos en su propio repositorio y confirma aquí. LO **no modifica** archivos ni estados en SyncBridge.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-04 | Emisión | PROMPT emitido a LedgerOps — crear `docs/platform/WebhookAdmin/` con 5 docs por rol |
| 2026-04-04 | Contenido embebido | Contenido de RIQ incorporado — 5 documentos listos para publicar |
| 2026-04-04 | Resolución | 5 archivos creados en `docs/platform/WebhookAdmin/` — commit 3b8ba78 |
