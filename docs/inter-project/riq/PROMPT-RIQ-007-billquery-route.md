# PROMPT-RIQ-007 — QB Playground · BillQuery — ruta faltante

**Fecha:** 2026-03-30
**Tipo:** bug
**Estado:** ✅ solved

---

## Problema

`BillQuery` no está registrado en `QB_ACTIONS` ni tiene ruta en `qb-endpoints.ts`. TC-PUR-04 falla con `QB-OPERATION-ERROR` — la operación no llega a LedgerOps.

Adicionalmente, el `TxnID` de ejemplo `100D-1597526169` ya no existe en QB Desktop. Se reemplaza abajo.

---

## Acción requerida

### 1. Registrar BillQuery en qb-endpoints.ts

Agregar la entrada correspondiente al endpoint de LedgerOps para BillQuery. Seguir el mismo patrón que las demás operaciones Query del módulo Purchasing.

### 2. TxnID de ejemplo actualizado

Para TC-PUR-04, usar el `TxnID` obtenido en TC-PUR-03 (BillAdd) una vez que ese TC pase. Si se necesita un TxnID fijo de referencia en TEST, ejecutar un BillQuery por `VendorRef.ListID = "800001F1-1597178964"` para obtener un TxnID válido.

---

## Verificación

Confirmar a SyncBridge:
1. `BillQuery` aparece en el routing table
2. TC-PUR-04 ejecuta correctamente y retorna `BillRet.VendorRef.ListID = "800001F1-1597178964"`
