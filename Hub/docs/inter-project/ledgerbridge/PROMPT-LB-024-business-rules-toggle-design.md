# PROMPT-LB-024 — LedgerBridge · Business Rules · Diseño de toggle por campo de sede

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | research |
| **Estado** | 🔵 pending |

---

## Contexto

Con PROMPT-LB-023 implementado, LB ya soporta el flag `active` por regla de sede. Las reglas de Intuit y las de sede están separadas — deshabilitar una regla de sede no afecta la validación de Intuit.

El endpoint actual para modificar reglas de sede es `POST /webhook/business-rules/add`, que fue diseñado para agregar rutas. Hoy se usa también para desactivar campos pasando `active: false`, pero no fue diseñado explícitamente para eso.

---

## Pregunta a LB

¿Existe o está planificado un endpoint dedicado para **activar/desactivar** una regla de sede existente sin tener que reenviar el objeto completo?

Por ejemplo, algo como:

```json
POST /webhook/business-rules/toggle
{
  "sede": "TEST",
  "version": "17.0",
  "type": "CreditCardChargeAdd",
  "path": "/QBXML/QBXMLMsgsRq/CreditCardChargeAddRq/CreditCardChargeAdd/ExchangeRate",
  "active": false
}
```

O si el diseño correcto es seguir usando `business-rules/add` con el objeto completo.

---

## Lo que FL necesita saber

1. ¿Cuál es el endpoint y la operación correcta para activar/desactivar una regla de sede?
2. ¿El endpoint actual `business-rules/add` es el definitivo para esta operación, o hay uno más específico?
3. ¿Existe un endpoint para **listar** las reglas de una sede con su estado `active/inactive`? (útil para auditoría)

---

## Acción requerida

1. **Analizar viabilidad** — revisar el diseño actual y determinar si ya existe o si es necesario implementar algo nuevo
2. Responder a FL con el diseño actual o propuesta
3. Si se requiere implementación: confirmar commit + deploy al servidor
4. Confirmar a FL cada paso pendiente por separado — no solo el commit:
   - `PROMPT-LB-024 respondido — diseño: {descripción}`
   - Si hay deploy: `Deploy completado — {detalle}`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Consulta de diseño — endpoint para toggle de reglas de sede · auditoría de campos activos/inactivos |
