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
