# PROMPT-RIQ-014 — Sistema de configuración centralizada de Webhooks N8N

**Fecha:** 2026-04-02
**Tipo:** improvement
**Estado:** ✅ solved

---

## Contexto

La integración del QB Playground con LedgerOps está funcionando correctamente. Sin embargo, se identificó que las URLs de los webhooks N8N que consume Redix están embebidas directamente en el código. Esto genera un problema de mantenimiento:

- Si una URL cambia, hay que buscarla en el código para actualizarla
- Con el crecimiento de procesos (QB Desktop ya tiene múltiples operaciones, y habrá más procesos que consuman webhooks N8N), el número de URLs dispersas en el código aumenta
- No hay visibilidad centralizada de qué webhooks consume el sistema y para qué sirven

---

## Requerimiento

Implementar un **sistema de configuración centralizada** para todas las URLs de webhooks N8N que Redix consume — no solo para el QB Playground, sino para cualquier proceso presente o futuro que requiera invocar un webhook de N8N.

### Características requeridas

1. **Centralizado** — todas las URLs en un único lugar. Un solo archivo o módulo de configuración.

2. **Por ambiente** — las URLs pueden diferir entre desarrollo y producción. La configuración debe respetar las variables de entorno del sistema (`NODE_ENV` o equivalente).

3. **Con clave semántica** — cada URL debe tener un nombre descriptivo que indique qué hace, no solo la URL cruda. Ejemplo:
   ```
   QB_PLAYGROUND_EXECUTE  →  https://n8n-development.redsis.ai/webhook/...
   QB_CONTRACTS           →  https://n8n-development.redsis.ai/webhook/contracts
   QB_SEDES               →  https://n8n-development.redsis.ai/webhook/sedes
   ```

4. **Extensible** — cuando se agregue un nuevo proceso que consuma un webhook N8N, solo se añade una entrada a la configuración. Sin tocar código de lógica.

5. **Con validación al inicio** — al levantar la aplicación, verificar que todas las URLs configuradas están definidas. Fallar de forma explícita si falta alguna requerida.

### Alcance

Esta configuración aplica a **todos los procesos de Redix que consuman webhooks N8N** — no solo QB Playground. Cualquier integración futura (otros procesos, otros sistemas) debe usar este mismo mecanismo en lugar de URLs hardcodeadas.

---

## Migración del QB Playground

Como parte de esta tarea, migrar las URLs del QB Playground que actualmente están en el código al nuevo sistema de configuración. El comportamiento debe ser idéntico — solo cambia dónde vive la configuración.

---

## Respuesta esperada de RIQ

Confirmar a SyncBridge:

1. Estructura del sistema de configuración implementado (archivo/módulo donde viven las URLs)
2. Mecanismo de separación por ambiente
3. Listado de webhooks migrados (claves + URLs)
4. Cómo se agrega una nueva URL cuando se requiera un nuevo proceso

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-02 | Emisión | PROMPT emitido a RIQ — sistema de configuración centralizada de URLs de webhooks N8N |
| 2026-04-02 | Resolución | `webhooks.config.ts` implementado con claves semánticas, separación por ambiente y validación al inicio |
