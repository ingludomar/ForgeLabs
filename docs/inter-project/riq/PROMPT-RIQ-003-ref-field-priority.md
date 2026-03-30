# PROMPT-RIQ-003 — QB Playground · Lógica de prioridad en campos Ref

**Fecha:** 2026-03-30
**De:** SyncBridge
**Para:** RIQ (redix-integration-quickbooks)
**Tipo:** improvement
**Estado:** ✅ solved — 2026-03-30 · buildRef implementado · 4 casos verificados

---

## Problema identificado

El form permite ingresar `ListID` y `FullName` en cada campo Ref. Cuando el usuario llena ambos, el payload envía los dos valores. Esto genera dos problemas:

1. **Datos cruzados** — el usuario puede pegar un ListID de otro campo (ej. pegar el ListID de IncomeAccountRef en PrefVendorRef). QB lo acepta pero vincula la entidad incorrecta — error silencioso difícil de detectar.

2. **Redundancia innecesaria** — QB usa el `ListID` para identificar la entidad. El `FullName` es ignorado cuando el `ListID` está presente. Enviar ambos no aporta valor y añade ruido al payload.

---

## Lógica a implementar en el builder del payload

Para cada campo de tipo `ref`, aplicar esta prioridad al construir el objeto:

```
SI ListID tiene valor
  → incluir SOLO ListID (descartar FullName aunque tenga valor)
SINO SI FullName tiene valor
  → incluir SOLO FullName (sin ListID)
SINO
  → excluir el Ref completo (ya manejado por pruneEmpty)
```

### Pseudocódigo

```typescript
function buildRef(listId: string, fullName: string): object | null {
  if (listId && listId.trim() !== '') {
    return { ListID: listId };          // ListID tiene prioridad absoluta
  }
  if (fullName && fullName.trim() !== '') {
    return { FullName: fullName };      // Solo si no hay ListID
  }
  return null;                          // Campo vacío — excluir
}
```

### Resultado esperado en el payload

| ListID | FullName | Resultado en JSON |
|---|---|---|
| `80000078-1597178857` | `Sales` | `{ "ListID": "80000078-1597178857" }` |
| *(vacío)* | `Sales` | `{ "FullName": "Sales" }` |
| `80000078-1597178857` | *(vacío)* | `{ "ListID": "80000078-1597178857" }` |
| *(vacío)* | *(vacío)* | Ref excluido completo |

---

## Justificación técnica

**¿Por qué ListID tiene prioridad?**

QB Desktop usa el `ListID` como identificador único e inmutable de cada entidad (cuenta, vendor, item, etc.). El `FullName` puede cambiar, puede tener duplicados en sub-niveles, y puede contener caracteres especiales que causan `QB-PARSE-ERROR` (pipes `|`, dos puntos `:`, paréntesis).

LedgerBridge está diseñado para trabajar con `ListID` — cuando recibe un Ref con ListID, lo usa directamente sin búsqueda adicional. Cuando recibe solo FullName, hace una búsqueda interna que puede fallar si el nombre no coincide exactamente.

**Regla de oro para el playground:** Si el usuario tiene el ListID, úsalo. Si no, FullName como fallback.

---

## Caso especial — FullName con sub-niveles

QB usa `:` para separar niveles en FullName jerárquicos:
```
"Goods MDSE.(Domestic Sales):MX| Sales"
```

Este tipo de FullName contiene caracteres especiales que QB-PARSE-ERROR si no están formateados exactamente. Por eso ListID es siempre más seguro.

**Recomendación adicional:** En el form, cuando el usuario ingresa solo FullName sin ListID, mostrar un aviso visual indicando que el valor debe coincidir exactamente con el nombre en QuickBooks.

---

## Verificación

Después de implementar, repetir el test `ItemInventoryAdd` con el siguiente caso:

- `IncomeAccountRef`: ListID = `80000078-1597178857`, FullName = `Sales`
- `COGSAccountRef`: ListID = `8000007C-1597178857`, FullName = `Cost of Goods Sold`
- `AssetAccountRef`: ListID = `80000034-1597178856`, FullName = `Inventory Asset`
- `SalesTaxCodeRef`: ListID = `80000001-1597174715`, FullName = `Tax`
- `PrefVendorRef`: ListID = `800001EA-1597178964`, FullName = *(vacío)*

**JSON Output esperado:**
```json
{
  "IncomeAccountRef": { "ListID": "80000078-1597178857" },
  "COGSAccountRef": { "ListID": "8000007C-1597178857" },
  "AssetAccountRef": { "ListID": "80000034-1597178856" },
  "SalesTaxCodeRef": { "ListID": "80000001-1597174715" },
  "PrefVendorRef": { "ListID": "800001EA-1597178964" }
}
```

Ningún Ref debe incluir `FullName` si tiene `ListID`. Reportar JSON Output completo a SyncBridge para verificación antes de hacer Send.
