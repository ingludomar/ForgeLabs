# PROMPT-LO-034 — Invoice · Publicar 6 docs en docs/qb-playground/

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | docs |
| **Estado** | ✅ solved |

---

## Contexto

Testing de Invoice QB Playground completado (PROMPT-RIQ-026). Los 6 archivos de documentación
ya están escritos en `docs/qb-playground/`. Confirmar y hacer commit.

---

## Archivos a commitear

Los siguientes 6 archivos ya existen en `docs/qb-playground/`:

| Archivo | Audiencia |
|---------|-----------|
| `Invoice.md` | Usuario final |
| `Invoice-executive.md` | Ejecutivo / Dirección |
| `Invoice-developer.md` | Desarrollador |
| `Invoice-architect.md` | Arquitecto |
| `Invoice-qa.md` | QA |
| `Invoice-support.md` | Soporte |

---

## Smoke tests verificados

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| InvoiceQuery | ✅ | ✅ | ✅ | ✅ | ✅ |
| InvoiceAdd | ✅ | — | — | — | — |
| InvoiceMod | ✅ | — | — | — | — |

**Datos de referencia TEST:**
- CustomerRef: `80000490-1719324164` (A TCN S.A de C.V · USD)
- ItemRef: `80000026-1597198891` (#2 CLEAR)
- TxnID creado: `626CC-1775750031`
- Campos requeridos por sede TEST en Add: `DueDate`, `IsFinanceCharge`, `IsPending`, `IsToBeEmailed`, `IsToBePrinted`
- Campos requeridos por sede TEST en Mod: `DueDate`

---

## Acción requerida

Hacer commit de los 6 archivos en `docs/qb-playground/`.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | Docs generados tras testing Invoice — 6 archivos listos para commit |
