# PROMPT-LB-023 — LedgerBridge · Business Rules · Flag de activación por campo

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-14 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | infrastructure |
| **Estado** | ✅ solved — commit dc7edce · deploy pendiente |

---

## Contexto y problema

Las reglas de negocio de sede en LB (`rules/business/{SEDE}/v{VER}/{TYPE}.json`) fueron generadas por inferencia empírica: se consultaron registros reales de QB y los campos que **siempre tenían valor** se marcaron como `requiredBusinessPaths`.

Esta metodología tiene una falla crítica: un campo puede estar siempre poblado en registros históricos porque fue llenado **después de la creación** (vía Mod u otro proceso), no porque sea requerido al momento del Add. El resultado es que LB rechaza con `422 LB-VALIDATION-MISSING_REQUIRED` operaciones Add que son perfectamente válidas para Intuit y para la sede.

**Ejemplo real:** `ExchangeRate` en `CreditCardChargeAdd` sede TEST — siempre tiene valor en registros existentes, pero no es viable en el momento de la creación.

**Hoy no existe manera de corregir una regla incorrecta sin reemplazar toda la lista del archivo** — lo que puede eliminar reglas válidas por error.

---

## Solución propuesta

Cambiar el formato de `requiredBusinessPaths` de **array de strings** a **array de objetos**, agregando metadatos por campo. LB solo aplica reglas con `"active": true`.

### Formato actual

```json
{
  "requiredBusinessPaths": [
    "/QBXML/QBXMLMsgsRq/CreditCardChargeAddRq/CreditCardChargeAdd/AccountRef/ListID",
    "/QBXML/QBXMLMsgsRq/CreditCardChargeAddRq/CreditCardChargeAdd/ExchangeRate"
  ]
}
```

### Formato nuevo

```json
{
  "requiredBusinessPaths": [
    {
      "path": "/QBXML/QBXMLMsgsRq/CreditCardChargeAddRq/CreditCardChargeAdd/AccountRef/ListID",
      "active": true,
      "source": "inferred",
      "verified": false,
      "reason": ""
    },
    {
      "path": "/QBXML/QBXMLMsgsRq/CreditCardChargeAddRq/CreditCardChargeAdd/ExchangeRate",
      "active": false,
      "source": "inferred",
      "verified": false,
      "reason": "Inferred from historical data — campo poblado post-creación, no requerido en Add"
    }
  ]
}
```

### Campos del objeto

| Campo | Tipo | Descripción |
|---|---|---|
| `path` | string | Path QBXML — mismo valor que antes |
| `active` | boolean | `true` = LB aplica esta regla · `false` = LB la ignora |
| `source` | string | `"inferred"` (derivado de datos) · `"manual"` (verificado por admin) |
| `verified` | boolean | `false` = pendiente de revisión · `true` = confirmado correcto |
| `reason` | string | Nota del admin — por qué es requerido o por qué está inactivo |

---

## Cambios requeridos en LB

### 1 — `schema-apply.py`

Al leer `requiredBusinessPaths`, soportar ambos formatos:
- **String** → tratar como `active: true` (backward compatible con archivos no migrados)
- **Objeto** → aplicar solo si `active === true`

```python
# Pseudocódigo
for rule in required_business_paths:
    if isinstance(rule, str):
        apply_rule(rule)  # backward compatible
    elif isinstance(rule, dict) and rule.get("active", True):
        apply_rule(rule["path"])
```

### 2 — `lb-xml-build.py`

Misma lógica: al leer el schema combinado generado, respetar solo los paths marcados como activos.

### 3 — Endpoints admin

Actualizar `POST /webhook/business-rules/add` para aceptar tanto string como objeto en el body. Si recibe string, convertirlo internamente a objeto con `active: true, source: "manual", verified: true`.

### 4 — Migración de archivos existentes

**No migrar automáticamente.** Los archivos existentes siguen funcionando tal cual (backward compatible por el soporte de strings). La migración se hace archivo por archivo cuando el admin revisa y verifica cada regla.

---

## Resultado esperado

1. Un admin puede desactivar una regla incorrecta editando el JSON o usando el endpoint — sin eliminarla
2. Las reglas desactivadas quedan documentadas con su razón (`reason`)
3. Los archivos no migrados siguen funcionando igual que hoy
4. El admin puede marcar reglas como `verified: true` cuando confirma que son correctas
5. En el futuro, un reporte de reglas con `verified: false` permite auditar las reglas pendientes de revisión

---

## Acción inmediata recomendada

Una vez implementado el cambio, desactivar `ExchangeRate` en `CreditCardChargeAdd` para todas las sedes donde esté marcado como requerido:

```json
{
  "path": "/QBXML/QBXMLMsgsRq/CreditCardChargeAddRq/CreditCardChargeAdd/ExchangeRate",
  "active": false,
  "source": "inferred",
  "verified": false,
  "reason": "Campo poblado post-creación via Mod — no requerido en Add"
}
```

---

## Acción requerida

1. Implementar soporte dual (string + objeto) en `schema-apply.py` y `lb-xml-build.py`
2. Actualizar endpoint `business-rules/add` para aceptar objetos
3. Confirmar a FL: `PROMPT-LB-023 completado. Commit {hash}`

---

## Resultado de implementación

| Script | Cambio |
|---|---|
| `schema-apply.py` | Formato dual — string siempre activo · objeto respeta flag `active` |
| `lb-xml-build.py` | Misma lógica dual al validar campos requeridos antes de construir XML |
| `lb-business-required-set.py` | `POST /webhook/business-rules/add` acepta objetos · string entrante → convertido a `{active:true, source:"manual", verified:true}` · archivos legacy migrados a objetos en primera escritura · respuesta incluye `activeRules / inactiveRules` |

**Deploy:** workflow temporal `[TEMP] LB Deploy — git pull` (ID: Qx4pT2eaAP65AupP) creado en N8N · pendiente activación desde UI.

**Acción post-deploy:** desactivar `ExchangeRate` en `CreditCardChargeAdd` para sedes TEST · RUS · RBR · REC · RMX via `POST /webhook/business-rules/add`.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-14 | Emisión | Business rules active flag — metodología de inferencia empírica genera reglas incorrectas · solución: flag por campo con backward compatibility |
| 2026-04-14 | Completado | Commit dc7edce — 3 scripts modificados · deploy pendiente · ExchangeRate desactivación pendiente post-deploy |
