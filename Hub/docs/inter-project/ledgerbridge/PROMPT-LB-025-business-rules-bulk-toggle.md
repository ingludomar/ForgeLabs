# PROMPT-LB-025 — LedgerBridge · Business Rules · Bulk toggle por entidad y sede

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | 🔵 pending |

---

## Contexto

Con PROMPT-LB-023 y PROMPT-LB-024 implementados, LB ya soporta activar/desactivar reglas de sede campo por campo via `business-rules/add` (upsert). Sin embargo, esta operación requiere que FL conozca y liste cada path individualmente — lo cual no es sostenible a medida que crecen las entidades y sedes.

Las reglas de Intuit y las de sede están **completamente separadas**. Desactivar todas las reglas de sede de una entidad no afecta las reglas de Intuit — equivale a decir "para este Add, aplica solo lo que Intuit exige, ignora las inferencias de sede".

---

## Propuesta de FL

Implementar en LB un script `lb-business-required-toggle-sede.py` que reciba:

```json
{
  "type": "ItemInventoryAdd",
  "sede": "TEST",
  "version": "17.0",
  "active": false
}
```

Y desactive (o reactive) **todas** las reglas de sede de esa entidad en un solo llamado — sin que el llamador necesite conocer los paths individuales.

### Comportamiento esperado

- `"active": false` → desactiva todas las reglas de sede de ese type+sede+version
- `"active": true` → reactiva todas las reglas de sede de ese type+sede+version
- Las reglas de Intuit no se tocan — son un conjunto separado
- La respuesta debe incluir cuántas reglas fueron afectadas

### WH propuesto

LB expone internamente el endpoint para que LO pueda consumirlo. FL propone:

```
POST /webhook/business-rules/toggle-sede
```

---

## Lo que FL necesita de LB

1. **Analizar la propuesta** — ¿es viable tal como está? ¿hay algo que cambiar en el nombre del endpoint, el script o el comportamiento?
2. Si hay contraopropuesta, argumentarla
3. FL decide la propuesta final antes de que LB implemente

---

## Acción requerida

1. Analizar viabilidad y responder a FL con análisis + propuesta o aceptación
2. Esperar aprobación de FL antes de implementar
3. Una vez aprobado: implementar script + WH + commit + deploy al servidor
4. Reportar a FL cada paso por separado:
   - `PROMPT-LB-025 aprobado — implementando`
   - `PROMPT-LB-025 completado. Commit {hash}`
   - `Deploy completado`
5. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Bulk toggle de reglas de sede por entidad — sin listar paths individuales |
