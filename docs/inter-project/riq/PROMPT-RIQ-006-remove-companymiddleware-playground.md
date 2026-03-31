# PROMPT-RIQ-006 — QB Playground · Excluir CompanyContextMiddleware

**Fecha:** 2026-03-30
**Tipo:** bug
**Estado:** ⏳ pending

---

## Problema

Los endpoints del QB Playground fallan con `INTERNAL_ERROR` porque `CompanyContextMiddleware` realiza una consulta a la DB en cada request y el servidor PostgreSQL LAN (`192.168.50.198:5432`) no es accesible desde el contenedor de API.

---

## Causa raíz

El problema no es la conectividad de la DB — es arquitectónico. El QB Playground no necesita contexto de empresa. Es una herramienta de testing que hace proxy a webhooks de LedgerOps. No hay lógica de negocio que requiera identificar a qué empresa pertenece el request.

---

## Acción requerida

Excluir los siguientes endpoints del `CompanyContextMiddleware`:

```
POST /api/integration/qb-playground
GET  /api/integration/qb-sedes
GET  /api/integration/qb-contracts
```

La exclusión se aplica en la configuración del middleware, no modificando los endpoints.

---

## Verificación

Una vez aplicado, re-ejecutar los 15 TCs del PROMPT-RIQ-004 y reportar la tabla de resultados completa a SyncBridge.
