# PROMPT-LO-036 — Inventory Site · Documentación por rol (QB Playground)

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-14 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | docs |
| **Estado** | 🔵 pending |

---

## Contexto

El feature **Inventory Site QB Playground** (Tipo 2 — F4) ha completado F3 con éxito:

- InventorySiteAdd · InventorySiteQuery · InventorySiteMod verificados en TEST (CRUD completo)
- InventorySiteQuery verificado en RBR · RMX
- RUS descartado — QB-3250 (Advanced Inventory no habilitado en esa instancia)
- REC · RRC · TSI bloqueadas por conflicto de red (pendiente resolución con Jack)

Campos descartados: `MaxReturned` causa QB-PARSE-ERROR en InventorySiteQuery — no incluir en payloads.

Se requiere crear los 6 archivos de documentación por rol bajo `docs/integration/`.

---

## Acción requerida

Crear los siguientes 6 archivos exactamente con el contenido especificado:

---

### 1. `docs/integration/executive/InventorySite.md`

```markdown
# Inventory Site — Resumen Ejecutivo

## ¿Qué es?

La integración de **Inventory Site** (Almacén / Ubicación de Inventario) permite crear,
consultar y modificar ubicaciones de almacén en QuickBooks Desktop desde cualquier sistema
externo, sin acceso directo a QB ni intervención manual del equipo contable.

## Valor para el negocio

| Beneficio | Descripción |
|---|---|
| **Gestión centralizada de almacenes** | Crear y mantener ubicaciones de inventario desde Redix sin abrir QB |
| **Cero intervención manual** | El pipeline valida, construye y ejecuta el XML en QB automáticamente |
| **Trazabilidad completa** | Cada operación queda registrada con ListID, timestamps y EditSequence |
| **Multi-sede** | Una sola API atiende todas las sedes con reglas de negocio diferenciadas |

## Operaciones disponibles

| Operación | Descripción |
|---|---|
| **Add** | Registra una nueva ubicación de almacén en QB |
| **Query** | Consulta ubicaciones existentes por FullName, ListID u otros filtros |
| **Mod** | Modifica una ubicación existente (requiere ListID + EditSequence vigente) |

## Sedes verificadas

| Sede | Estado |
|---|---|
| TEST | ✅ Verificada — CRUD completo |
| RBR (Redsis Brasil) | ✅ Verificada — Query confirmado |
| RMX (Redsis México) | ✅ Verificada — Query confirmado (QB 2021, QBXML v13.0) |
| RUS (Redsis US) | ❌ No disponible — Advanced Inventory no habilitado (QB-3250) |
| REC (Redsis Ecuador) | ⏳ Pendiente — conflicto de red en resolución |
| RRC | ⏳ Pendiente — conflicto de red en resolución |
| TSI | ⏳ Pendiente — conflicto de red en resolución |

## Dependencias técnicas

- LedgerBridge v1.0.1
- LedgerExec v1.0.0
- qbxmlIntegrator v1.0.0
```

---

### 2. `docs/integration/developer/InventorySite.md`

```markdown
# Inventory Site — Referencia para Desarrolladores

## Endpoints

| Operación | Método | URL |
|---|---|---|
| Add | POST | `https://n8n-development.redsis.ai/webhook/inventory/site/add` |
| Mod | POST | `https://n8n-development.redsis.ai/webhook/inventory/site/mod` |
| Query | POST | `https://n8n-development.redsis.ai/webhook/inventory/site/query` |

## Versión QBXML por sede

| Sede | Versión |
|---|---|
| TEST · RBR · REC · RRC · TSI | `"17.0"` |
| RMX | `"13.0"` |
| RUS | ❌ No disponible (Advanced Inventory no habilitado) |

Si se omite `version`, el sistema usa `"17.0"` por defecto.

---

## InventorySiteAdd

### Payload

```json
{
  "type": "InventorySiteAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "Name": "RDX-SITE-001",
    "IsActive": "true",
    "SiteDesc": "Almacén principal de prueba"
  }
}
```

### Campos requeridos por sede — InventorySiteAdd

| Campo | TEST · RBR · RMX | Fuente |
|---|---|---|
| `Name` | ✅ | Intuit |

### Respuesta exitosa

```json
{
  "success": true,
  "data": {
    "InventorySiteRet": {
      "ListID": "8000002C-1776115152",
      "EditSequence": "1776115152",
      "Name": "RDX-SITE-001",
      "IsActive": "true"
    }
  }
}
```

---

## InventorySiteMod

### Payload

```json
{
  "type": "InventorySiteMod",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ListID": "8000002C-1776115152",
    "EditSequence": "1776115152",
    "Name": "RDX-SITE-001-A"
  }
}
```

> **Importante:** `InventorySiteMod` usa `ListID` como identificador (no `TxnID`) — es una entidad de lista.
> Ejecutar `InventorySiteQuery` primero para obtener `ListID` y `EditSequence` actuales.

### Respuesta exitosa

```json
{
  "success": true,
  "data": {
    "InventorySiteRet": {
      "ListID": "8000002C-1776115152",
      "EditSequence": "1776115172",
      "Name": "RDX-SITE-001-A",
      "IsActive": "true"
    }
  }
}
```

---

## InventorySiteQuery

### Payload

```json
{
  "type": "InventorySiteQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "FullName": "RDX-SITE-001-A"
  }
}
```

> **Nota:** `MaxReturned` no es un filtro válido para `InventorySiteQuery` — causa QB-PARSE-ERROR. No incluirlo.
> Filtros válidos: `FullName`, `ListID`, `ActiveStatus`.

### Respuesta exitosa

```json
{
  "success": true,
  "data": {
    "InventorySiteRet": {
      "ListID": "8000002C-1776115152",
      "EditSequence": "1776115172",
      "Name": "RDX-SITE-001-A",
      "IsActive": "true"
    }
  }
}
```

---

## Errores comunes

| Código | Causa | Solución |
|---|---|---|
| `QB-PARSE-ERROR` | Campo no soportado (ej. `MaxReturned`) | Omitir el campo del payload |
| `QB-3100` | ListID inválido | Ejecutar Query para obtener ListID vigente |
| `QB-3120` | EditSequence desactualizado | Ejecutar Query para obtener EditSequence vigente |
| `QB-3170` | Nombre duplicado en Add | Usar un nombre único |
| `QB-3250` | Advanced Inventory no habilitado | Esta sede no soporta InventorySite |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido ausente | Verificar que `Name` esté en el payload |

## Timeouts

- Frontend: 20 segundos (`AbortSignal.timeout(20_000)`)
- Backend LedgerOps: 15 segundos
```

---

### 3. `docs/integration/architect/InventorySite.md`

```markdown
# Inventory Site — Referencia para Arquitectos

## Flujo de la operación

```
Redix (browser)
  → POST /api/integration/qb-playground (RIQ backend)
  → POST https://n8n-development.redsis.ai/webhook/inventory/site/{add|mod|query} (LedgerOps N8N)
  → POST /webhook/ledgerexec (LedgerExec N8N)
  → SSH → LedgerBridge (Python) → QBXML build + validate
  → qbxmlIntegrator (win32com) → QB Desktop
  → Response chain inversa → Redix UI
```

## Contratos dinámicos

`InventorySiteAdd` y `InventorySiteMod` usan contratos dinámicos — el UI llama a LO para obtener los campos por sede:

```
GET /api/integration/qb-contracts?type=InventorySiteAdd&sede=TEST
```

`InventorySiteQuery` usa campos estáticos definidos en `contracts.ts` (`hasContract: false`).

## Versiones QBXML

| Versión | Sedes |
|---|---|
| v17.0 | TEST · RBR · REC · RRC · TSI |
| v13.0 | RMX (QB Desktop 2021) |

## Entidad de lista vs. transacción

`InventorySite` es una entidad de **lista** (no transacción):
- Identificador: `ListID` (no `TxnID`)
- `MOD_QUERY_MAP` en RIQ usa `idField: 'ListID'`
- El botón "Obtener EditSequence" en el Playground hace `InventorySiteQuery` por `ListID`

## Restricción de módulo QB

`InventorySite` requiere el módulo **Advanced Inventory** de QuickBooks Enterprise.
Sedes sin el módulo retornan QB-3250. RUS no tiene el módulo habilitado.

## Control de concurrencia

`EditSequence` es el mecanismo de control de concurrencia de QB Desktop.
Cada Mod exitoso incrementa el valor — siempre obtener el EditSequence vigente con Query antes de Mod.
```

---

### 4. `docs/integration/qa/InventorySite.md`

```markdown
# Inventory Site — Casos de Prueba

## Casos positivos

| ID | Operación | Sede | Payload | Resultado esperado |
|---|---|---|---|---|
| TC-IS-01 | Query (sin filtros) | TEST | `{}` | `success: true` · lista de sites |
| TC-IS-02 | Query conectividad | RBR · RMX | `{"ActiveStatus":"All"}` | `success: true` |
| TC-IS-03 | Add | TEST | `{"Name":"RDX-SITE-QA","IsActive":"true"}` | `success: true` · ListID retornado |
| TC-IS-04 | Query por FullName | TEST | `{"FullName":"RDX-SITE-QA"}` | `success: true` · EditSequence retornado |
| TC-IS-05 | Mod | TEST | `{"ListID":"<del paso anterior>","EditSequence":"<del paso anterior>","Name":"RDX-SITE-QA-MOD"}` | `success: true` |

## Casos negativos

| ID | Operación | Payload | Resultado esperado |
|---|---|---|---|
| TC-IS-N01 | Query con MaxReturned | `{"MaxReturned":"1"}` | `QB-PARSE-ERROR` |
| TC-IS-N02 | Mod con EditSequence desactualizado | EditSequence anterior al último Mod | `QB-3120` |
| TC-IS-N03 | Mod con ListID inválido | `{"ListID":"INVALID","EditSequence":"123"}` | `QB-3100` |
| TC-IS-N04 | Add con Name duplicado | Name ya existente en QB | `QB-3170` |
| TC-IS-N05 | Query en RUS | `{"ActiveStatus":"All"}` | `QB-3250` |

## Notas

- Ejecutar siempre en orden: Add → Query → Mod
- `MaxReturned` no es filtro válido — causa QB-PARSE-ERROR
- RUS no soporta InventorySite (Advanced Inventory no habilitado)
- Lista vacía en Query de sedes productivas es resultado válido
```

---

### 5. `docs/integration/support/InventorySite.md`

```markdown
# Inventory Site — Guía de Soporte

## Errores comunes y soluciones

### QB-PARSE-ERROR
**Mensaje:** `No se encontro QBXMLMsgsRs en la respuesta`
**Causa más común:** Campo no soportado en el payload — el caso más frecuente es `MaxReturned` en InventorySiteQuery.
**Solución:** Eliminar `MaxReturned` del payload. Filtros válidos: `FullName`, `ListID`, `ActiveStatus`.

### QB-3100 — ListID inválido
**Mensaje:** `Invalid list ID`
**Causa:** El `ListID` no existe en esta sede de QB.
**Solución:** Ejecutar `InventorySiteQuery` sin filtros para obtener los ListIDs vigentes.

### QB-3120 — EditSequence desactualizado
**Mensaje:** `The EditSequence is out of date`
**Causa:** Otro proceso modificó el registro después de la última Query.
**Solución:** Ejecutar `InventorySiteQuery` para obtener el EditSequence actualizado y reintentar el Mod.

### QB-3170 — Nombre duplicado
**Mensaje:** `Name already exists`
**Causa:** Ya existe un Inventory Site con ese nombre en QB.
**Solución:** Usar un nombre distinto en el Add.

### QB-3250 — Feature no disponible
**Mensaje:** `This feature is not enabled or not available in this version of QuickBooks`
**Causa:** La sede no tiene el módulo Advanced Inventory habilitado.
**Solución:** Esta sede no soporta InventorySite. Verificar con el administrador de QB si el módulo puede habilitarse.

### LB-VALIDATION-MISSING_REQUIRED
**Causa:** El campo `Name` está ausente en InventorySiteAdd.
**Solución:** Incluir `Name` en el payload.

### Botón Run bloqueado
**Causa:** La respuesta tardó más de 20 segundos.
**Solución:** Recargar la página e intentar nuevamente. Si persiste, verificar conectividad con N8N.
```

---

### 6. `docs/integration/quickstart/InventorySite.md`

```markdown
# Inventory Site — Guía de Inicio Rápido

## Acceso

Configuración → Integraciones → QB Playground → Inventory → Inventory Site

## Add — Crear una ubicación

```json
{
  "type": "InventorySiteAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "Name": "RDX-SITE-001",
    "IsActive": "true"
  }
}
```

Guarda el `ListID` de la respuesta para usarlo en Mod.

## Query — Consultar ubicaciones

```json
{
  "type": "InventorySiteQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "FullName": "RDX-SITE-001"
  }
}
```

> No usar `MaxReturned` — causa error. Filtros válidos: `FullName`, `ListID`, `ActiveStatus`.

## Mod — Modificar una ubicación

1. Ejecutar Query para obtener `ListID` + `EditSequence`
2. Usar el botón **Obtener EditSequence** en el Playground

```json
{
  "type": "InventorySiteMod",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ListID": "8000002C-1776115152",
    "EditSequence": "1776115152",
    "Name": "RDX-SITE-001-UPDATED"
  }
}
```

## Sedes disponibles

| Sede | Add | Query | Mod |
|---|---|---|---|
| TEST | ✅ | ✅ | ✅ |
| RBR | — | ✅ | — |
| RMX | — | ✅ | — |
| RUS | — | ❌ QB-3250 | — |
```

---

## Verificación

Confirmar que los 6 archivos están en sus rutas correctas y hacer commit.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-14 | Emisión | Inventory Site QB Playground — 6 docs por rol listos para publicar en LO |
