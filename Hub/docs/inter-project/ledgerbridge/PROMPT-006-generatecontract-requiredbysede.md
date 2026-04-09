# PROMPT-006 — GenerateContract retorna contrato vacío y requiredBySede vacío

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-19 |
| **Escalado** | 2026-03-30 — bloqueante crítico para RIQ |
| **Resuelto** | 2026-03-30 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | bug |
| **Estado** | ✅ solved |
| **Fix** | URL corregida en workflow N8N — `/webhook/jsonin` → `/webhook/tools/jsonin-get` |

## PROMPTs relacionados

- [PROMPT-LO-016](../ledgerops/PROMPT-LO-016-sedes-config-contract-endpoint.md) — endpoint de contratos dinámicos en LedgerOps que consume GenerateContract; fue desbloqueado cuando este PROMPT se resolvió

---

## Descripción

`POST /webhook/tools/contract` retorna `data: {}` completamente vacío y `requiredBySede.fields: []` aunque las reglas estén correctamente registradas vía `business-rules/replace` y `business-rules/get` las muestre correctamente.

---

## Evidencia actualizada (2026-03-30)

```bash
# 1. Business rules registradas y verificadas ✅
POST /webhook/business-rules/get
{ "type": "VendorAdd", "sede": "TEST", "version": "17.0" }
# → requiredBusiness: [CurrencyRef/ListID, IsVendorEligibleFor1099, Name] ✅

# 2. GenerateContract — retorna vacío ❌
POST /webhook/tools/contract
{ "type": "VendorAdd", "sede": "TEST", "version": "17.0" }
# → { "data": {}, "requiredBySede": { "fields": [] } }

# 3. Mismo resultado para RMX v13.0 ❌
POST /webhook/tools/contract
{ "type": "VendorAdd", "sede": "RMX", "version": "13.0" }
# → { "data": {}, "requiredBySede": { "fields": [] } }
```

**Confirmado en todas las sedes y versiones — el problema es global.**

---

## Impacto actual — dos consumidores bloqueados

### 1. SyncBridge — P2.5 bloqueado
El paso P2.5 del flujo de desarrollo compara contratos v17.0 vs v13.0 para documentar diferencias por sede en los docs de desarrollador. Sin `data` en el contrato, no hay nada que comparar.

### 2. RIQ (Redix QB Playground) — integración dinámica bloqueada
RIQ tiene un QB Playground que permite ejecutar operaciones QB desde el frontend. La arquitectura correcta es:

```
Usuario selecciona entidad + sede
        ↓
RIQ llama GenerateContract
        ↓
LedgerBridge retorna contrato con campos + requiredBySede
        ↓
RIQ construye form dinámicamente con campos correctos y requeridos marcados
```

Sin GenerateContract funcional, RIQ no puede:
- Saber qué campos mostrar en el form por entidad
- Saber cuáles son requeridos por sede (TEST vs RMX tienen reglas distintas)
- Adaptar el form dinámicamente cuando el usuario cambia de sede

**RIQ está usando datos estáticos hardcodeados como workaround temporal — no es sostenible.**

---

## Comportamiento esperado

```json
POST /webhook/tools/contract
{ "type": "VendorAdd", "sede": "TEST", "version": "17.0" }

{
  "data": {
    "Name": { "type": "string", "required": true },
    "IsVendorEligibleFor1099": { "type": "string", "required": false },
    "CurrencyRef": {
      "ListID": { "type": "string", "required": true },
      "FullName": { "type": "string", "required": false }
    }
  },
  "requiredBySede": {
    "fields": [
      "CurrencyRef/ListID",
      "IsVendorEligibleFor1099",
      "Name"
    ]
  }
}
```

---

## Workaround actual

- SyncBridge: usar `business-rules/get` directamente para conocer campos requeridos
- RIQ: datos estáticos en `contracts.ts` — hardcodeados por entidad, no por sede

---

## Solicitud a LedgerBridge

1. **Investigar** por qué `data: {}` — el schema existe (describe funciona), las business rules existen (`business-rules/get` funciona). GenerateContract no está leyendo ninguna de las dos fuentes.
2. **Corregir** para que `data` exponga los campos del schema con sus tipos.
3. **Corregir** para que `requiredBySede.fields` exponga las business rules registradas para el type+sede+version.
4. **Confirmar** con SyncBridge una vez resuelto — se emitirá PROMPT-RIQ-005 para que RIQ migre de estático a dinámico.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-19 | Emisión | PROMPT emitido a LedgerBridge — GenerateContract retornaba `data: {}` y `requiredBySede.fields: []` |
| 2026-03-30 | Resolución | URL del workflow N8N corregida (`/webhook/jsonin` → `/webhook/tools/jsonin-get`); GenerateContract operativo |
