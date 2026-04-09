# PROMPT-LB-022 — Catálogo completo de servicios LedgerBridge

**Fecha:** 2026-04-02
**Tipo:** research
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-LB-021](PROMPT-021-ledgercore-phase1-delivery.md) — entrega de Fase 1 de LedgerCore que establece el contexto de paridad que este catálogo debe garantizar

---

## Contexto

**LedgerCore (LC) es el reemplazo completo de LedgerBridge.**

Si el servidor de LB desapareciera mañana, LC debe poder tomar su lugar sin que ningún servicio del ecosistema deje de funcionar. LC no es una extensión ni un complemento — es LB reimplementado sobre PostgreSQL, con la capacidad adicional de Templates.

Para que LC pueda cubrir el 100% del alcance de LB, SyncBridge necesita un inventario completo y preciso de todos los servicios que LB expone hoy. Este catálogo se convierte en el **contrato de paridad** que LC debe cumplir antes de poder reemplazar a LB.

---

## Requerimiento

Documentar **todos** los servicios que LedgerBridge expone actualmente — sin excepción. Si LC no conoce un servicio, no puede replicarlo. Si no puede replicarlo, no puede reemplazar a LB.

Por cada servicio incluir:

- **Nombre / endpoint**
- **Método HTTP**
- **Qué hace** — descripción en una línea
- **Parámetros de entrada** — qué recibe
- **Respuesta** — qué retorna
- **Ejemplo mínimo** de request/response (opcional pero valioso)

---

## Categorías esperadas

A modo de guía — LB puede agregar o reorganizar según corresponda:

1. **Gestión de XML** — registro, consulta y administración de XMLs crudos por tipo y versión
2. **Gestión de sedes** — crear, listar, configurar sedes y su versión QB asociada
3. **Business rules** — leer, escribir y reemplazar reglas de negocio por tipo y sede
4. **Contratos** — generación de contratos dinámicos (requiredByIntuit + requiredBySede)
5. **Describe / Schema** — introspección de campos por tipo y versión QB
6. **Ejecución QB** — endpoint principal que recibe payload, construye QBXML y lo envía a QB Desktop
7. **Cualquier otro servicio** que LB exponga y no esté en las categorías anteriores

---

## Respuesta esperada de LedgerBridge

Entregar a SyncBridge:

1. Catálogo completo de servicios con el formato descrito — **ningún servicio omitido**
2. Indicar cuáles son internos (solo LedgerOps/LedgerExec) y cuáles públicos
3. Servicios deprecados o en desuso que LC **no** debe replicar
4. Dependencias externas de cada servicio (SSH, COM, filesystem, etc.) que LC deberá resolver de forma diferente al estar en DB

Este catálogo será el **checklist de paridad** que SyncBridge usará para validar que LC está listo para reemplazar a LB.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-02 | Emisión | PROMPT emitido a LedgerBridge — catálogo completo de servicios expuestos como contrato de paridad para LedgerCore |
| 2026-04-02 | Resolución | Catálogo entregado con todos los servicios clasificados por categoría, indicando internos vs públicos y dependencias externas |
