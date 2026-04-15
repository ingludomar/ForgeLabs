# PROMPT-LB-026 — LedgerBridge · Business Rules · Bug en requiredFields al retornar objetos

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | bug |
| **Estado** | ✅ solved |

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

## Diagnóstico LB (2026-04-15)

La propuesta de FL es correcta en el fix pero apunta al archivo equivocado. `lb-business-required-get.py` ya fue corregido en PROMPT-LB-024. El bug real está en 3 scripts que leen `rules/business/` directamente y aplican `str(p)` sin extraer `p["path"]` cuando el elemento es un objeto:

| Archivo | Línea | Bug |
|---|---|---|
| `lb-jsonin.py` | 251 | `str(p)` sobre dict → serializa el objeto completo |
| `lb-xml-build.py` | 89 | mismo patrón |
| `lb-jsonin-validate.py` | 84 | mismo patrón |

Fix idéntico en los 3 — reemplazar `str(p)` por `extract_path`:

```python
# Antes (buggy)
[str(p) for p in doc.get('requiredBusiness', []) if str(p).strip()]

# Después (correcto)
def extract_path(rule):
    if isinstance(rule, str): return rule.strip() or None
    if isinstance(rule, dict) and rule.get('active', True) is not False:
        return str(rule.get('path', '')).strip() or None
    return None

[p for rule in doc.get('requiredBusiness', []) for p in [extract_path(rule)] if p]
```

Bonus: también aplica el flag `active` correctamente — reglas con `active: false` no aparecen en `requiredFields` ni se validan.

**FL aprobó implementación en los 3 archivos.**

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Bug en requiredFields — objetos serializados como strings tras toggle-sede · propuesta inicial apuntaba a lb-business-required-get.py |
| 2026-04-15 | Diagnóstico LB | Archivo correcto identificado — bug en lb-jsonin.py:251 · lb-xml-build.py:89 · lb-jsonin-validate.py:84 · fix extract_path aprobado por FL |
| 2026-04-15 | Completado LB | Commit f0b3228 · deploy verificado · requiredBusinessPaths retorna paths limpios · active:false respetado |
| 2026-04-15 | Cierre FL | Verificado · PROMPT cerrado |
