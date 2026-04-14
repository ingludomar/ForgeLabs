# PROMPT-RIQ-034 — Inventory Site · Fix hasContract en contracts.ts

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-13 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved |

---

## Contexto

En PROMPT-RIQ-033 se registraron las tres acciones de InventorySite en `QB_ACTIONS` con `hasContract: false`.
Esto es incorrecto: cuando `hasContract: false` el Playground no hace fetch al endpoint de LO (`GET /webhook/contracts?type=X&sede=Y`) y el formulario aparece vacío — sin campos.

El workflow de LO (`InventorySiteAdd`) ya está activo. LedgerBridge ya tiene los schemas v17.0 y v13.0 para InventorySite (PROMPT-018 ✅). El endpoint de contratos puede servir los campos correctamente.

La misma lógica aplica para Add y Mod — ambas operaciones requieren campos dinámicos por sede.
Query puede quedar estático (`hasContract: false`) con los campos ya definidos en `inventorySiteQueryFields`.

---

## Cambio requerido

**Archivo:** `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts`

En el array `QB_ACTIONS`, localizar las tres líneas de InventorySite y cambiar:

```typescript
// Antes
{ id: 'InventorySiteAdd',   ..., hasContract: false, ... },
{ id: 'InventorySiteMod',   ..., hasContract: false, ... },
{ id: 'InventorySiteQuery', ..., hasContract: false, ... },

// Después
{ id: 'InventorySiteAdd',   ..., hasContract: true,  ... },
{ id: 'InventorySiteMod',   ..., hasContract: true,  ... },
{ id: 'InventorySiteQuery', ..., hasContract: false,  ... },
```

Solo cambia el valor de `hasContract` en Add y Mod. El resto de la línea permanece igual.

---

## Verificación

Con la app corriendo, seleccionar `Inventory Site — Add` en sede TEST:
- El formulario debe mostrar campos dinámicos (Name, IsActive, SiteDesc, etc.)
- No debe aparecer vacío

---

## Acción requerida

1. Aplicar el cambio en `contracts.ts`
2. Hacer commit en la rama activa
3. Confirmar a ForgeLabs Hub con el hash del commit

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-13 | Emisión | hasContract: false incorrecto para InventorySiteAdd/Mod — formulario vacío en Playground |
| 2026-04-13 | Resolución | Add/Mod ya tenían true desde RIQ-033 · Query corregido de true → false — commit 05fb42f |
