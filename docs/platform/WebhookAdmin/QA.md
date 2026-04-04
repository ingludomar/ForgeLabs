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
| URL efectiva no cambia tras PUT | Cache no invalidado (no debería ocurrir con singleton) | Verificar que `WebhookConfigModule` es `@Global()` y solo se importa en `AppModule` |
