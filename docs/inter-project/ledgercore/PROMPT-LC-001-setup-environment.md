# PROMPT-LC-001 — Setup · Entorno y herramientas

**Fecha:** 2026-04-01
**Tipo:** setup
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-LB-020](../ledgerbridge/PROMPT-020-postgresql-architecture.md) — diseño de arquitectura PostgreSQL entregado por LedgerBridge que este PROMPT implementa
- [PROMPT-LB-021](../ledgerbridge/PROMPT-021-ledgercore-phase1-delivery.md) — artefactos de Fase 1 en el repo que este PROMPT debe activar
- [PROMPT-LB-022](../ledgerbridge/PROMPT-022-service-catalog.md) — catálogo de servicios que LedgerCore debe replicar como contrato de paridad

---

## Contexto

**LedgerCore (LC)** es un nuevo proyecto del ecosistema SyncBridge. Es la evolución de LedgerBridge como producto multi-empresa, basado en PostgreSQL en lugar de archivos de servidor.

LC no modifica LedgerBridge — opera en paralelo como proyecto independiente.

**Repo:** `/Users/luisdominguez/Documents/GitHub/LedgerCore`

La Fase 1 (schema + scripts de seed) ya fue entregada por LedgerBridge y está en:
`docs/architecture/ledgercore/` (SCHEMA.sql · seed_catalog.py · seed_templates.py · DELIVERY.md)

---

## Metodología de trabajo

SyncBridge (SB) guía a LC mediante PROMPTs. LC analiza, ejecuta y reporta. SB da la palabra final antes de avanzar a la siguiente fase.

LC no toma decisiones de arquitectura de forma autónoma — consulta a SB ante cualquier decisión no trivial.

---

## Requerimiento — Setup completo del entorno

Antes de iniciar cualquier implementación, LC debe tener operativas todas las herramientas necesarias. Este PROMPT cubre ese setup inicial.

### 1. Base de datos PostgreSQL

Existe una instancia de PostgreSQL corriendo en Docker localmente.

LC debe:
1. Conectarse a la instancia Docker
2. Crear la base de datos `ledgercore`
3. Aplicar el schema: `psql ledgercore < docs/architecture/ledgercore/SCHEMA.sql`
4. Verificar que las tablas y vistas quedaron correctas con las queries de verificación del DELIVERY.md (§5)

### 2. MCP de PostgreSQL

Para que SyncBridge pueda interactuar directamente con la DB de LC (consultar tablas, verificar seeds, validar datos), LC debe configurar un **MCP de PostgreSQL** en el proyecto.

Investigar e implementar un MCP que permita:
- Ejecutar queries SELECT sobre las tablas de LC
- Verificar el estado de la DB en tiempo real

Sugerencia de punto de partida: `@modelcontextprotocol/server-postgres` (paquete oficial MCP para PostgreSQL).

Estructura sugerida en el repo:
```
LedgerCore/
└── mcp/
    └── postgres/
        ├── package.json
        ├── .env          ← DSN de conexión (no commitear)
        └── ...
```

### 3. MCP de N8N

LC eventualmente expondrá sus operaciones como webhooks N8N (igual que LedgerBridge hoy). SyncBridge ya tiene un MCP de N8N funcional en:

`/Users/luisdominguez/Documents/GitHub/SyncBridge/mcp/n8n/`

LC puede referenciar ese MCP o instalarlo en su propio repo. SB lo usará para crear y activar workflows de LC en N8N cuando llegue el momento.

### 4. Stack tecnológico del API

LC necesita definir el stack con el que construirá su API (el motor que reemplaza los scripts de LedgerBridge):

Opciones a evaluar:
- **NestJS** — consistente con el ecosistema (RIQ usa NestJS)
- **FastAPI (Python)** — consistente con los scripts de seed (ya en Python)
- **Express** — más ligero si el scope es solo API

LC debe proponer el stack con justificación y esperar aprobación de SB antes de proceder.

---

## Respuesta esperada de LC

Confirmar a SyncBridge:

1. **DB operativa** — resultado de las queries de verificación (conteos de tablas)
2. **MCP PostgreSQL** — configurado y funcional (SB debe poder conectarse)
3. **MCP N8N** — referenciado o instalado
4. **Propuesta de stack** — tecnología elegida para el API con justificación
5. **Preguntas o bloqueos** — cualquier punto que requiera decisión de SB antes de continuar

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-01 | Emisión | PROMPT emitido a LedgerCore — setup completo del entorno (PostgreSQL, MCP, stack tecnológico) |
| 2026-04-01 | Resolución | Entorno configurado; DB operativa, MCP PostgreSQL y N8N referenciados, propuesta de stack entregada |
