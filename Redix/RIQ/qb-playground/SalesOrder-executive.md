# Sales Order — Resumen Ejecutivo

**Entidad:** `SalesOrder` (Orden de Venta)
**Audiencia:** Dirección / Mike Habib
**Actualizado:** 2026-04-07

---

## ¿Qué es una Orden de Venta?

Una Orden de Venta (`SalesOrder`) en QuickBooks Desktop es el documento que registra el **compromiso comercial con un cliente antes de que los bienes sean despachados o facturados**. Es el paso previo a la factura (`Invoice`): establece qué se va a vender, en qué cantidad, a qué precio, y bajo qué condiciones de pago y envío.

En el ciclo operativo, el flujo típico es:

```
Orden de Venta (SalesOrder)  →  Despacho  →  Factura (Invoice)
```

Cada orden queda registrada en QB Desktop con un número de referencia visible para el cliente (`RefNumber`) y un identificador interno único (`TxnID`) que permite rastrearla, modificarla y vincularla con documentos posteriores.

---

## ¿Qué permite el QB Playground?

El **QB Playground** es el módulo de integración de Redix que permite interactuar directamente con QuickBooks Desktop desde el sistema Redix, sin necesidad de abrir ni operar QB Desktop manualmente.

Para la entidad Sales Order, el Playground habilita tres operaciones:

| Operación | Descripción |
|-----------|-------------|
| **Query** | Consultar órdenes existentes en QB Desktop — por ID, fecha, cliente o número de referencia |
| **Add** | Crear una nueva orden de venta directamente en QB Desktop desde Redix |
| **Mod** | Modificar una orden existente (fecha, notas, líneas de detalle, condiciones de envío, etc.) |

Esto elimina la necesidad de doble captura de datos y reduce el margen de error operativo al centralizar la creación y consulta de órdenes en Redix.

---

## Valor operativo

- **Agilidad en verificación:** Los equipos pueden consultar el estado de una orden en QB Desktop en tiempo real desde Redix, sin cambiar de sistema ni solicitar capturas de pantalla al área de administración.
- **Pruebas de integración:** Permite validar que el canal de comunicación Redix → QB Desktop está operativo antes de procesar documentos de producción.
- **Auditoría de datos en tiempo real:** Las respuestas de QB incluyen `TxnID`, `EditSequence`, fechas y líneas de detalle — información suficiente para auditar el estado exacto de una orden en cualquier momento.
- **Control de concurrencia:** El mecanismo de `EditSequence` garantiza que dos usuarios no sobreescriban simultáneamente la misma orden sin advertencia.

---

## Sedes disponibles

El Playground opera contra cinco sedes de QuickBooks Desktop:

| Sede | Descripción |
|------|-------------|
| **TEST** | Entorno de pruebas — operaciones completas habilitadas |
| **RUS** | Producción |
| **REC** | Producción |
| **RBR** | Producción |
| **RMX** | Producción |

---

## Estado de operaciones por sede

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|:----:|:---:|:---:|:---:|:---:|
| **Query** (consultar) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Add** (crear) | ✅ | — | — | — | — |
| **Mod** (modificar) | ✅ | — | — | — | — |

> Las sedes de producción (RUS, REC, RBR, RMX) están habilitadas únicamente para **consulta (Query)**. Las operaciones de escritura (Add y Mod) se ejecutan exclusivamente en TEST para evitar impacto sobre datos de producción.

*Resultados de smoke tests: 2026-04-06 — todas las sedes responden correctamente a Query; Add y Mod verificados en TEST.*
