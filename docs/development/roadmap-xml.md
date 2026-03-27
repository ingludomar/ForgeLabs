# SyncBridge — Roadmap XML · Catálogo completo por módulo ERP

> Clasificación de todas las entidades QB Desktop disponibles en el SDK QBXML.
> La versión requerida (13.0 / 17.0) depende de QB Desktop instalado en cada sede — no se documenta aquí.
> La prioridad refleja frecuencia de uso en operaciones de negocio típicas de un ERP.

---

## Leyenda

| Columna | Descripción |
|---|---|
| **Entidad** | Nombre funcional de la entidad en el negocio |
| **Tipo XML** | Prefijo del tipo en el SDK QBXML (sin sufijo Add/Mod/Query) |
| **Ops** | Operaciones disponibles en el SDK |
| **Estado** | ⬜ pendiente · 🔄 en curso · ✅ entregado |
| **Prioridad** | P1 = más urgente · P7 = menor urgencia |

---

## Módulo 1 — Inventario · Catálogo de ítems

> Catálogo maestro de productos y servicios que maneja QB.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 1 | Ítem de inventario | `ItemInventory` | Add · Mod · Query | P1 | ✅ |
| 2 | Ítem sin inventario | `ItemNonInventory` | Add · Mod · Query | P1 | ✅ |
| 3 | Servicio | `ItemService` | Add · Mod · Query | P1 | ✅ |
| 4 | Ensamblaje (catálogo) | `ItemInventoryAssembly` | Add · Mod · Query | P2 | ⬜ |
| 5 | Cargo adicional | `ItemOtherCharge` | Add · Mod · Query | P3 | ⬜ |
| 6 | Grupo de ítems | `ItemGroup` | Add · Mod · Query | P3 | ⬜ |
| 7 | Descuento | `ItemDiscount` | Add · Mod · Query | P3 | ⬜ |
| 8 | Activo fijo | `ItemFixedAsset` | Add · Mod · Query | P4 | ⬜ |
| 9 | Impuesto sobre ventas | `ItemSalesTax` | Add · Mod · Query | P4 | ⬜ |
| 10 | Grupo de impuestos | `ItemSalesTaxGroup` | Add · Mod · Query | P4 | ⬜ |
| 11 | Pago (ítem) | `ItemPayment` | Add · Mod · Query | P5 | ⬜ |
| 12 | Subtotal (ítem) | `ItemSubtotal` | Add · Mod · Query | P5 | ⬜ |
| 13 | Consulta genérica de ítems | `Item` | Query | P3 | ⬜ |

---

## Módulo 2 — Inventario · Operaciones

> Movimientos y gestión del inventario físico. Requiere QB Enterprise con Advanced Inventory.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 14 | Sitio de inventario | `InventorySite` | Add · Mod · Query | P1 | ✅ |
| 15 | Transferencia de inventario | `TransferInventory` | Add · Query | P1 | ✅ |
| 16 | Construcción de ensamblaje | `BuildAssembly` | Add · Mod · Query | P1 | ✅ |
| 17 | Ajuste de inventario | `InventoryAdjustment` | Add · Query | P2 | ⬜ |
| 18 | Recepción de ítems | `ItemReceipt` | Add · Mod · Query | P2 | ⬜ |
| 19 | Ítems por sitio | `ItemSites` | Query | P3 | ⬜ |
| 20 | Ensamblajes que se pueden construir | `ItemAssembliesCanBuild` | Query | P4 | ⬜ |

---

## Módulo 3 — Ventas

> Ciclo completo de ventas: cotización, orden, factura, cobro, devolución.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 21 | Orden de venta | `SalesOrder` | Add · Mod · Query | P1 | ✅ |
| 22 | Factura de venta | `Invoice` | Add · Mod · Query | P1 | ✅ |
| 23 | Recibo de venta | `SalesReceipt` | Add · Mod · Query | P2 | ⬜ |
| 24 | Cobro de cuenta por cobrar | `ReceivePayment` | Add · Mod · Query | P2 | ⬜ |
| 25 | Nota de crédito | `CreditMemo` | Add · Mod · Query | P2 | ⬜ |
| 26 | Estimado / Cotización | `Estimate` | Add · Mod · Query | P3 | ⬜ |
| 27 | Cargo a cliente | `Charge` | Add · Mod · Query | P4 | ⬜ |
| 28 | Reembolso con tarjeta (AR) | `ARRefundCreditCard` | Add · Query | P4 | ⬜ |
| 29 | Pagos por depositar | `ReceivePaymentToDeposit` | Query | P3 | ⬜ |

---

## Módulo 4 — Compras

> Ciclo completo de compras: orden, recepción, factura de proveedor, pago.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 30 | Orden de compra | `PurchaseOrder` | Add · Mod · Query | P1 | ✅ |
| 31 | Factura de proveedor | `Bill` | Add · Mod · Query | P1 | ✅ |
| 32 | Crédito de proveedor | `VendorCredit` | Add · Mod · Query | P2 | ⬜ |
| 33 | Pago de factura con cheque | `BillPaymentCheck` | Add · Query | P2 | ⬜ |
| 34 | Pago de factura con tarjeta | `BillPaymentCreditCard` | Add · Query | P3 | ⬜ |
| 35 | Facturas por pagar | `BillToPay` | Query | P2 | ⬜ |

---

## Módulo 5 — Tesorería y Banca

> Movimientos bancarios, tarjetas, cheques, depósitos y diario contable.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 36 | Cargo de tarjeta de crédito | `CreditCardCharge` | Add · Mod · Query | P1 | ✅ |
| 37 | Crédito de tarjeta | `CreditCardCredit` | Add · Mod · Query | P2 | ⬜ |
| 38 | Cheque | `Check` | Add · Mod · Query | P2 | ⬜ |
| 39 | Depósito | `Deposit` | Add · Mod · Query | P2 | ⬜ |
| 40 | Transferencia bancaria | `Transfer` | Add · Mod · Query | P2 | ⬜ |
| 41 | Asiento contable | `JournalEntry` | Add · Mod · Query | P3 | ⬜ |
| 42 | Pago de impuesto sobre ventas | `SalesTaxPaymentCheck` | Add · Mod · Query | P4 | ⬜ |

---

## Módulo 6 — Contactos

> Clientes, proveedores, empleados y otros contactos.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 43 | Cliente | `Customer` | Add · Mod · Query | P1 | ✅ |
| 44 | Proveedor | `Vendor` | Add · Mod · Query | P1 | ✅ |
| 45 | Empleado | `Employee` | Add · Mod · Query | P2 | ⬜ |
| 46 | Otro nombre | `OtherName` | Add · Mod · Query | P4 | ⬜ |
| 47 | Prospecto / Lead | `Lead` | Add · Mod · Query | P4 | ⬜ |

---

## Módulo 7 — Contabilidad

> Cuentas contables, clasificaciones y mapeos fiscales.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 48 | Cuenta contable | `Account` | Add · Mod · Query | P2 | ⬜ |
| 49 | Clase / Centro de costo | `Class` | Add · Mod · Query | P3 | ⬜ |
| 50 | Info de línea fiscal | `AccountTaxLineInfo` | Query | P5 | ⬜ |
| 51 | Mapeo fiscal 1099 | `Form1099CategoryAccountMapping` | Mod · Query | P5 | ⬜ |

---

## Módulo 8 — Configuración y Listas

> Catálogos de configuración: métodos de pago, términos, monedas, impuestos, tarifas.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 52 | Moneda | `Currency` | Add · Mod · Query | P3 | ⬜ |
| 53 | Código de impuesto sobre ventas | `SalesTaxCode` | Add · Mod · Query | P3 | ⬜ |
| 54 | Nivel de precio | `PriceLevel` | Add · Mod · Query | P3 | ⬜ |
| 55 | Método de pago | `PaymentMethod` | Add · Mod · Query | P4 | ⬜ |
| 56 | Método de envío | `ShipMethod` | Add · Mod · Query | P4 | ⬜ |
| 57 | Términos estándar | `StandardTerms` | Add · Mod · Query | P4 | ⬜ |
| 58 | Términos por fecha | `DateDrivenTerms` | Add · Mod · Query | P4 | ⬜ |
| 59 | Tipo de cliente | `CustomerType` | Add · Mod · Query | P4 | ⬜ |
| 60 | Tipo de proveedor | `VendorType` | Add · Mod · Query | P4 | ⬜ |
| 61 | Tipo de trabajo | `JobType` | Add · Mod · Query | P5 | ⬜ |
| 62 | Representante de ventas | `SalesRep` | Add · Mod · Query | P4 | ⬜ |
| 63 | Mensaje al cliente | `CustomerMsg` | Add · Mod · Query | P5 | ⬜ |
| 64 | Tarifa de facturación | `BillingRate` | Add · Mod · Query | P5 | ⬜ |
| 65 | Unidad de medida | `UnitOfMeasureSet` | Add · Mod · Query | P4 | ⬜ |
| 66 | Términos (consulta genérica) | `Terms` | Query | P4 | ⬜ |
| 67 | Plantilla de documento | `Template` | Query | P5 | ⬜ |
| 68 | Entidad genérica | `Entity` | Query | P5 | ⬜ |
| 69 | Código de barras | `BarCode` | Query | P5 | ⬜ |
| 70 | Impuesto por pagar | `SalesTaxPayable` | Query | P4 | ⬜ |

---

## Módulo 9 — Nómina y Tiempo

> Registro de tiempo, nómina y compensaciones laborales.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 71 | Registro de tiempo | `TimeTracking` | Add · Mod · Query | P4 | ⬜ |
| 72 | Código de compensación laboral | `WorkersCompCode` | Add · Mod · Query | P5 | ⬜ |
| 73 | Ítem de nómina — salario | `PayrollItemWage` | Add · Query | P5 | ⬜ |
| 74 | Ítem de nómina — no salarial | `PayrollItemNonWage` | Query | P5 | ⬜ |

---

## Módulo 10 — Reportes

> Reportes generados directamente desde QB Desktop.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 75 | Reporte de antigüedad | `AgingReport` | Query | P4 | ⬜ |
| 76 | Reporte de presupuesto | `BudgetSummaryReport` | Query | P5 | ⬜ |
| 77 | Reporte detallado personalizado | `CustomDetailReport` | Query | P4 | ⬜ |
| 78 | Reporte resumido personalizado | `CustomSummaryReport` | Query | P4 | ⬜ |
| 79 | Reporte general detallado | `GeneralDetailReport` | Query | P4 | ⬜ |
| 80 | Reporte general resumido | `GeneralSummaryReport` | Query | P4 | ⬜ |
| 81 | Reporte de trabajos | `JobReport` | Query | P5 | ⬜ |
| 82 | Reporte de nómina detallado | `PayrollDetailReport` | Query | P5 | ⬜ |
| 83 | Reporte de nómina resumido | `PayrollSummaryReport` | Query | P5 | ⬜ |
| 84 | Declaración de impuesto sobre ventas | `SalesTaxReturn` | Query | P5 | ⬜ |
| 85 | Línea de declaración fiscal | `SalesTaxReturnLine` | Query | P5 | ⬜ |
| 86 | Reporte de tiempo | `TimeReport` | Query | P5 | ⬜ |
| 87 | Transacción genérica | `Transaction` | Query | P4 | ⬜ |

---

## Módulo 11 — Sistema

> Operaciones de sistema y SDK. No expuestas como webhooks de negocio.

| # | Entidad | Tipo XML | Ops | Prioridad | Estado |
|---|---|---|---|---|---|
| 88 | Información de compañía | `Company` | Query | P5 | ⬜ |
| 89 | Actividad de compañía | `CompanyActivity` | Query | P5 | ⬜ |
| 90 | Host QB | `Host` | Query | P5 | ⬜ |
| 91 | Preferencias QB | `Preferences` | Query | P5 | ⬜ |
| 92 | Estado de conciliación | `ClearedStatus` | Mod | P5 | ⬜ |
| 93 | Tarea pendiente | `ToDo` | Add · Mod · Query | P6 | ⬜ |
| 94 | Vehículo | `Vehicle` | Add · Mod · Query | P6 | ⬜ |
| 95 | Kilometraje de vehículo | `VehicleMileage` | Add · Query | P6 | ⬜ |
| 96 | Campo personalizado | `DataExt` | Add · Mod · Del | P5 | ⬜ |
| 97 | Definición de campo personalizado | `DataExtDef` | Add · Mod · Del · Query | P5 | ⬜ |
| 98 | Suscripción a evento de datos | `DataEventSubscription` | Add · Query | P6 | ⬜ |
| 99 | Recuperación de evento de datos | `DataEventRecoveryInfo` | Del · Query | P6 | ⬜ |
| 100 | Suscripción a evento UI | `UIEventSubscription` | Add · Query | P6 | ⬜ |
| 101 | Suscripción extensión UI | `UIExtensionSubscription` | Add · Query | P6 | ⬜ |
| 102 | Eliminar lista | `ListDel` | Del | P5 | ⬜ |
| 103 | Consulta listas eliminadas | `ListDeletedQuery` | Query | P5 | ⬜ |
| 104 | Mostrar lista (Add) | `ListDisplayAdd` | Add | P6 | ⬜ |
| 105 | Mostrar lista (Mod) | `ListDisplayMod` | Mod | P6 | ⬜ |
| 106 | Combinar listas | `ListMerge` | Merge | P6 | ⬜ |
| 107 | Eliminar transacción | `TxnDel` | Del | P4 | ⬜ |
| 108 | Consulta transacciones eliminadas | `TxnDeletedQuery` | Query | P4 | ⬜ |
| 109 | Mostrar transacción (Add) | `TxnDisplayAdd` | Add | P6 | ⬜ |
| 110 | Mostrar transacción (Mod) | `TxnDisplayMod` | Mod | P6 | ⬜ |
| 111 | Anular transacción | `TxnVoid` | Void | P4 | ⬜ |
| 112 | Cuenta especial | `SpecialAccount` | Add | P6 | ⬜ |
| 113 | Ítem especial | `SpecialItem` | Add | P6 | ⬜ |
| 114 | Eliminar suscripción | `SubscriptionDel` | Del | P6 | ⬜ |
| 115 | Eventos QBXML | `QBXMLEvents` | Events | P6 | ⬜ |

---

## Estadísticas de avance

### Global

| Métrica | Entidades | % |
|---|---|---|
| ✅ Entregadas | 13 | 11% |
| ⬜ Pendientes | 102 | 89% |
| **Total** | **115** | **100%** |

> De los ~246 tipos XML individuales (Add/Mod/Query/Del por entidad), **36 están entregados (15%)** y **210 pendientes (85%)**.

---

### Por módulo

| Módulo | Total | ✅ | ⬜ | % Avance |
|---|---|---|---|---|
| 1 — Inventario · Catálogo | 13 | 3 | 10 | 23% |
| 2 — Inventario · Operaciones | 7 | 3 | 4 | 43% |
| 3 — Ventas | 9 | 2 | 7 | 22% |
| 4 — Compras | 6 | 2 | 4 | 33% |
| 5 — Tesorería y Banca | 7 | 1 | 6 | 14% |
| 6 — Contactos | 5 | 2 | 3 | 40% |
| 7 — Contabilidad | 4 | 0 | 4 | 0% |
| 8 — Configuración y Listas | 19 | 0 | 19 | 0% |
| 9 — Nómina y Tiempo | 4 | 0 | 4 | 0% |
| 10 — Reportes | 13 | 0 | 13 | 0% |
| 11 — Sistema | 28 | 0 | 28 | 0% |
| **Total** | **115** | **13** | **102** | **11%** |

> Módulos con mayor avance: **Inventario Operaciones (43%)** · **Contactos (40%)** · **Compras (33%)**
> Módulos sin iniciar: Contabilidad · Configuración · Nómina · Reportes · Sistema

---

## Prioridad de desarrollo — próximas entidades sugeridas

| Prioridad | Entidades | Razón |
|---|---|---|
| **P2 inmediato** | InventoryAdjustment · ItemReceipt · SalesReceipt · ReceivePayment · CreditMemo · VendorCredit · BillPaymentCheck · CreditCardCredit · Cheque · Depósito · Transferencia bancaria · Employee · Account | Operaciones de alta frecuencia en cualquier ERP activo |
| **P3** | Estimate · ItemInventoryAssembly · BillToPay · ReceivePaymentToDeposit · Class · ItemGroup · Item (genérico) | Soporte a flujos ya entregados |
| **P4** | Configuración (moneda, impuestos, métodos de pago, términos, unidades) · Reportes transaccionales | Setup y visibilidad |
| **P5+** | Nómina · Sistema · Eventos | Especialización avanzada |
