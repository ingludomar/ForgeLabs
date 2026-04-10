# PROMPT-LO-033 — Estándar de contrato `data` en workflows Query

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | standard + fix |
| **Estado** | ✅ solved |

---

## Contexto

Durante el desarrollo del workflow `[Sales] LedgerOps — Invoice Query` se detectó un bug en el nodo `Code — Validate Type` que generaba XML malformado en QB Desktop. El análisis reveló que el bug existía porque el workflow nuevo usaba un formato de `data` diferente al que usa el resto del ecosistema — un contrato implícito que nunca fue documentado.

**El patrón correcto — confirmado en todas las entidades entregadas:**

```json
{
  "type": "VendorQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": { "MaxReturned": "1" }
}
```

`data` contiene los **campos directamente**, sin wrapper de tipo.

**El patrón incorrecto — usado en Invoice Query (bug):**

```json
{
  "type": "InvoiceQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": { "InvoiceQuery": { "MaxReturned": "1" } }
}
```

`data` envuelto en un key con el nombre del tipo — genera doble anidamiento.

---

## Causa técnica

En `Code — Validate Type`, la línea:

```javascript
data: { [objectName]: body.data || {} }
```

Con `body.data = { "InvoiceQuery": { "MaxReturned": "1" } }` produce:

```json
{ "InvoiceQueryRq": { "InvoiceQuery": { "MaxReturned": "1" } } }
```

LedgerBridge construye literalmente el XML — genera un tag extra `<InvoiceQuery>` que QB rechaza.

---

## Acciones requeridas

### 1 — Fix inmediato: `[Sales] LedgerOps — Invoice Query`

En el nodo `Code — Validate Type`, corregir la línea de `data`:

**Antes (bug):**
```javascript
data: { [objectName]: body.data || {} }
```

**Después (fix):**
```javascript
data: { [objectName]: body.data[type] || body.data || {} }
```

`body.data[type]` extrae `body.data["InvoiceQuery"]` → `{ "MaxReturned": "1" }` sin el wrapper.

### 2 — Verificación: auditar todos los workflows Query

Revisar el nodo `Code — Validate Type` de todos los workflows Query existentes y confirmar que usan el patrón correcto.

Workflows a revisar:
- `[Contacts] LedgerOps — Customer Query`
- `[Contacts] LedgerOps — Vendor Query`
- `[Inventory] LedgerOps — Item Inventory Query`
- `[Inventory] LedgerOps — Item Non Inventory Query`
- `[Inventory] LedgerOps — Item Service Query`
- `[Sales] LedgerOps — Sales Order Query`
- `[Purchasing] LedgerOps — Purchase Order Query`
- `[Sales] LedgerOps — Invoice Query` ← fix requerido
- `[Purchasing] LedgerOps — Bill Query`
- Cualquier otro workflow Query existente

### 3 — Documentar el estándar

Agregar en el README de workflows o en un archivo `STANDARDS.md` la regla:

> **Contrato de `data` en requests a LedgerOps:**
> El campo `data` siempre contiene los parámetros directamente, sin wrapper de tipo.
> `{ "MaxReturned": "1" }` ✓ — `{ "TypeName": { "MaxReturned": "1" } }` ✗

---

## Verificación

Tras aplicar el fix en Invoice Query:

```bash
POST /webhook/sales/invoice/query
{
  "type": "InvoiceQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": { "MaxReturned": "1" }
}
```

Respuesta esperada: `success: true` con datos reales de Invoice.

---

## Resolución — commit `f746184` · `a5951ba`

Fix aplicado en 5 workflows — auditoría reveló que el bug no era solo de Invoice Query:

| Workflow | N8N ID | Test TEST |
|---|---|---|
| Invoice Query | `L74Bp9vQP2PW2vKy` | ✅ |
| Credit Card Charge Query | `VwL2YQKUzJ3nJ06I` | ✅ |
| Inventory Site Query | `PS5bxjSD2vFlmZ30` | ✅ |
| Transfer Inventory Query | `LCI7zXYd8d8ozcFq` | ✅ |
| Build Assembly Query | `dHr98MHz8RXEw7ID` | ✅ |

Los 5 restantes (Customer, Vendor, Item, Sales Order, Purchase Order Query) no tenían el bug.

6 JSONs guardados en repo — los 5 corregidos más Invoice Query (nuevo).

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | Estándar de contrato `data` — detectado durante debugging de Invoice Query |
| 2026-04-09 | Resolución | Fix aplicado en 5 workflows · auditoría completa · commits `f746184` · `a5951ba` |
