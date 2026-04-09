# PROMPT-004 — Fix sub-workflow Sede Routes · enfoque correcto

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | LedgerExec |
| **Tipo** | bug |
| **Estado** | ⏳ pending |

---

## Contexto

El PROMPT-003 introdujo el sub-workflow `[Config] Sede Routes` para externalizar las URLs de sedes. La implementación actual altera el payload original y rompe el flujo completo del ecosistema — todas las entidades fallan con `QB-PARSE-ERROR`.

**El problema:** el nodo `Code — Resolve Sede Target` está modificando el payload en lugar de solo agregar la URL. El payload llega corrupto a LedgerBridge.

---

## Solución

### Paso 1 — Revertir LedgerExec al estado anterior al PROMPT-003

Revertir al commit previo a `31f433a` — el estado donde todo el ecosistema funcionaba correctamente.

### Paso 2 — Reimplementar con enfoque correcto

El sub-workflow `[Config] Sede Routes` debe recibir solo la `sede` y retornar solo la URL correspondiente. El payload original **nunca se toca**.

**Sub-workflow `[Config] Sede Routes`:**

Recibe: `{ "sede": "TEST" }`

Lógica interna:
```javascript
const sedeRoutes = {
  TEST: "http://192.168.0.51:8600/qbxml",
  RUS:  "http://192.168.0.74:8600/qbxml",
  REC:  "http://192.168.0.66:8600/qbxml",
  RBR:  "http://192.168.3.205:8600/qbxml",
  RMX:  "http://192.168.4.216:8600/qbxml"
};

const sede = $input.first().json.sede;
const url = sedeRoutes[sede];

if (!url) {
  return [{ json: { url: null, error: `Sede no configurada: ${sede}` } }];
}

return [{ json: { url, error: null } }];
```

Retorna: `{ "url": "http://192.168.0.51:8600/qbxml", "error": null }`
o: `{ "url": null, "error": "Sede no configurada: TSI" }`

---

**En LedgerExec — nodo `Execute — Config Sede Routes`:**

Enviar al sub-workflow solo la sede:
```json
{ "sede": "{{ $json.sede }}" }
```

---

**En LedgerExec — nodo `Code — Resolve Sede Target`:**

El payload original viene intacto del nodo anterior a `Execute — Config Sede Routes`.
El sub-workflow devuelve solo la URL. Mergear con un spread — sin tocar nada más:

```javascript
const result = $('Execute — Config Sede Routes').first().json;

if (result.error) {
  throw new Error(result.error);
}

// Payload original — viene del nodo previo al Execute (Code — Fix XML o equivalente)
const payload = $input.first().json;

return [{ json: { ...payload, qbxmlTarget: result.url } }];
```

---

## Resultado esperado

El payload que llega a LedgerBridge debe ser idéntico al que llegaba antes del PROMPT-003 — solo con `qbxmlTarget` agregado. Ningún otro campo debe cambiar.

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

Verificar también con CustomerQuery para confirmar que el fix es global:

```bash
POST /webhook/contacts/customer/query
{
  "type": "CustomerQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": { "CustomerQuery": { "MaxReturned": "1" } }
}
```

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | PROMPT-003 rompió el ecosistema — revert + reimplementación correcta del sub-workflow |
