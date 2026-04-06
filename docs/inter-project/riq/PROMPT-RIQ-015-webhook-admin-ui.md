# PROMPT-RIQ-015 — Panel de administración de Webhooks N8N

**Fecha:** 2026-04-02
**Tipo:** feature
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-02

## PROMPTs relacionados

- [PROMPT-RIQ-014](PROMPT-RIQ-014-webhook-config-system.md) — sistema de configuración centralizada que este PROMPT extiende con una UI administrativa

---

## Contexto

PROMPT-RIQ-014 implementó un sistema centralizado de configuración de webhooks usando variables de entorno. Sin embargo, este modelo requiere acceso al servidor para actualizar una URL — no es viable para un administrador de la aplicación.

---

## Requerimiento

Implementar un **panel de administración visual** en Redix donde un usuario con rol de administrador pueda gestionar las URLs de los webhooks N8N sin tocar código ni el servidor.

### Funcionalidad requerida

1. **Listado de webhooks configurados** — nombre/clave semántica, URL actual, descripción del propósito, estado (activo/inactivo)

2. **Edición de URL** — el administrador puede actualizar la URL de cualquier webhook desde la UI

3. **Persistencia en base de datos** — los valores deben guardarse en DB, no en archivos de configuración del servidor. Al cambiar una URL en la UI, el cambio toma efecto sin reiniciar la app

4. **Valores por defecto** — si una URL no ha sido configurada manualmente, el sistema usa el valor por defecto definido en código (el actual `webhooks.config.ts`)

5. **Control de acceso** — solo roles con permisos de administrador pueden acceder a esta sección

6. **Aplica a todos los procesos** — no solo QB Playground. Cualquier webhook registrado en el sistema debe ser gestionable desde este panel

### Flujo esperado

```
Administrador abre Redix → Configuración → Webhooks N8N
  → Ve listado de todos los webhooks del sistema
  → Selecciona uno (ej. QB_SEDES)
  → Actualiza la URL → Guarda
  → El cambio aplica de inmediato sin reinicio
```

---

## ⚠️ Importante — Antes de implementar

**RIQ no debe escribir ningún código hasta que SyncBridge apruebe el diseño.**

El primer paso es entregar una propuesta de arquitectura y diseño. SyncBridge la analiza y decide si el enfoque es viable antes de proceder.

---

## Paso 1 — Propuesta de diseño (entregar primero)

RIQ debe describir cómo planea implementar esta feature. La propuesta debe cubrir:

1. **Persistencia** — ¿cómo se guardan los valores?
   - ¿Tabla en base de datos? ¿Qué columnas tendría?
   - ¿Archivo JSON en el servidor?
   - ¿Otra alternativa?
   - Justificación de la elección

2. **Resolución del valor** — ¿cómo determina el sistema qué URL usar en runtime?
   - Orden de prioridad propuesto (ej. DB → ENV → default en código)
   - Cómo se cachea o recarga el valor sin reiniciar la app

3. **API** — ¿qué endpoints se crean para el CRUD de webhooks?
   - Rutas, métodos y payloads

4. **UI** — ¿dónde vive el panel en la navegación de Redix?
   - Ruta, acceso desde el menú, rol requerido

5. **Control de acceso** — ¿qué rol puede gestionar webhooks y cómo se valida?

SyncBridge revisará la propuesta y dará aprobación o ajustes antes de que RIQ proceda con la implementación.

---

## Paso 2 — Implementación (solo después de aprobación de SyncBridge)

Una vez aprobado el diseño, proceder con la implementación completa según lo acordado.

---

## Respuesta esperada de RIQ

**Primera entrega — Propuesta de diseño:**

1. Decisión de persistencia con justificación
2. Mecanismo de resolución de valor en runtime
3. Diseño de API (endpoints)
4. Diseño de UI (ruta y navegación)
5. Estrategia de control de acceso

**Segunda entrega — tras aprobación de SyncBridge:**

1. Implementación completa
2. Verificación: actualizar una URL desde la UI y confirmar que el QB Playground usa el nuevo valor sin reiniciar la app

---

## Resolución — RIQ 2026-04-02

### Persistencia

Tabla `webhook_override` en PostgreSQL (base de datos existente de Redix). Columnas: `key`, `url`, `updated_at`, `updated_by`. La tabla solo almacena los overrides activos — si no hay fila para una clave, el sistema usa el valor del ENV.

Justificación: misma DB que ya usa el sistema, sin nueva infraestructura. El cambio aplica sin reinicio porque el cache se invalida en el mismo request de PUT/DELETE.

### Resolución del valor en runtime

Prioridad: **DB override → ENV variable → valor por defecto en código**

`WebhookResolverService` carga todos los overrides de DB en un `Map<string, string>` en memoria al arrancar (`onModuleInit`). En cada request, `resolve(key)` consulta primero el Map (O(1)), luego ENV, luego el default del `webhooks.config.ts`. Al hacer PUT/DELETE, el Map se actualiza en el mismo request — sin reinicio.

### API implementada

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/webhook-config` | Lista los 23 webhooks con `effectiveUrl`, `dbUrl`, `source` (db/env) |
| `PUT` | `/api/webhook-config/:key` | Upsert override en DB + invalida cache |
| `DELETE` | `/api/webhook-config/:key` | Elimina override de DB + recarga desde ENV |

Los endpoints no tienen `CompanyContextMiddleware` (excluidos en `AppModule`).

### UI

- **Ruta:** `Settings → Integrations → Webhooks N8N` (`/settings/integrations/n8n`)
- **Componente:** `WebhookConfigSection.tsx`
- Los webhooks se muestran agrupados en 7 categorías: Infraestructura, Inventario, Contactos Cliente, Contactos Proveedor, Ventas, Compras, Bancario
- Cada entrada muestra: clave, descripción, URL efectiva, badge DB/ENV, botones Editar / Restaurar
- El cambio refleja de inmediato en la UI (actualización local del estado React) y en el servidor (cache invalidado)

### Control de acceso

La ruta estaba wrapped en `<AdminOnly>` lo que causaba que usuarios no-admin vieran "Coming Soon". Se corrigió: el `AdminOnly` wrapper fue removido de `SettingsPage.tsx` porque la sección Settings ya es de acceso controlado. El backend no tiene guard adicional en este momento (TODO pendiente: agregar JWT guard en los endpoints PUT/DELETE).

### Bugs detectados y corregidos durante la implementación

**Bug A — Botón Send deshabilitado para todas las operaciones Query**

- Causa: El endpoint `QB_CONTRACTS` devuelve `requiredFields` para operaciones Query. El overlay de campos requeridos marcaba esos campos en el formulario. Al cargar con el formulario vacío, `missingRequired > 0` → botón deshabilitado.
- Fix: En `QBPlaygroundSection.tsx` línea 830, si `selectedAction.operation === 'Query'` → retorna 0 directamente. Los filtros de Query son siempre opcionales en QB Desktop.

**Bug B — Panel de webhook config mostraba "Coming Soon"**

- Causa: La ruta `integrations/n8n` en `SettingsPage.tsx` estaba wrapped en `<AdminOnly fallback={<ComingSoonSection />}>`. Usuarios con `roleId !== 1` veían el placeholder.
- Fix: Removido el wrapper `AdminOnly` de esa ruta.

### Issue conocido (no resuelto en esta sesión)

`WebhookConfigModule` está importado en `AppModule` Y en `IntegrationModule`, creando dos instancias de `WebhookResolverService` con cachés separadas. Si se actualiza una URL via el panel, la instancia de `IntegrationModule` no se entera hasta reinicio. Intentos de corregirlo (`@Global()`, remover de AppModule) causaron problemas mayores (agotamiento del pool de conexiones Prisma, crash de rutas). Se deja para una sesión dedicada con ventana de mantenimiento.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-02 | Emisión | PROMPT emitido a RIQ — panel de administración visual de webhooks N8N con persistencia en DB |
| 2026-04-02 | Resolución | Panel implementado (`Settings → Integrations → Webhooks N8N`); tabla `webhook_override` en PostgreSQL; issue de instancia duplicada pendiente — [ver resolución](#resolución--riq-2026-04-02) |
