# PROMPT-RIQ-002 — QB Playground · Filtrar campos vacíos en el payload

**Fecha:** 2026-03-30
**De:** SyncBridge
**Para:** RIQ (redix-integration-quickbooks)
**Tipo:** improvement
**Estado:** ✅ solved — 2026-03-30 · pruneEmpty implementado · 4 reglas verificadas

---

## Problema identificado

Durante el testing de `ItemInventoryAdd`, el JSON construido por el frontend incluye todos los campos del form — incluyendo aquellos que el usuario dejó vacíos (sin valor). Esto genera dos tipos de fallo:

**1. QB-PARSE-ERROR** — QB Desktop rechaza campos con valores vacíos o Refs con FullName inválido.

**2. Errores de referencia** — Un `PrefVendorRef: { "FullName": "IBM Corp" }` enviado sin ListID falla si ese vendor no existe en la sede. El campo vacío se convierte en un valor inválido.

Ejemplo del payload problemático generado hoy:
```json
{
  "PrefVendorRef": { "FullName": "IBM Corp" },
  "ClassRef": { "FullName": "Electronics" },
  "ParentRef": { "FullName": "Account Name" },
  "UnitOfMeasureSetRef": { "FullName": "Each" },
  "TotalValue": "0.00"
}
```

Ninguno de esos campos fue llenado con datos reales — son valores placeholder del form que no deben viajar en el payload.

---

## Sugerencia de SyncBridge

**Implementar un filtro en el builder del payload** que excluya automáticamente todo campo sin datos antes de construir el JSON Output.

### Reglas de filtrado

| Tipo de campo | Excluir si... |
|---|---|
| `string` | El valor es `""` (cadena vacía) |
| `ref` (objeto con ListID/FullName) | Ambos `ListID` y `FullName` están vacíos |
| `ref` con solo FullName | FullName es `""` o es el placeholder del form |
| Objeto anidado | Queda completamente vacío después de aplicar el filtro |
| Array de líneas | El array está vacío o todas sus líneas están vacías |

### Comportamiento esperado

**Form llenado parcialmente → JSON limpio:**

El usuario llena solo `Name`, `SalesPrice`, `IncomeAccountRef/ListID`. El resto del form visible queda vacío.

```json
{
  "type": "ItemInventoryAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ItemInventoryAdd": {
      "Name": "RDX-TEST-ITEM-1",
      "SalesPrice": "125.00",
      "IncomeAccountRef": { "ListID": "80000078-1597178857" }
    }
  }
}
```

Los campos vacíos no aparecen. LedgerBridge valida los campos requeridos — si faltan, retorna `LB-VALIDATION-MISSING_REQUIRED` con el campo específico. Eso es preferible a enviar valores vacíos que causan errores en QB.

### Caso especial — Ref con solo ListID o solo FullName

Si el usuario llena solo el ListID de un Ref (caso más común), el objeto Ref debe incluir solo ese campo:

```json
"IncomeAccountRef": { "ListID": "80000078-1597178857" }
```

No debe incluir `"FullName": ""`. LedgerBridge resuelve el FullName internamente cuando recibe el ListID.

---

## Justificación

El form del playground debe mostrar todos los campos disponibles para que el usuario sepa qué puede enviar — eso es correcto y debe mantenerse. El cambio es solo en la capa de construcción del payload: **mostrar todo, enviar solo lo que tiene datos**.

Este patrón es estándar en integraciones QB — el QBXML spec de Intuit especifica que los campos opcionales no deben incluirse si no tienen valor. Incluirlos vacíos puede causar comportamientos inesperados según la versión de QB Desktop.

---

## Verificación

Después de implementar el filtro, repetir el test `ItemInventoryAdd` con el form parcialmente llenado y confirmar que:

1. El JSON Output solo muestra campos con datos
2. El payload llega a LedgerOps sin campos vacíos
3. LedgerBridge retorna `LB-VALIDATION-MISSING_REQUIRED` si falta un campo requerido (no QB-PARSE-ERROR por campo vacío)

Reportar el JSON Output resultante a SyncBridge para verificación.
