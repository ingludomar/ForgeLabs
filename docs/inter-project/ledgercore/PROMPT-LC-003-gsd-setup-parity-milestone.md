# PROMPT-LC-003 — GSD Setup + Milestone de paridad con LedgerBridge

**Fecha:** 2026-04-06
**Tipo:** setup + planning
**Estado:** ⏳ pending

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

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-06 | Emisión | PROMPT emitido a LedgerCore — instalar GSD y planificar milestone de paridad con LedgerBridge |
