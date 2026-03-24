# PROMPT-006 — GenerateContract no expone requiredBySede aunque las reglas estén registradas

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-19 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | bug |
| **Estado** | ⏳ pending |

---

## Descripción

`POST /webhook/tools/contract` devuelve `requiredBySede.fields: []` aunque las reglas estén correctamente registradas vía `POST /webhook/business-rules/replace`.

## Evidencia

```bash
# 1. Registrar reglas
POST /webhook/business-rules/replace
{ "type": "ItemServiceAdd", "sede": "TEST", "version": "17.0",
  "paths": ["/QBXML/QBXMLMsgsRq/ItemServiceAddRq/ItemServiceAdd/SalesTaxCodeRef/ListID"] }
# → LB-BIZ-REPLACED ✅

# 2. Verificar reglas almacenadas
POST /webhook/business-rules/get
{ "type": "ItemServiceAdd", "sede": "TEST", "version": "17.0" }
# → requiredBusiness: ["/QBXML/.../SalesTaxCodeRef/ListID"] ✅

# 3. Generar contrato
POST /webhook/tools/contract
{ "type": "ItemServiceAdd", "sede": "TEST", "version": "17.0" }
# → requiredBySede.fields: [] ❌ — debería mostrar SalesTaxCodeRef/ListID
```

## Impacto

- Las reglas SÍ se aplican en tiempo de ejecución (validación funciona correctamente)
- El contrato es solo informativo — no bloquea las operaciones
- Sin embargo, impide al equipo consumidor conocer qué campos son requeridos por sede desde el contrato

## Comportamiento esperado

`requiredBySede.fields` debe listar los campos registrados en `business-rules` para el type+sede+version solicitado.

## Entidades afectadas confirmadas

- ItemServiceAdd / TEST (detectado 2026-03-19)
- Posiblemente todos los types — requiere verificación

## Workaround actual

Usar `POST /webhook/business-rules/get` para consultar las reglas directamente mientras se resuelve el bug.
