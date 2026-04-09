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
