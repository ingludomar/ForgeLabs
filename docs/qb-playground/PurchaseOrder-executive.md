# Purchase Order — Resumen Ejecutivo

**Entidad:** `PurchaseOrder`
**Operaciones:** Add · Mod · Query
**Audiencia:** Ejecutivo / Dirección
**Actualizado:** 2026-04-07

---

## ¿Qué es Purchase Order en el contexto de Redix?

`PurchaseOrder` es la integración que permite crear, modificar y consultar órdenes de compra
directamente en QuickBooks Desktop desde la plataforma Redix. Elimina la captura manual doble:
el equipo opera desde Redix y QB se actualiza automáticamente vía LedgerBridge.

---

## Estado de la integración

| Operación | Disponibilidad | Sedes activas |
|-----------|---------------|---------------|
| Consultar (Query) | ✅ Producción | TEST · RUS · REC · RBR · RMX |
| Crear (Add) | ✅ Validado en TEST | TEST |
| Modificar (Mod) | ✅ Validado en TEST | TEST |

> Smoke tests completados el 2026-04-07. CRUD verificado en sede TEST.
> Sedes de producción (RUS, REC, RBR, RMX) confirmadas operativas en Query.

---

## Valor de negocio

- **Eliminación de captura doble**: las órdenes de compra creadas en Redix fluyen automáticamente
  a QB sin intervención manual del equipo de contabilidad.
- **Trazabilidad en tiempo real**: cada PO tiene un `TxnID` único en QB, vinculable a facturas,
  recepciones y pagos dentro del mismo archivo QB Desktop.
- **Control de concurrencia**: el mecanismo de `EditSequence` previene modificaciones conflictivas
  cuando dos usuarios acceden al mismo registro.
- **Cobertura multi-sede**: una sola integración opera sobre las 5 empresas QB Desktop activas.

---

## Flujo de una orden de compra

```
Redix App → QB Playground / API → LedgerOps (N8N) → LedgerBridge → QB Desktop
```

1. El usuario genera o aprueba un PO en Redix.
2. Redix envía el payload al endpoint `/api/integration/qb-playground`.
3. LedgerOps enruta la petición al agente QB de la sede correspondiente.
4. LedgerBridge valida los campos y construye el XML QBXML.
5. QB Desktop registra el PO y retorna el `TxnID` y `EditSequence`.

---

## Restricciones conocidas

| Restricción | Impacto |
|-------------|---------|
| `RefNumber` máx. 11 caracteres | Los números de PO deben diseñarse dentro de este límite |
| `ExpectedDate` requerido en sede TEST | La plataforma lo genera automáticamente (+7 días) |
| ListIDs son específicos por empresa QB | No se puede reutilizar un ListID entre sedes |
| Query por TxnID no retorna líneas | Requiere Query general para ver detalle de ítems |

---

## Próximos pasos sugeridos

- Extender smoke tests de Add/Mod a sedes RUS, REC, RBR, RMX con ListIDs locales.
- Integrar `PurchaseOrderAdd` con el flujo de aprobación de compras de Redix.
- Configurar templates por sede para reducir los campos visibles en el Playground.
