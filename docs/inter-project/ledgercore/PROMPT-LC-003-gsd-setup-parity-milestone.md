# PROMPT-LC-003 — GSD Setup + Milestone de paridad con LedgerBridge

**Fecha:** 2026-04-06
**Tipo:** setup + planning
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-06

## PROMPTs relacionados

- [PROMPT-LC-001](PROMPT-LC-001-setup-environment.md) — setup del entorno donde LC ya está operativo
- [PROMPT-LC-002](PROMPT-LC-002-templates-status-and-api.md) — templates ya implementados (no repetir en el milestone)
- [PROMPT-LB-022](../ledgerbridge/PROMPT-022-service-catalog.md) — catálogo completo de servicios de LedgerBridge — contrato de paridad que LC debe cumplir

---

## Contexto

LC debe reemplazar completamente a LedgerBridge. Si el servidor de LB desapareciera mañana, LC debe poder tomar su lugar sin que ningún servicio del ecosistema deje de funcionar.

Para gestionar la ejecución autónoma de ese trabajo, LC instalará **GSD (Get Shit Done)** — un sistema de meta-prompting y context engineering que permite a Claude Code trabajar durante períodos largos sin perder el contexto del proyecto.

Este PROMPT cubre dos cosas en paralelo:
1. Instalar y configurar GSD en el repo de LC
2. Usar GSD para planificar el milestone de paridad con LedgerBridge

---

## ⚠️ Antes de ejecutar

Entregar a SyncBridge el **plan generado por GSD** (Slices + Tasks). No ejecutar `/gsd:execute-phase` hasta recibir aprobación.

---

## Paso 1 — Instalar GSD

En la sesión de Claude Code del repo LedgerCore, ejecutar:

```bash
npx get-shit-done-cc --claude --local
```

Esto instala GSD en el proyecto bajo `.claude/commands/` y crea `.planning/config.json`.

---

## Paso 2 — Inicializar el proyecto en GSD

Una vez instalado, ejecutar en Claude Code:

```
/gsd:new-project
```

Cuando GSD haga preguntas, responder con este contexto:

- **Nombre del proyecto:** LedgerCore
- **Descripción:** API NestJS que reemplaza LedgerBridge — reimplementa todos sus servicios sobre PostgreSQL multi-tenant en lugar de archivos de servidor
- **Stack:** NestJS · PostgreSQL · Prisma · TypeScript
- **Objetivo del primer milestone:** Paridad completa con LedgerBridge — todos los servicios del catálogo (PROMPT-LB-022) implementados como endpoints REST en LC

---

## Paso 3 — Definir el Milestone de paridad

Ejecutar:

```
/gsd:discuss-phase 1
```

El milestone debe cubrir las siguientes categorías de servicios según el catálogo LB-022:

| Slice | Categoría | Descripción |
|---|---|---|
| 1 | Gestión de XML | Registro, consulta y administración de XMLs por tipo y versión |
| 2 | Gestión de sedes | Crear, listar y configurar sedes con versión QB asociada |
| 3 | Business rules | Leer, escribir y reemplazar reglas de negocio por tipo y sede |
| 4 | Contratos | Generación dinámica `requiredByIntuit` + `requiredBySede` |
| 5 | Describe / Schema | Introspección de campos por tipo y versión QB |

> Templates (`GET /api/templates`) ya está implementado en LC-002 — **no incluir en el milestone**.

Cada categoría = un Slice. Cada endpoint del catálogo LB-022 = una Task.

---

## Respuesta esperada de LC

**Primera entrega — antes de ejecutar:**
1. Confirmar que GSD quedó instalado
2. Compartir el contenido de `.planning/config.json`
3. Compartir el plan generado por GSD — Milestone 1 con Slices y Tasks
4. Indicar cualquier bloqueo antes de ejecutar

**Segunda entrega — tras aprobación de SyncBridge:**
1. Resultado de `/gsd:execute-phase 1`
2. Endpoints implementados con ejemplos de request/response
3. Resultado de `/gsd:verify-work 1`

---

## Primera entrega — LC · 2026-04-06

**GSD v1.32.0 instalado** — 60 skills en `.claude/skills/`, hooks configurados (context-monitor, prompt-guard, read-guard, update-check). Config: modo interactivo, 3 agentes concurrentes, gates activos.

**Plan — Milestone 1: 5 Slices · 15 Tasks**

| Slice | Módulo | Tasks | Endpoints | Prioridad |
|---|---|---|---|---|
| 1 | XML Catalog | T1.1–T1.3 | `GET /types` · `GET /describe` · `POST /xml` | P1 |
| 2 | Sedes CRUD | T2.1–T2.5 | `GET/POST/PATCH/DELETE /sedes` | P2–P3 |
| 3 | Business Rules | T3.1–T3.5 | `GET /rules` · `/add` · `/replace` · `/remove` · `/discover` | P2–P3 |
| 4 | Contracts | T4.1–T4.2 | `POST /contracts` · `POST /contracts/validate` | **P0** |
| 5 | XML Build | T5.1 | `POST /xml/build` | **P0** |

Orden: P0 (T4.1 + T5.1) → P1 (T4.2 + T1.x) → P2 (T2.1–2.2 + T3.1) → P3 (CRUD completo)

T5.1: port de `lb-xml-build.py` (379 líneas Python) a TypeScript — orden de tags via `qbxml_field.ordinal` de la DB. Validación condicional documentada y correcta.

## Aprobación SyncBridge · 2026-04-06

✅ Plan aprobado sin cambios.

**Orden de entrega: P0 → P1 → P2 → P3** — cada grupo se entrega, se verifica con SyncBridge y se aprueba antes de continuar al siguiente. No entregar todo junto al final.

**Proceder con `/gsd:execute-phase 1` comenzando por P0 (T4.1 Contracts + T5.1 XML Build).**

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-06 | Emisión | PROMPT emitido a LedgerCore — instalar GSD y planificar milestone de paridad con LedgerBridge |
| 2026-04-06 | Primera entrega | GSD v1.32.0 instalado · Plan 5 Slices / 15 Tasks entregado · commit 9301464 |
| 2026-04-06 | Aprobación SyncBridge | Plan aprobado · orden P0→P1→P2→P3 confirmado · luz verde para ejecutar P0 |
| 2026-04-06 | P0 aprobado | T4.1 Contracts + T4.2 validate + T5.1 XML Build — paridad exacta con LB verificada |
| 2026-04-06 | P1 aprobado | T1.1 Types + T1.2 Describe + T1.3 XML Catalog — XML Catalog completo |
| 2026-04-06 | P2 aprobado | T2.1/T2.2 Sedes read + T3.1 Rules GET — resolve_version() consistente |
| 2026-04-06 | P3 aprobado | T2.3–T2.5 Sedes CRUD + T3.2–T3.5 Rules write — CRUD completo + batch UPDATE |
| 2026-04-06 | Cierre formal | 15/15 tasks · 5/5 slices · 19 endpoints en main · HEAD 88463c6 · PROMPT cerrado |
