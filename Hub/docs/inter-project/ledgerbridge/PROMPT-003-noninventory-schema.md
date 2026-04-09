# PROMPT-003 — Schema para ItemNonInventoryAdd (y tipos no cargados)

| Campo | Valor |
|---|---|
| **Proyecto** | LedgerBridge |
| **Tipo** | feature |
| **Entidad** | ItemNonInventoryAdd (y todos los tipos QBXML sin source XML) |
| **Detectado** | 2026-03-17 — P2 ItemNonInventoryAdd, describe endpoint retorna `hasDescribe: false` |
| **Estado** | ✅ solved — 2026-03-18 |
| **Monday** | ver subitems bajo `SyncBridge \| LedgerBridge` (item `11506881476`) |
| **Índice** | [← Volver al índice maestro](../README.md) |

---

## Hallazgo

Al intentar avanzar en el ciclo P1-P4 de `ItemNonInventoryAdd`, se descubrió que
LedgerBridge no tiene el schema (`describe.json`) para este tipo:

```bash
POST /webhook/describe
{"type": "ItemNonInventoryAdd", "sede": "TEST", "version": "17.0"}
# Respuesta:
{"ok": true, "code": "LB-DESCRIBE-OK", "hasDescribe": false, "requiredCorePaths": null}
```

El `lb-describe-regen-all.sh` generado en PROMPT-002 regeneró 243 tipos, pero solo
los que ya tenían un source XML cargado. `ItemNonInventoryAdd` (y potencialmente otros
tipos del roadmap) no tienen source XML en el servidor de LedgerBridge.

Sin el schema:
- `GenerateContract` no puede construir el contrato informativo
- `LedgerBridge` no puede validar campos requeridos (Intuit + sede)
- `LedgerBridge` no puede construir el QBXML para enviar a QB Desktop
- P4 Testing queda bloqueado

---

## Tipos afectados (roadmap LedgerOps)

Los siguientes tipos están en el roadmap y pueden estar en la misma situación.
Verificar cuáles tienen describe.json y cuáles necesitan source XML:

| Tipo | Prioridad |
|---|---|
| ItemNonInventoryAdd | 2 🔨 |
| ItemNonInventoryMod | 2 🔨 |
| ItemServiceAdd | 3 🔨 |
| ItemServiceMod | 3 🔨 |
| CustomerAdd | 4 🔨 |
| VendorAdd | 5 🔨 |
| SalesOrderAdd | 6 ⬜ |
| PurchaseOrderAdd | 7 🔨 |
| InvoiceAdd | 8 🔨 |
| BillAdd | 9 🔨 |
| BillMod | 9 🔨 |
| CreditCardChargeAdd | 13 🔨 |

---

## Acción solicitada

1. **Identificar qué tipos tienen source XML** — listar todos los tipos en `source-xml/`
   con su versión disponible.

2. **Cargar source XML faltantes** — para los tipos del roadmap LedgerOps que no tengan
   source XML, cargarlos desde el QBXML SDK (misma fuente que se usó para ItemInventoryAdd).

3. **Regenerar describe.json** — ejecutar `lb-describe-regen-all.sh` para generar los
   schemas de los tipos nuevamente cargados.

4. **Verificar con describe endpoint** — confirmar que cada tipo del roadmap responde
   `hasDescribe: true` con sus `requiredCorePaths` correctos.

---

## Reporte de salida solicitado

```
ESTADO: [Completado / Parcial / Bloqueado]

TIPOS CON SOURCE XML (antes de esta tarea):
- [lista]

TIPOS CARGADOS EN ESTA TAREA:
- [tipo] → source XML: [archivo] → describe generado: [sí/no]

TIPOS DEL ROADMAP SIN SCHEMA (si quedan):
- [tipo] → [motivo]

COMMITS:
- [hash] [descripción]

VERIFICACIÓN:
- ItemNonInventoryAdd describe: [hasDescribe: true/false]
- requiredCorePaths de ItemNonInventoryAdd: [lista]
- ¿Todos los tipos del roadmap tienen schema? [Sí / No — faltantes]
```

---

## Resolución parcial — LB-Audit 2026-03-18

### Commits del LB-Audit
| Hash | Descripción |
|---|---|
| `c13315f` | 239 describe.json regenerados (fix BarCode, elementOrder poblado) |
| `74e644b` | 7 docs actualizados (módulos N8N, nuevas tools, URLs correctas) |
| `577e84c` | LB-Audit pendientes cerrados |

### Verificación post-LB-Audit (2026-03-18)
- `POST /webhook/describe` → `hasDescribe: false` ❌
- `POST /webhook/jsonin` → `404` ❌

**Conclusión:** El LB-Audit regeneró los 239 tipos que ya tenían source XML (corrigiendo BarCode y elementOrder). Los source XMLs faltantes para tipos nuevos del roadmap (`ItemNonInventoryAdd`, etc.) **aún no fueron cargados**. Pendiente confirmar con LedgerBridge.

### Resolución final — 2026-03-18

**Mecanismo:** workflow temporal `V8qTQx4OTXmHGdVL` (TEMP — Sync source-xml+describe from GitHub) ejecutó git sync de `source-xml/` y `describe/` desde GitHub → servidor. Workflow eliminado post-ejecución.

**Verificación — 12/12 tipos con schema:**

| Tipo | Estado | requiredCorePaths |
|---|---|---|
| ItemNonInventoryAdd | ✅ | 1 — Name |
| ItemNonInventoryMod | ✅ | 3 — ListID, EditSequence, Name |
| ItemServiceAdd | ✅ | 1 — Name |
| ItemServiceMod | ✅ | 3 — ListID, EditSequence, Name |
| CustomerAdd | ✅ | 6 — Name, IsActive, contactos, direcciones |
| VendorAdd | ✅ | 5 — Name, IsActive, contactos |
| SalesOrderAdd | ✅ | 7 — CustomerRef/ListID, líneas, grupos |
| PurchaseOrderAdd | ✅ | 5 — líneas y grupos |
| InvoiceAdd | ✅ | 10 — CustomerRef/ListID, líneas, créditos |
| BillAdd | ✅ | 10 — VendorRef/ListID, líneas expense/items |
| BillMod | ✅ | 2 — TxnID, EditSequence |
| CreditCardChargeAdd | ✅ | 9 — AccountRef/ListID, líneas expense/items |

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-17 | Emisión | PROMPT emitido a LedgerBridge — schemas faltantes para 12 tipos del roadmap sin source XML cargado |
| 2026-03-18 | Resolución | Git sync + workflow temporal cargó source XMLs; 12/12 tipos con `hasDescribe: true` — [ver resolución parcial](#resolución-parcial--lb-audit-2026-03-18) |
