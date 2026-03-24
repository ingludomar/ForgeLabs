# Ecosistema — Visión general

## Propósito

El ecosistema SyncBridge integra cualquier sistema origen (CRM, portal, ERP) con QuickBooks Desktop de forma automatizada, sin intervención manual y sin acceso directo a QB.

## Flujo completo

```
Sistema origen
    ↓ POST /webhook/{module}/{entity}/{op}
    ↓ body: { type, sede, version, data }
[LedgerOps]
    - Valida type, sede y data
    - Aplica reglas de negocio de la organización
    - Estructura el payload hacia LedgerExec
    ↓ POST /webhook/ledgerexec
    ↓ body: { type, sede, version, object, data: { [type+'Rq']: { [type]: data } } }
[LedgerExec]
    - Orquesta el flujo genérico
    - Invoca LedgerBridge vía SSH con el payload JSON
    ↓ SSH (JSON)
[LedgerBridge]
    - Valida el schema QBXML del tipo
    - Aplica business rules (requiredBySede, transformaciones)
    - Construye el XML completo
    - Invoca qbxmlIntegrator vía HTTP
    ↓ HTTP :{sede-ip}:8600  POST /qbxml
[qbxmlIntegrator]
    - Recibe el QBXML
    - Lo ejecuta en QB Desktop via win32com (interfaz COM)
    - Devuelve la respuesta XML parseada
    ↑ respuesta sube por la cadena hasta LedgerOps
[Sistema origen recibe respuesta]
```

## Principios del ecosistema

1. **Cada componente tiene un solo rol** — no cruzan responsabilidades
2. **LedgerBridge es la fuente de verdad** — schemas, business rules, QBXML
3. **LedgerOps es el único punto de entrada** — el sistema origen no conoce los demás componentes
4. **La sede va siempre en el body** — no en la URL
5. **El ecosistema es multi-sede** — cada sede puede tener QB Desktop diferente y business rules distintas

## Sedes del ecosistema

| Sede | QB Desktop | QBXML | Estado |
|---|---|---|---|
| TEST | 2024 | 17.0 | ✅ Activa — pruebas |
| RUS | 2024 | 17.0 | ✅ Producción |
| REC | 2024 | 17.0 | ✅ Producción |
| RBR | 2024 | 17.0 | ✅ Producción |
| RMX | 2021 | 13.0 | ✅ Producción — LedgerBridge remapea versión |
| TSI | — | — | ⏳ Pendiente configuración |
| RRC | — | — | ⏳ Pendiente configuración |

## Regla RMX
RMX corre QB Desktop 2021 — acepta solo QBXML v13.0. LedgerOps siempre envía `version: "17.0"`. LedgerBridge remapea internamente usando `config/sede-version-map.json`. Cada entidad nueva requiere un PROMPT a LedgerBridge para clonar los schemas v13.0.
