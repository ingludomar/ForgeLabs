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
