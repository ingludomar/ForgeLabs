# PROMPT-LO-018 — Contratos dinámicos · Incluir campos requeridos por Intuit

**Fecha:** 2026-03-31
**Tipo:** bug / improvement
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-016](PROMPT-016-sedes-config-contract-endpoint.md) — endpoint `/webhook/contracts` afectado por este fix
- [PROMPT-017](PROMPT-017-p25-contract-version-note.md) — docs de contratos que complementan este cambio

---

## Problema

El endpoint `GET /webhook/contracts?type={type}&sede={sede}` actualmente construye el contrato llamando `POST /webhook/describe` + `POST /webhook/business-rules/get` por separado. Esto produce un contrato que solo refleja los campos requeridos por sede (`requiredBySede`) pero omite los campos requeridos por Intuit/QuickBooks (`requiredByIntuit`).

Como resultado, el formulario de RIQ no marca campos como `IsActive` como obligatorios, y la operación falla en LedgerBridge con `LB-VALIDATION-MISSING_REQUIRED`.

El contrato correcto debe incluir **ambas capas**:
- `requiredByIntuit` — campos que QB Desktop rechaza si están vacíos
- `requiredBySede` — campos exigidos por reglas de negocio de la sede

---

## Metodología de implementación

Antes de implementar, LO debe seguir este proceso:

### Paso 1 — Investigar qué existe

Verificar qué endpoints exponen los proyectos que LO orquesta (LedgerBridge, LedgerExec) que puedan satisfacer la necesidad. No construir lo que ya existe.

### Paso 2 — Si falta algo, emitir PROMPT al proyecto

Si un proyecto no tiene lo que LO necesita, emitir un PROMPT a ese proyecto explicando:
- Qué necesita LO
- Qué tools o endpoints tiene disponibles ese proyecto
- Qué debe crear o exponer

El proyecto responde con lo que tiene o crea lo que falta. Cada proyecto hace su parte — LO orquesta.

### Paso 3 — LO usa lo que cada proyecto le suministra

---

## Hallazgo previo

LedgerBridge ya expone `POST /webhook/tools/contract` que retorna el contrato completo con ambas colecciones:

```json
{
  "data": {
    "info": {
      "requiredByIntuit": {
        "fields": ["IsActive", "Name", ...]
      },
      "requiredBySede": {
        "fields": ["CurrencyRef/ListID", "IsVendorEligibleFor1099", "Name"]
      }
    },
    "contract": {
      "data": { "VendorAdd": { ... todos los campos ... } }
    }
  }
}
```

LO debe evaluar si puede usar este endpoint en lugar de ensamblar el contrato por su cuenta.

---

## Resultado esperado

`GET /webhook/contracts?type=VendorAdd&sede=TEST` debe retornar:

```json
{
  "success": true,
  "data": {
    "type": "VendorAdd",
    "sede": "TEST",
    "qbxmlVersion": "17.0",
    "fields": {
      "Name":                    { "type": "string", "required": true },
      "IsActive":                { "type": "string", "required": true },
      "IsVendorEligibleFor1099": { "type": "string", "required": true },
      "CurrencyRef":             { "type": "ref",    "required": true },
      ...
    },
    "requiredFields": ["Name", "IsActive", "CurrencyRef/ListID", "IsVendorEligibleFor1099"]
  }
}
```

Todos los campos requeridos por Intuit y por sede deben estar en `required: true` y en `requiredFields`.

---

## Verificación

Confirmar a SyncBridge:
1. `GET /webhook/contracts?type=VendorAdd&sede=TEST` retorna `IsActive` con `required: true`
2. Mismo resultado para las 13 entidades desplegadas
3. RIQ marca `IsActive` como campo obligatorio en el formulario de Vendor Add

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a LedgerOps — el endpoint `/contracts` omitía campos `requiredByIntuit`; RIQ enviaba requests incompletos |
| 2026-03-31 | Resolución | LO usa `POST /webhook/tools/contract` de LedgerBridge que ya incluye ambas colecciones; contrato unificado retorna `requiredByIntuit` + `requiredBySede` |
