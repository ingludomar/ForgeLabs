# PROMPT-RIQ-005 — QB Playground · Migración a contratos dinámicos

**Fecha:** 2026-03-30
**Tipo:** feature
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-001](PROMPT-RIQ-001-qb-playground-integration.md) — integración base que este PROMPT evoluciona hacia contratos dinámicos
- [PROMPT-LO-016](../ledgerops/PROMPT-LO-016-sedes-config-contract-endpoint.md) — endpoints `GET /webhook/sedes` y `GET /webhook/contracts` que este PROMPT consume

---

## Contexto

Los endpoints de LedgerOps para configuración de sedes y contratos dinámicos ya están activos y verificados:

- `GET /webhook/sedes` — tabla de sedes con versión QBXML
- `GET /webhook/contracts?type={type}&sede={sede}` — contrato de campos por entidad y sede

Esto desbloquea la migración de RIQ de contratos estáticos (`contracts.ts`) a contratos dinámicos consumidos en tiempo real desde LedgerOps.

---

## Objetivo

Reemplazar el uso de `contracts.ts` estático en el QB Playground por llamadas dinámicas a LedgerOps. Al cargar el Playground, RIQ obtiene las sedes disponibles. Al seleccionar entidad + sede, RIQ obtiene el contrato real con los campos y cuáles son requeridos.

---

## Flujo objetivo

```
Usuario abre QB Playground
        ↓
RIQ llama GET /webhook/sedes  (una vez al cargar)
        ↓
Construye selector de sede con datos reales (status: pending → deshabilitado)
        ↓
Usuario selecciona entidad + sede
        ↓
RIQ llama GET /webhook/contracts?type={type}&sede={sede}
        ↓
RIQ construye el formulario con los campos reales
  · campos con required: true → marcados como obligatorios
  · campos con type: ref → renderizar sub-campos ListID / FullName
        ↓
Usuario llena el formulario
        ↓
RIQ aplica pruneEmpty + buildRef (PROMPT-RIQ-002 y PROMPT-RIQ-003)
        ↓
POST al endpoint LedgerOps correspondiente (PROMPT-RIQ-001)
```

---

## Endpoints LedgerOps — especificación

### GET /webhook/sedes

**Response:**
```json
{
  "success": true,
  "data": {
    "sedes": [
      { "code": "TEST", "label": "TEST — Test Environment", "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "RUS",  "label": "RUS — Redsis USA",        "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "REC",  "label": "REC — Redsis Ecuador",    "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "RBR",  "label": "RBR — Redsis Brasil",     "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "RMX",  "label": "RMX — Redsis México",     "qbDesktop": "2021", "qbxmlVersion": "13.0", "status": "active" },
      { "code": "TSI",  "label": "TSI",                     "qbDesktop": null,   "qbxmlVersion": null,   "status": "pending" },
      { "code": "RRC",  "label": "RRC",                     "qbDesktop": null,   "qbxmlVersion": null,   "status": "pending" }
    ]
  }
}
```

Regla: sedes con `status: "pending"` se muestran deshabilitadas en el selector.

---

### GET /webhook/contracts?type={type}&sede={sede}

**Ejemplo:**
```
GET /webhook/contracts?type=VendorAdd&sede=TEST
GET /webhook/contracts?type=VendorAdd&sede=RMX
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "VendorAdd",
    "sede": "TEST",
    "qbxmlVersion": "17.0",
    "fields": {
      "Name":                    { "type": "string", "required": true },
      "IsVendorEligibleFor1099": { "type": "string", "required": true },
      "CurrencyRef":             { "type": "ref",    "required": true },
      "IsActive":                { "type": "string", "required": false }
    },
    "requiredFields": [
      "Name",
      "IsVendorEligibleFor1099",
      "CurrencyRef/ListID"
    ]
  }
}
```

Reglas de renderizado del formulario a partir del contrato:
- `required: true` → campo marcado como obligatorio visualmente
- `type: "ref"` → renderizar sub-campos `ListID` y `FullName`
- `type: "string"` → input de texto plano

---

## Cambios requeridos en RIQ

### 1. Eliminar dependencia de `contracts.ts` para el formulario

El formulario del QB Playground debe construirse a partir de la respuesta de `GET /webhook/contracts`, no del archivo estático.

`contracts.ts` puede mantenerse como fallback temporal mientras se implementa la migración, pero la fuente de verdad para el formulario debe ser el endpoint dinámico.

### 2. Llamada a `/webhook/sedes` al cargar el Playground

```typescript
// Al montar el componente QB Playground
const sedesRes = await fetch(`${LEDGEROPS_BASE_URL}/webhook/sedes`);
const { data } = await sedesRes.json();
const sedes = data.sedes;
// Construir selector con sedes activas y deshabilitadas
```

### 3. Llamada a `/webhook/contracts` al cambiar entidad o sede

```typescript
// Al cambiar type o sede en el selector
const contractRes = await fetch(
  `${LEDGEROPS_BASE_URL}/webhook/contracts?type=${type}&sede=${sede}`
);
const { data } = await contractRes.json();
const { fields, requiredFields } = data;
// Construir formulario con fields
```

### 4. La versión QBXML ya no se hardcodea

La `qbxmlVersion` se deriva automáticamente de la sede en `/webhook/sedes`. RIQ no necesita mantener el mapa de versiones — ya lo tiene LedgerOps internamente.

---

## Notas

- La lógica `pruneEmpty` (PROMPT-RIQ-002) y `buildRef` (PROMPT-RIQ-003) se mantienen sin cambios — aplican al payload antes de enviarlo.
- Los datos de ejemplo reales (PROMPT-RIQ-004) siguen siendo válidos para el botón `Fill Examples` — se mantienen en `contracts.ts` o en un archivo de datos separado.
- El routing de operaciones a endpoints LedgerOps (PROMPT-RIQ-001) no cambia.

---

## Verificación

Confirmar a SyncBridge cuando:

1. El selector de sede se construye dinámicamente desde `/webhook/sedes`
2. Al cambiar de sede, el formulario refleja los campos del contrato dinámico
3. Los campos `required: true` quedan marcados visualmente
4. Los campos Ref renderizan sub-campos ListID / FullName
5. Una operación completa (ej. VendorAdd sede TEST) ejecuta correctamente de inicio a fin con el formulario dinámico

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-30 | Emisión | PROMPT emitido a RIQ — migrar `contracts.ts` estático a llamadas dinámicas a LedgerOps |
| 2026-03-30 | Resolución | Formulario construido dinámicamente desde `/webhook/sedes` y `/webhook/contracts`; campos `required` marcados visualmente |
