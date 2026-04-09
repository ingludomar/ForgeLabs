# PROMPT-RIQ-023 — Estándar de documentación por rol para entidades QB Playground

**Fecha:** 2026-04-07
**Tipo:** convention + docs
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-07

## PROMPTs relacionados

- [PROMPT-RIQ-022](PROMPT-RIQ-022-playground-fetch-timeout-convention.md) — checklist de cierre de features Playground (fetch timeout, sending, overlay)
- [PROMPT-RIQ-021](PROMPT-RIQ-021-salesorder-playground-docs.md) — SalesOrder · primer caso que activa este estándar

---

## Contexto

Cada vez que una entidad del QB Playground se cierra, se genera únicamente `docs/qb-playground/{Entidad}.md` (guía de usuario). Sin embargo, el flujo Tipo 2 requiere 5 docs por rol antes de generar el correo de entrega a Luis Potte y Mike Habib.

Otros features de plataforma ya siguen este estándar:
- Webhook Admin → [PROMPT-RIQ-020](PROMPT-RIQ-020-webhook-admin-docs.md) generó Executive · Developer · Architect · QA · Support
- QB Playground Templates → misma estructura

Las entidades del Playground (Vendor, Customer, ItemInventory, SalesOrder) tienen solo el user guide — **les faltan los 4 docs por rol restantes**.

---

## Regla persistente — cierre de entidad QB Playground

A partir de ahora, al cerrar cualquier entidad del QB Playground, generar **6 archivos** por entidad:

| Archivo | Audiencia | Contenido |
|---|---|---|
| `docs/qb-playground/{Entidad}.md` | Usuario final | Guía de uso — operaciones, campos, Fill Examples, casos de prueba (ya establecido) |
| `docs/qb-playground/{Entidad}-executive.md` | Mike Habib / Dirección | Valor de negocio — qué permite, por qué importa, impacto operacional |
| `docs/qb-playground/{Entidad}-developer.md` | Desarrollador | Payload técnico, campos requeridos vs opcionales, errores, ejemplos JSON |
| `docs/qb-playground/{Entidad}-architect.md` | Arquitecto | Flujo de datos: UI → backend → LedgerOps → QB Desktop, integración con contratos dinámicos |
| `docs/qb-playground/{Entidad}-qa.md` | QA | Tabla de casos de prueba con pasos, datos y resultado esperado (positivos + negativos) |
| `docs/qb-playground/{Entidad}-support.md` | Soporte | Errores comunes, causas, soluciones paso a paso |

**El `{Entidad}.md` (guía de usuario) ya existe para todas las entidades y sigue siendo el documento principal.**
Los 5 docs por rol son adicionales y complementarios.

### Checklist de cierre actualizado (extender PROMPT-RIQ-022)

```
DOCS
[ ] docs/qb-playground/{Entidad}.md               ✅ (ya generado en PROMPT-RIQ-0XX)
[ ] docs/qb-playground/{Entidad}-executive.md     pendiente
[ ] docs/qb-playground/{Entidad}-developer.md     pendiente
[ ] docs/qb-playground/{Entidad}-architect.md     pendiente
[ ] docs/qb-playground/{Entidad}-qa.md            pendiente
[ ] docs/qb-playground/{Entidad}-support.md       pendiente

PROMPT-LO generado con los 5 docs → LO confirma commit → correo de entrega
```

---

## Acción requerida — backfill SalesOrder (inmediato)

El correo de entrega de Sales Order está bloqueado hasta que existan estos 5 docs. Generarlos basándose en:
- [PROMPT-RIQ-021](PROMPT-RIQ-021-salesorder-playground-docs.md) — testing + hallazgos técnicos
- [docs/qb-playground/SalesOrder.md](../../../docs/qb-playground/SalesOrder.md) — guía de usuario ya publicada (LO commit efdbbb5)

### Contenido requerido por doc

**`SalesOrder-executive.md`**
- Qué es Sales Order en el contexto del negocio (órdenes de venta antes de facturar)
- Qué permite el Playground: crear, consultar y modificar SOs desde Redix sin acceder a QB
- Valor operacional: agilidad en verificación, testing de integraciones, auditoría de datos en tiempo real
- Sedes disponibles: TEST · RUS · REC · RBR · RMX

**`SalesOrder-developer.md`**
- Campos requeridos por Intuit vs por sede (Add + Mod)
- Estructura del payload con líneas de detalle (`SalesOrderLine`)
- Errores técnicos clave: QB-3070 (RefNumber máx 11 chars), QB-3100, QB-3120, MISSING-DATA
- Nota: `ActiveStatus` no es campo válido en SalesOrderQuery
- `EditSequence` obligatorio en Mod — obtener con Query previo
- Fill Examples: datos reales de TEST con ListIDs válidos

**`SalesOrder-architect.md`**
- Flujo completo: formulario Redix → `POST /api/integration/qb-playground` → backend RIQ → LedgerOps N8N → LedgerBridge → qbxmlIntegrator → QB Desktop
- Contratos dinámicos: el frontend consume `GET /webhook/contracts?type=SalesOrderAdd&sede=TEST`
- Timeout: frontend 20s (AbortSignal) · backend 15s hacia LedgerOps
- Diferencia Add vs Mod: Mod requiere `TxnID` + `EditSequence` del QB

**`SalesOrder-qa.md`**
- Tabla con mínimo 6 casos de prueba:
  - TC-01: SalesOrderQuery — Fill Examples → Send → lista retornada
  - TC-02: SalesOrderAdd — Fill Examples + datos → Send → TxnID en respuesta
  - TC-03: SalesOrderMod — Query → obtener TxnID + EditSequence → modificar → Send → confirmación
  - TC-04: Negativo — RefNumber > 11 caracteres → QB-3070
  - TC-05: Negativo — CustomerRef.ListID inválido → QB-3100
  - TC-06: Negativo — timeout simulado (agente lento) → botón se libera en ≤20s
- Sedes a probar: todas las operaciones en TEST, solo Query en RUS/REC/RBR/RMX

**`SalesOrder-support.md`**
- Tabla de errores comunes:
  - QB-3070: RefNumber demasiado largo — truncar a 11 caracteres
  - QB-3100: ListID no encontrado — ejecutar Query en la misma sede para obtener ListID válido
  - QB-3120: EditSequence desactualizado — ejecutar Query para obtener el EditSequence actual
  - LB-VALIDATION-MISSING_REQUIRED: campo obligatorio vacío — revisar checklist de campos requeridos
  - Botón Send inactivo: verificar conexión; si persiste, recargar página
  - MISSING-DATA: `CustomerRef.ListID` o `ItemRef.ListID` corresponde a otra sede — no son portables

---

## Respuesta esperada de RIQ

Entregar a SyncBridge los 5 archivos Markdown completos:
1. `SalesOrder-executive.md`
2. `SalesOrder-developer.md`
3. `SalesOrder-architect.md`
4. `SalesOrder-qa.md`
5. `SalesOrder-support.md`

SyncBridge generará un PROMPT-LO para que LedgerOps los publique en `docs/qb-playground/`.

---

## Nota sobre entidades anteriores

Las entidades Vendor, Customer e ItemInventory también necesitan los 5 docs por rol. Esto se abordará en PROMPTs separados una vez completado el backfill de SalesOrder.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-07 | Emisión | PROMPT emitido — establece estándar de 5 docs por rol para entidades QB Playground + solicita backfill SalesOrder |
| 2026-04-07 | Resolución | RIQ generó los 5 docs de SalesOrder · commit 362c890 · contenido enviado a LO via PROMPT-LO-027 |

