# ItemInventory — Resumen Ejecutivo

**Entidad:** `ItemInventory`
**Operaciones:** Add · Mod · Query
**Audiencia:** Ejecutivo / Dirección
**Actualizado:** 2026-04-07

---

## ¿Qué es ItemInventory en el contexto de Redix?

`ItemInventory` representa los artículos de inventario rastreados en QuickBooks Desktop. Es la
entidad central del catálogo de productos — cada artículo tiene precio de venta, costo de compra
y está vinculado a tres cuentas contables (ingresos, COGS y activo de inventario). La integración
permite crear, modificar y consultar artículos directamente en QB desde Redix.

---

## ¿Qué permite el Playground?

- **Consultar** el catálogo de artículos en cualquier sede — incluyendo ListIDs, precios y
  cuentas contables asociadas
- **Crear** nuevos artículos en TEST para validar el flujo completo antes de producción
- **Modificar** artículos existentes en TEST (precio, descripción, cuentas)
- **Diagnosticar** errores de catálogo antes de activar sincronización automática

---

## Estado de la integración

| Operación | Disponibilidad | Sedes activas |
|-----------|---------------|---------------|
| Consultar (Query) | ✅ Producción | TEST · RUS · REC · RBR · RMX |
| Crear (Add) | ✅ Validado en TEST | TEST |
| Modificar (Mod) | ✅ Validado en TEST | TEST |

> **Nota REC:** Query retorna 569 artículos activos. Usar `MaxReturned` para evitar timeouts.

---

## Valor operacional

- **Catálogo sincronizado**: los artículos creados en Redix se reflejan en QB, garantizando
  que las órdenes de compra y venta referencien ítems válidos con las cuentas contables correctas.
- **Trazabilidad contable**: cada artículo vincula automáticamente las transacciones a las cuentas
  de ingresos, COGS y activo — sin configuración manual en QB.
- **Auditoría de inventario**: el Query permite verificar en tiempo real el estado de cualquier
  artículo en cualquier sede, incluyendo precios vigentes y cantidades en stock.
- **Testing sin riesgo**: la sede TEST permite validar altas y modificaciones sin afectar el
  inventario de producción.

---

## Restricciones conocidas

| Restricción | Impacto |
|-------------|---------|
| `Name` debe ser único en QB | No pueden existir dos artículos con el mismo nombre en la compañía |
| `IncomeAccountRef`, `COGSAccountRef`, `AssetAccountRef` específicos por sede | Las cuentas contables tienen ListIDs distintos en cada compañía QB |
| No confundir con `ItemNonInventory` o `ItemService` | Son entidades distintas en QB — ListIDs no son intercambiables |
| Query sin filtros retorna `MISSING-DATA` | Siempre incluir al menos `ActiveStatus` o `MaxReturned` |
| REC tiene 569 artículos — usar `MaxReturned` | Sin este filtro el Query puede superar el timeout de 25s |

---

## Próximos pasos sugeridos

- Integrar `ItemInventoryAdd` con el flujo de alta de productos de Redix para sincronización automática.
- Mapear `IncomeAccountRef`, `COGSAccountRef` y `AssetAccountRef` por sede para automatizar
  la asignación contable al crear artículos.
- Configurar templates por sede para simplificar el formulario del Playground.
