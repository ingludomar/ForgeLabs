# Vendor — Resumen Ejecutivo

**Entidad:** `Vendor`
**Operaciones:** Add · Mod · Query
**Audiencia:** Ejecutivo / Dirección
**Actualizado:** 2026-04-07

---

## ¿Qué es Vendor en el contexto de Redix?

`Vendor` es la entidad que representa a los proveedores en QuickBooks Desktop. Cada proveedor
tiene un registro único vinculado a la moneda, los términos de pago y las direcciones de
facturación que QB utiliza en las órdenes de compra y pagos. La integración Vendor permite crear,
modificar y consultar proveedores directamente en QB desde Redix, sin necesidad de acceder al
cliente de escritorio.

---

## ¿Qué permite el Playground?

El QB Playground es la herramienta de verificación en tiempo real de la integración. Permite:

- **Consultar** proveedores existentes en cualquier sede para obtener ListIDs y datos actuales
- **Crear** nuevos proveedores en la sede TEST sin riesgo de afectar producción
- **Modificar** datos de proveedores en TEST para verificar el flujo completo
- **Diagnosticar** errores de integración antes de activar flujos automatizados

---

## Estado de la integración

| Operación | Disponibilidad | Sedes activas |
|-----------|---------------|---------------|
| Consultar (Query) | ✅ Producción | TEST · RUS · REC · RBR · RMX |
| Crear (Add) | ✅ Validado en TEST | TEST |
| Modificar (Mod) | ✅ Validado en TEST | TEST |

---

## Valor operacional

- **Catálogo sincronizado**: los proveedores creados o modificados en Redix se reflejan
  automáticamente en QB, eliminando la doble captura en el equipo de compras y contabilidad.
- **Cobertura multi-sede**: una sola integración opera sobre las 5 empresas QB Desktop activas.
- **Auditoría en tiempo real**: cada Query retorna el estado actual del proveedor en QB,
  incluyendo `EditSequence`, permitiendo detectar cambios no originados en Redix.
- **Testing sin riesgo**: la sede TEST permite validar flujos completos sin tocar datos de
  producción.

---

## Restricciones conocidas

| Restricción | Impacto |
|-------------|---------|
| `Name` debe ser único en QB | No se pueden crear dos proveedores con el mismo nombre en la misma compañía |
| `CurrencyRef.ListID` específico por sede | El ListID de USD en TEST no es válido en RUS/REC/RBR/RMX |
| `IsActive` requerido en Add | QB rechaza el Add si no se incluye — la integración lo maneja automáticamente |
| `EditSequence` dinámico en Mod | Debe obtenerse fresco con un Query previo — no puede reutilizarse |

---

## Próximos pasos sugeridos

- Extender smoke tests de Add/Mod a sedes de producción con CurrencyRef locales.
- Integrar `VendorAdd` con el flujo de alta de proveedores de Redix para sincronización automática.
- Configurar templates por sede para simplificar el formulario en el Playground.
