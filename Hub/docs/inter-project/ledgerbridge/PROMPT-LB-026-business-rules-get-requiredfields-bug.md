# PROMPT-LB-026 — LedgerBridge · Business Rules · Bug en requiredFields al retornar objetos

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | bug |
| **Estado** | 🔵 pending |

---

## Contexto

Después de ejecutar `toggle-sede` (PROMPT-LB-025) en `ItemServiceAdd`, el endpoint `GET /webhook/contracts` de LO retorna `requiredFields` con los objetos serializados incorrectamente como strings:

```json
"requiredFields": [
    "Name",
    "ItemServiceAdd/Name', 'active': False, 'source': 'inferred', 'verified': False, 'reason': ''}",
    "AccountRef/ListID', 'active': False, 'source': 'inferred', 'verified': False, 'reason': ''}",
    "SalesOrPurchase/Price', 'active': False, 'source': 'inferred', 'verified': False, 'reason': ''}",
    "SalesTaxCodeRef/ListID', 'active': False, 'source': 'inferred', 'verified': False, 'reason': ''}"
]
```

El problema: `lb-business-required-get.py` al normalizar los objetos del archivo JSON (que ahora pueden ser objetos con `path`, `active`, `source`, etc.) está retornando la representación string del objeto completo en lugar de extraer solo el campo `path`.

---

## Propuesta de FL

En `lb-business-required-get.py`, al construir `requiredFields`, extraer solo el campo `path` de los objetos:

```python
# Pseudocódigo
for rule in required_business_paths:
    if isinstance(rule, str):
        required_fields.append(rule)
    elif isinstance(rule, dict):
        required_fields.append(rule["path"])  # solo el path, no el objeto completo
```

Esto es consistente con el comportamiento esperado: `requiredFields` es una lista de paths, no de objetos.

---

## Evidencia

Consulta que reproduce el bug:

```
GET /webhook/contracts?type=ItemServiceAdd&sede=TEST
```

Respuesta actual — `requiredFields` con strings corruptos.

Consulta con entidad sin toggle-sede ejecutado (ej. `ItemInventoryAdd`) retorna `requiredFields` correctamente como array de strings.

---

## Acción requerida

1. Analizar la propuesta — confirmar si es la causa correcta o hay otra explicación
2. Responder a FL con análisis antes de implementar
3. Esperar aprobación de FL
4. Implementar fix + commit + deploy al servidor
5. Reportar a FL cada paso por separado:
   - `PROMPT-LB-026 completado. Commit {hash}`
   - `Deploy completado`
6. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Bug en requiredFields — objetos serializados como strings tras toggle-sede · causa en lb-business-required-get.py |
