# QB Playground Templates — Resumen Ejecutivo

## Qué problema resuelve

El QB Playground mostraba hasta 32 campos por operación, la mayoría irrelevantes para el flujo
diario de trabajo. Los usuarios debían identificar manualmente qué campos llenar en cada
transacción, aumentando el tiempo de operación y el riesgo de errores.

## Qué se construyó

Un sistema de **templates de campos** para el QB Playground. Un administrador define, por
operación y sede, qué campos aparecen en el formulario. Los usuarios ven únicamente los campos
relevantes para su trabajo — el resto queda oculto pero disponible si lo necesitan.

## Impacto

- El formulario pasa de hasta 32 campos a solo los necesarios para esa operación
- Cada usuario puede elegir qué template usar y el sistema recuerda su preferencia
- Un administrador puede crear o modificar templates en segundos sin tocar código
- El cambio aplica de inmediato — sin reinicio de la aplicación

## Seguridad

La creación, edición y eliminación de templates requiere cuenta de Administrador.
Los usuarios estándar solo pueden seleccionar el template que desean usar.

## Base para

Estandarizar los flujos de alta de ítems, clientes, proveedores y órdenes de venta en QB
Desktop sin depender del equipo técnico para ajustar qué campos se presentan en cada sede.
