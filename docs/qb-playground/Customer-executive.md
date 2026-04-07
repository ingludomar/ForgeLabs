# Customer — Resumen Ejecutivo

**Entidad:** `Customer`
**Operaciones:** Add · Mod · Query
**Audiencia:** Ejecutivo / Dirección
**Actualizado:** 2026-04-07

---

## ¿Qué es Customer en el contexto de Redix?

`Customer` representa a los clientes en QuickBooks Desktop. Es la entidad base que QB utiliza
en órdenes de venta, facturas y pagos. La integración Customer permite crear, modificar y
consultar clientes directamente en QB desde Redix, sin acceso al cliente de escritorio.

---

## ¿Qué permite el Playground?

- **Consultar** clientes existentes en cualquier sede para obtener ListIDs y verificar datos
- **Crear** nuevos clientes en TEST sin afectar producción
- **Modificar** datos de clientes en TEST para validar flujos
- **Diagnosticar** errores de integración antes de activar flujos automatizados en producción

---

## Estado de la integración

| Operación | Disponibilidad | Sedes activas |
|-----------|---------------|---------------|
| Consultar (Query) | ✅ Producción | TEST · RUS · REC · RBR · RMX |
| Crear (Add) | ✅ Validado en TEST | TEST |
| Modificar (Mod) | ✅ Validado en TEST | TEST |

---

## Valor operacional

- **Alta de clientes sincronizada**: los clientes registrados en Redix se crean automáticamente
  en QB, evitando captura doble entre el equipo comercial y contabilidad.
- **Datos consistentes para facturación**: los `ListID` de clientes obtenidos via Query son los
  mismos que se usan en `SalesOrderAdd` e `InvoiceAdd`, garantizando trazabilidad.
- **Cobertura multi-sede**: operación sobre las 5 compañías QB Desktop activas desde una sola
  integración.
- **Testing sin riesgo**: sede TEST para validar cualquier cambio antes de producción.

---

## Restricciones conocidas

| Restricción | Impacto |
|-------------|---------|
| `Name` debe ser único en QB | No puede haber dos clientes con el mismo nombre en la misma compañía |
| `CurrencyRef`, `SalesTaxCodeRef` específicos por sede | Los ListIDs de TEST no son válidos en producción |
| QB-3170 si el Name del Mod pertenece a otro cliente | No se pueden fusionar clientes vía API |
| `EditSequence` dinámico en Mod | Debe obtenerse fresco — no reutilizable entre sesiones |

---

## Próximos pasos sugeridos

- Integrar `CustomerAdd` con el flujo de alta de clientes de Redix para sincronización automática.
- Extender smoke tests de Add/Mod a sedes de producción con ListIDs locales.
- Mapear `SalesTaxCodeRef` por sede para automatizar la asignación de impuestos al crear clientes.
