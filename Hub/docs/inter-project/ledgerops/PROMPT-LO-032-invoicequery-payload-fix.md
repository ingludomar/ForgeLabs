# PROMPT-LO-032 — Fix payload InvoiceQuery · nodo Code — Validate

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | bug |
| **Estado** | ⏳ pending |

---

## Contexto

El workflow `[Sales] LedgerOps — Invoice Query` construye el payload hacia LedgerExec de forma incorrecta. El nodo `Code — Validate Type` envuelve `body.data` completo dentro de `[objectName]`, generando una capa extra que LedgerBridge convierte en un tag XML inválido.

**Código actual (bug):**
```javascript
const objectName = type + 'Rq'; // → "InvoiceQueryRq"
return [{ json: { ok: true, payload: {
  type, sede, version,
  object: objectName,
  data: { [objectName]: body.data || {} }  // ← bug
}}}];
```

`body.data` llega como:
```json
{ "InvoiceQuery": { "MaxReturned": "1" } }
```

Queda como:
```json
{ "InvoiceQueryRq": { "InvoiceQuery": { "MaxReturned": "1" } } }
```

LedgerBridge construye literalmente el XML:
```xml
<InvoiceQueryRq>
  <InvoiceQuery>           ← tag extra — QB lo rechaza
    <MaxReturned>1</MaxReturned>
  </InvoiceQuery>
</InvoiceQueryRq>
```

QB Desktop devuelve: `QB found an error when parsing the provided XML text stream`

---

## Fix requerido

En el nodo `Code — Validate Type` del workflow `[Sales] LedgerOps — Invoice Query`, cambiar la línea que construye `data`:

**Antes:**
```javascript
data: { [objectName]: body.data || {} }
```

**Después:**
```javascript
data: { [objectName]: body.data[type] || body.data || {} }
```

`body.data[type]` extrae `body.data["InvoiceQuery"]` → `{ "MaxReturned": "1" }` directamente, sin el wrapper extra.

El payload correcto que debe llegar a LedgerBridge:
```json
{
  "InvoiceQueryRq": {
    "MaxReturned": "1"
  }
}
```

XML resultante correcto:
```xml
<InvoiceQueryRq>
  <MaxReturned>1</MaxReturned>
</InvoiceQueryRq>
```

---

## Verificación

Tras aplicar el fix, ejecutar desde LedgerOps:

```bash
POST /webhook/sales/invoice/query
{
  "type": "InvoiceQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": { "InvoiceQuery": { "MaxReturned": "1" } }
}
```

Respuesta esperada: `success: true` con datos reales de Invoice.

---

## Nota

Verificar si este mismo patrón existe en otros workflows Query de LedgerOps (CustomerQuery, VendorQuery, etc.) — si el bug es global, aplicar el mismo fix en todos.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | Bug identificado en nodo Code — Validate Type del workflow InvoiceQuery |
