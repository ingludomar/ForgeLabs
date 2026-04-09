# SyncBridge — Roadmap XML · Avance global

> **Jerarquía:** Módulo → Entidad → XML types (Add / Mod / Query / Del / ...)
> El número de XML reemplaza el listado individual de tipos y es la unidad de medición en todos los niveles.
> Estado: ✅ entregado · ⬜ pendiente

---

## Resumen global

| Módulos | Entidades | Total XML | ✅ Entregados | ⬜ Pendientes | % Avance |
|---|---|---|---|---|---|
| 11 | 115 | 236 | 38 | 198 | **16%** |

---

## Por módulo · resumen ejecutivo

| # | Módulo | Entidades | Total XML | ✅ | ⬜ | % Módulo | % del total |
|---|---|---|---|---|---|---|---|
| 1 | Inventario · Catálogo | 13 | 37 | 9 | 28 | 24% | 16% |
| 2 | Inventario · Operaciones | 7 | 15 | 8 | 7 | 53% | 6% |
| 3 | Ventas | 9 | 24 | 6 | 18 | 25% | 10% |
| 4 | Compras | 6 | 14 | 6 | 8 | 43% | 6% |
| 5 | Tesorería y Banca | 7 | 21 | 3 | 18 | 14% | 9% |
| 6 | Contactos | 5 | 15 | 6 | 9 | 40% | 6% |
| 7 | Contabilidad | 4 | 9 | 0 | 9 | 0% | 4% |
| 8 | Configuración y Listas | 19 | 37 | 0 | 37 | 0% | 16% |
| 9 | Nómina y Tiempo | 4 | 9 | 0 | 9 | 0% | 4% |
| 10 | Reportes | 13 | 13 | 0 | 13 | 0% | 6% |
| 11 | Sistema | 28 | 42 | 0 | 42 | 0% | 18% |
| | **Total** | **115** | **236** | **38** | **198** | **16%** | **100%** |

> **% del total** = peso relativo del módulo sobre el total de 236 XML (cuánto trabajo representa).

---

## Detalle por entidad

### Módulo 1 — Inventario · Catálogo de ítems
> 13 entidades · **37 XML** · 9 ✅ · **24% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 1 | Ítem de inventario | `ItemInventory` | 3 | 3 | 100% | P1 |
| 2 | Ítem sin inventario | `ItemNonInventory` | 3 | 3 | 100% | P1 |
| 3 | Servicio | `ItemService` | 3 | 3 | 100% | P1 |
| 4 | Ensamblaje (catálogo) | `ItemInventoryAssembly` | 3 | 0 | 0% | P2 |
| 5 | Cargo adicional | `ItemOtherCharge` | 3 | 0 | 0% | P3 |
| 6 | Grupo de ítems | `ItemGroup` | 3 | 0 | 0% | P3 |
| 7 | Descuento | `ItemDiscount` | 3 | 0 | 0% | P3 |
| 8 | Activo fijo | `ItemFixedAsset` | 3 | 0 | 0% | P4 |
| 9 | Impuesto sobre ventas | `ItemSalesTax` | 3 | 0 | 0% | P4 |
| 10 | Grupo de impuestos | `ItemSalesTaxGroup` | 3 | 0 | 0% | P4 |
| 11 | Pago (ítem) | `ItemPayment` | 3 | 0 | 0% | P5 |
| 12 | Subtotal (ítem) | `ItemSubtotal` | 3 | 0 | 0% | P5 |
| 13 | Consulta genérica de ítems | `Item` | 1 | 0 | 0% | P3 |

---

### Módulo 2 — Inventario · Operaciones
> 7 entidades · **15 XML** · 8 ✅ · **53% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 14 | Sitio de inventario | `InventorySite` | 3 | 3 | 100% | P1 |
| 15 | Transferencia de inventario | `TransferInventory` | 2 | 2 | 100% | P1 |
| 16 | Construcción de ensamblaje | `BuildAssembly` | 3 | 3 | 100% | P1 |
| 17 | Ajuste de inventario | `InventoryAdjustment` | 2 | 0 | 0% | P2 |
| 18 | Recepción de ítems | `ItemReceipt` | 3 | 0 | 0% | P2 |
| 19 | Ítems por sitio | `ItemSites` | 1 | 0 | 0% | P3 |
| 20 | Ensamblajes que se pueden construir | `ItemAssembliesCanBuild` | 1 | 0 | 0% | P4 |

---

### Módulo 3 — Ventas
> 9 entidades · **24 XML** · 6 ✅ · **25% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 21 | Orden de venta | `SalesOrder` | 3 | 3 | 100% | P1 |
| 22 | Factura de venta | `Invoice` | 3 | 3 | 100% | P1 |
| 23 | Recibo de venta | `SalesReceipt` | 3 | 0 | 0% | P2 |
| 24 | Cobro de cuenta por cobrar | `ReceivePayment` | 3 | 0 | 0% | P2 |
| 25 | Nota de crédito | `CreditMemo` | 3 | 0 | 0% | P2 |
| 26 | Estimado / Cotización | `Estimate` | 3 | 0 | 0% | P3 |
| 27 | Cargo a cliente | `Charge` | 3 | 0 | 0% | P4 |
| 28 | Reembolso con tarjeta (AR) | `ARRefundCreditCard` | 2 | 0 | 0% | P4 |
| 29 | Pagos por depositar | `ReceivePaymentToDeposit` | 1 | 0 | 0% | P3 |

---

### Módulo 4 — Compras
> 6 entidades · **14 XML** · 6 ✅ · **43% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 30 | Orden de compra | `PurchaseOrder` | 3 | 3 | 100% | P1 |
| 31 | Factura de proveedor | `Bill` | 3 | 3 | 100% | P1 |
| 32 | Crédito de proveedor | `VendorCredit` | 3 | 0 | 0% | P2 |
| 33 | Pago de factura con cheque | `BillPaymentCheck` | 2 | 0 | 0% | P2 |
| 34 | Facturas por pagar | `BillToPay` | 1 | 0 | 0% | P2 |
| 35 | Pago de factura con tarjeta | `BillPaymentCreditCard` | 2 | 0 | 0% | P3 |

---

### Módulo 5 — Tesorería y Banca
> 7 entidades · **21 XML** · 3 ✅ · **14% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 36 | Cargo de tarjeta de crédito | `CreditCardCharge` | 3 | 3 | 100% | P1 |
| 37 | Crédito de tarjeta | `CreditCardCredit` | 3 | 0 | 0% | P2 |
| 38 | Cheque | `Check` | 3 | 0 | 0% | P2 |
| 39 | Depósito | `Deposit` | 3 | 0 | 0% | P2 |
| 40 | Transferencia bancaria | `Transfer` | 3 | 0 | 0% | P2 |
| 41 | Asiento contable | `JournalEntry` | 3 | 0 | 0% | P3 |
| 42 | Pago de impuesto sobre ventas | `SalesTaxPaymentCheck` | 3 | 0 | 0% | P4 |

---

### Módulo 6 — Contactos
> 5 entidades · **15 XML** · 6 ✅ · **40% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 43 | Cliente | `Customer` | 3 | 3 | 100% | P1 |
| 44 | Proveedor | `Vendor` | 3 | 3 | 100% | P1 |
| 45 | Empleado | `Employee` | 3 | 0 | 0% | P2 |
| 46 | Otro nombre | `OtherName` | 3 | 0 | 0% | P4 |
| 47 | Prospecto / Lead | `Lead` | 3 | 0 | 0% | P4 |

---

### Módulo 7 — Contabilidad
> 4 entidades · **9 XML** · 0 ✅ · **0% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 48 | Cuenta contable | `Account` | 3 | 0 | 0% | P2 |
| 49 | Clase / Centro de costo | `Class` | 3 | 0 | 0% | P3 |
| 50 | Mapeo fiscal 1099 | `Form1099CategoryAccountMapping` | 2 | 0 | 0% | P5 |
| 51 | Info de línea fiscal | `AccountTaxLineInfo` | 1 | 0 | 0% | P5 |

---

### Módulo 8 — Configuración y Listas
> 19 entidades · **37 XML** · 0 ✅ · **0% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 52 | Moneda | `Currency` | 3 | 0 | 0% | P3 |
| 53 | Código de impuesto sobre ventas | `SalesTaxCode` | 3 | 0 | 0% | P3 |
| 54 | Nivel de precio | `PriceLevel` | 3 | 0 | 0% | P3 |
| 55 | Representante de ventas | `SalesRep` | 3 | 0 | 0% | P4 |
| 56 | Método de pago | `PaymentMethod` | 2 | 0 | 0% | P4 |
| 57 | Método de envío | `ShipMethod` | 2 | 0 | 0% | P4 |
| 58 | Términos estándar | `StandardTerms` | 2 | 0 | 0% | P4 |
| 59 | Términos por fecha | `DateDrivenTerms` | 2 | 0 | 0% | P4 |
| 60 | Tipo de cliente | `CustomerType` | 2 | 0 | 0% | P4 |
| 61 | Tipo de proveedor | `VendorType` | 2 | 0 | 0% | P4 |
| 62 | Unidad de medida | `UnitOfMeasureSet` | 2 | 0 | 0% | P4 |
| 63 | Tipo de trabajo | `JobType` | 2 | 0 | 0% | P5 |
| 64 | Mensaje al cliente | `CustomerMsg` | 2 | 0 | 0% | P5 |
| 65 | Tarifa de facturación | `BillingRate` | 2 | 0 | 0% | P5 |
| 66 | Impuesto por pagar | `SalesTaxPayable` | 1 | 0 | 0% | P4 |
| 67 | Términos (consulta genérica) | `Terms` | 1 | 0 | 0% | P4 |
| 68 | Plantilla de documento | `Template` | 1 | 0 | 0% | P5 |
| 69 | Entidad genérica | `Entity` | 1 | 0 | 0% | P5 |
| 70 | Código de barras | `BarCode` | 1 | 0 | 0% | P5 |

---

### Módulo 9 — Nómina y Tiempo
> 4 entidades · **9 XML** · 0 ✅ · **0% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 71 | Registro de tiempo | `TimeTracking` | 3 | 0 | 0% | P4 |
| 72 | Código de compensación laboral | `WorkersCompCode` | 3 | 0 | 0% | P5 |
| 73 | Ítem de nómina — salario | `PayrollItemWage` | 2 | 0 | 0% | P5 |
| 74 | Ítem de nómina — no salarial | `PayrollItemNonWage` | 1 | 0 | 0% | P5 |

---

### Módulo 10 — Reportes
> 13 entidades · **13 XML** · 0 ✅ · **0% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 75 | Reporte de antigüedad | `AgingReport` | 1 | 0 | 0% | P4 |
| 76 | Reporte detallado personalizado | `CustomDetailReport` | 1 | 0 | 0% | P4 |
| 77 | Reporte resumido personalizado | `CustomSummaryReport` | 1 | 0 | 0% | P4 |
| 78 | Reporte general detallado | `GeneralDetailReport` | 1 | 0 | 0% | P4 |
| 79 | Reporte general resumido | `GeneralSummaryReport` | 1 | 0 | 0% | P4 |
| 80 | Transacción genérica | `Transaction` | 1 | 0 | 0% | P4 |
| 81 | Reporte de trabajos | `JobReport` | 1 | 0 | 0% | P5 |
| 82 | Reporte de nómina detallado | `PayrollDetailReport` | 1 | 0 | 0% | P5 |
| 83 | Reporte de nómina resumido | `PayrollSummaryReport` | 1 | 0 | 0% | P5 |
| 84 | Declaración de impuesto sobre ventas | `SalesTaxReturn` | 1 | 0 | 0% | P5 |
| 85 | Línea de declaración fiscal | `SalesTaxReturnLine` | 1 | 0 | 0% | P5 |
| 86 | Reporte de tiempo | `TimeReport` | 1 | 0 | 0% | P5 |
| 87 | Reporte de presupuesto | `BudgetSummaryReport` | 1 | 0 | 0% | P5 |

---

### Módulo 11 — Sistema
> 28 entidades · **42 XML** · 0 ✅ · **0% avance**

| # | Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|---|
| 88 | Eliminar transacción | `TxnDel` | 1 | 0 | 0% | P4 |
| 89 | Consulta transacciones eliminadas | `TxnDeletedQuery` | 1 | 0 | 0% | P4 |
| 90 | Anular transacción | `TxnVoid` | 1 | 0 | 0% | P4 |
| 91 | Información de compañía | `Company` | 1 | 0 | 0% | P5 |
| 92 | Actividad de compañía | `CompanyActivity` | 1 | 0 | 0% | P5 |
| 93 | Host QB | `Host` | 1 | 0 | 0% | P5 |
| 94 | Preferencias QB | `Preferences` | 1 | 0 | 0% | P5 |
| 95 | Estado de conciliación | `ClearedStatus` | 1 | 0 | 0% | P5 |
| 96 | Campo personalizado | `DataExt` | 3 | 0 | 0% | P5 |
| 97 | Definición de campo personalizado | `DataExtDef` | 4 | 0 | 0% | P5 |
| 98 | Eliminar lista | `ListDel` | 1 | 0 | 0% | P5 |
| 99 | Consulta listas eliminadas | `ListDeletedQuery` | 1 | 0 | 0% | P5 |
| 100 | Tarea pendiente | `ToDo` | 3 | 0 | 0% | P6 |
| 101 | Vehículo | `Vehicle` | 3 | 0 | 0% | P6 |
| 102 | Kilometraje de vehículo | `VehicleMileage` | 2 | 0 | 0% | P6 |
| 103 | Suscripción a evento de datos | `DataEventSubscription` | 2 | 0 | 0% | P6 |
| 104 | Recuperación de evento de datos | `DataEventRecoveryInfo` | 2 | 0 | 0% | P6 |
| 105 | Suscripción a evento UI | `UIEventSubscription` | 2 | 0 | 0% | P6 |
| 106 | Suscripción extensión UI | `UIExtensionSubscription` | 2 | 0 | 0% | P6 |
| 107 | Mostrar lista (Add) | `ListDisplayAdd` | 1 | 0 | 0% | P6 |
| 108 | Mostrar lista (Mod) | `ListDisplayMod` | 1 | 0 | 0% | P6 |
| 109 | Combinar listas | `ListMerge` | 1 | 0 | 0% | P6 |
| 110 | Mostrar transacción (Add) | `TxnDisplayAdd` | 1 | 0 | 0% | P6 |
| 111 | Mostrar transacción (Mod) | `TxnDisplayMod` | 1 | 0 | 0% | P6 |
| 112 | Cuenta especial | `SpecialAccount` | 1 | 0 | 0% | P6 |
| 113 | Ítem especial | `SpecialItem` | 1 | 0 | 0% | P6 |
| 114 | Eliminar suscripción | `SubscriptionDel` | 1 | 0 | 0% | P6 |
| 115 | Eventos QBXML | `QBXMLEvents` | 1 | 0 | 0% | P6 |

---

## Leyenda de prioridades

| Prioridad | Criterio |
|---|---|
| P1 | Operaciones core de cualquier ERP — entregadas |
| P2 | Alta frecuencia operativa — pendientes prioritarios |
| P3 | Soporte a flujos ya entregados |
| P4 | Configuración, visibilidad y reportes transaccionales |
| P5 | Especialización avanzada y sistema |
| P6 | Sistema interno SDK — baja demanda de negocio |
