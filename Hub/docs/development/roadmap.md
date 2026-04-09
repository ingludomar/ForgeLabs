# SyncBridge — Roadmap de desarrollo

> Seguimiento completo de todas las entidades QB Desktop por módulo, operación y prioridad.
> Proceso de desarrollo: [`feature-dev-process.md`](feature-dev-process.md)
> Estadísticas de avance: [`roadmap-xml.md`](roadmap-xml.md)

---

## Leyenda

| Símbolo | Descripción |
|---|---|
| ✅ | Entregado — verificado en TEST y producción |
| 🔄 | En desarrollo |
| ⬜ | Pendiente |
| `-` | Operación no disponible en QB SDK |

---

## Módulo 1 — Inventario

### Catálogo de ítems

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 1 | Ítem de inventario | `ItemInventory` | ✅ | ✅ | ✅ | P1 |
| 2 | Ítem sin inventario | `ItemNonInventory` | ✅ | ✅ | ✅ | P1 |
| 3 | Servicio | `ItemService` | ✅ | ✅ | ✅ | P1 |
| 4 | Ensamblaje (catálogo) | `ItemInventoryAssembly` | ⬜ | ⬜ | ⬜ | P2 |
| 5 | Cargo adicional | `ItemOtherCharge` | ⬜ | ⬜ | ⬜ | P3 |
| 6 | Grupo de ítems | `ItemGroup` | ⬜ | ⬜ | ⬜ | P3 |
| 7 | Descuento | `ItemDiscount` | ⬜ | ⬜ | ⬜ | P3 |
| 8 | Activo fijo | `ItemFixedAsset` | ⬜ | ⬜ | ⬜ | P4 |
| 9 | Impuesto sobre ventas | `ItemSalesTax` | ⬜ | ⬜ | ⬜ | P4 |
| 10 | Grupo de impuestos | `ItemSalesTaxGroup` | ⬜ | ⬜ | ⬜ | P4 |
| 11 | Pago (ítem) | `ItemPayment` | ⬜ | ⬜ | ⬜ | P5 |
| 12 | Subtotal (ítem) | `ItemSubtotal` | ⬜ | ⬜ | ⬜ | P5 |
| 13 | Consulta genérica de ítems | `Item` | `-` | `-` | ⬜ | P3 |

### Operaciones de inventario

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 14 | Sitio de inventario | `InventorySite` | ✅ | ✅ | ✅ | P1 |
| 15 | Transferencia de inventario | `TransferInventory` | ✅ | `-` | ✅ | P1 |
| 16 | Construcción de ensamblaje | `BuildAssembly` | ✅ | ✅ | ✅ | P1 |
| 17 | Ajuste de inventario | `InventoryAdjustment` | ⬜ | `-` | ⬜ | P2 |
| 18 | Recepción de ítems | `ItemReceipt` | ⬜ | ⬜ | ⬜ | P2 |
| 19 | Ítems por sitio | `ItemSites` | `-` | `-` | ⬜ | P3 |
| 20 | Ensamblajes que se pueden construir | `ItemAssembliesCanBuild` | `-` | `-` | ⬜ | P4 |

---

## Módulo 2 — Ventas

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 21 | Orden de venta | `SalesOrder` | ✅ | ✅ | ✅ | P1 |
| 22 | Factura de venta | `Invoice` | ✅ | ✅ | ✅ | P1 |
| 23 | Recibo de venta | `SalesReceipt` | ⬜ | ⬜ | ⬜ | P2 |
| 24 | Cobro de cuenta por cobrar | `ReceivePayment` | ⬜ | ⬜ | ⬜ | P2 |
| 25 | Nota de crédito | `CreditMemo` | ⬜ | ⬜ | ⬜ | P2 |
| 26 | Estimado / Cotización | `Estimate` | ⬜ | ⬜ | ⬜ | P3 |
| 27 | Cargo a cliente | `Charge` | ⬜ | ⬜ | ⬜ | P4 |
| 28 | Reembolso con tarjeta (AR) | `ARRefundCreditCard` | ⬜ | `-` | ⬜ | P4 |
| 29 | Pagos por depositar | `ReceivePaymentToDeposit` | `-` | `-` | ⬜ | P3 |

---

## Módulo 3 — Compras

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 30 | Orden de compra | `PurchaseOrder` | ✅ | ✅ | ✅ | P1 |
| 31 | Factura de proveedor | `Bill` | ✅ | ✅ | ✅ | P1 |
| 32 | Crédito de proveedor | `VendorCredit` | ⬜ | ⬜ | ⬜ | P2 |
| 33 | Pago de factura con cheque | `BillPaymentCheck` | ⬜ | `-` | ⬜ | P2 |
| 34 | Facturas por pagar | `BillToPay` | `-` | `-` | ⬜ | P2 |
| 35 | Pago de factura con tarjeta | `BillPaymentCreditCard` | ⬜ | `-` | ⬜ | P3 |

---

## Módulo 4 — Tesorería y Banca

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 36 | Cargo de tarjeta de crédito | `CreditCardCharge` | ✅ | ✅ | ✅ | P1 |
| 37 | Crédito de tarjeta | `CreditCardCredit` | ⬜ | ⬜ | ⬜ | P2 |
| 38 | Cheque | `Check` | ⬜ | ⬜ | ⬜ | P2 |
| 39 | Depósito | `Deposit` | ⬜ | ⬜ | ⬜ | P2 |
| 40 | Transferencia bancaria | `Transfer` | ⬜ | ⬜ | ⬜ | P2 |
| 41 | Asiento contable | `JournalEntry` | ⬜ | ⬜ | ⬜ | P3 |
| 42 | Pago de impuesto sobre ventas | `SalesTaxPaymentCheck` | ⬜ | ⬜ | ⬜ | P4 |

---

## Módulo 5 — Contactos

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 43 | Cliente | `Customer` | ✅ | ✅ | ✅ | P1 |
| 44 | Proveedor | `Vendor` | ✅ | ✅ | ✅ | P1 |
| 45 | Empleado | `Employee` | ⬜ | ⬜ | ⬜ | P2 |
| 46 | Otro nombre | `OtherName` | ⬜ | ⬜ | ⬜ | P4 |
| 47 | Prospecto / Lead | `Lead` | ⬜ | ⬜ | ⬜ | P4 |

---

## Módulo 6 — Contabilidad

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 48 | Cuenta contable | `Account` | ⬜ | ⬜ | ⬜ | P2 |
| 49 | Clase / Centro de costo | `Class` | ⬜ | ⬜ | ⬜ | P3 |
| 50 | Mapeo fiscal 1099 | `Form1099CategoryAccountMapping` | `-` | ⬜ | ⬜ | P5 |
| 51 | Info de línea fiscal | `AccountTaxLineInfo` | `-` | `-` | ⬜ | P5 |

---

## Módulo 7 — Configuración y Listas

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 52 | Moneda | `Currency` | ⬜ | ⬜ | ⬜ | P3 |
| 53 | Código de impuesto sobre ventas | `SalesTaxCode` | ⬜ | ⬜ | ⬜ | P3 |
| 54 | Nivel de precio | `PriceLevel` | ⬜ | ⬜ | ⬜ | P3 |
| 55 | Representante de ventas | `SalesRep` | ⬜ | ⬜ | ⬜ | P4 |
| 56 | Método de pago | `PaymentMethod` | ⬜ | `-` | ⬜ | P4 |
| 57 | Método de envío | `ShipMethod` | ⬜ | `-` | ⬜ | P4 |
| 58 | Términos estándar | `StandardTerms` | ⬜ | `-` | ⬜ | P4 |
| 59 | Términos por fecha | `DateDrivenTerms` | ⬜ | `-` | ⬜ | P4 |
| 60 | Tipo de cliente | `CustomerType` | ⬜ | `-` | ⬜ | P4 |
| 61 | Tipo de proveedor | `VendorType` | ⬜ | `-` | ⬜ | P4 |
| 62 | Unidad de medida | `UnitOfMeasureSet` | ⬜ | `-` | ⬜ | P4 |
| 63 | Tipo de trabajo | `JobType` | ⬜ | `-` | ⬜ | P5 |
| 64 | Mensaje al cliente | `CustomerMsg` | ⬜ | `-` | ⬜ | P5 |
| 65 | Tarifa de facturación | `BillingRate` | ⬜ | `-` | ⬜ | P5 |
| 66 | Impuesto por pagar | `SalesTaxPayable` | `-` | `-` | ⬜ | P4 |
| 67 | Términos (consulta genérica) | `Terms` | `-` | `-` | ⬜ | P4 |
| 68 | Plantilla de documento | `Template` | `-` | `-` | ⬜ | P5 |
| 69 | Entidad genérica | `Entity` | `-` | `-` | ⬜ | P5 |
| 70 | Código de barras | `BarCode` | `-` | `-` | ⬜ | P5 |

---

## Módulo 8 — Nómina y Tiempo

| # | Entidad | Tipo XML | Add | Mod | Query | Prioridad |
|---|---|---|---|---|---|---|
| 71 | Registro de tiempo | `TimeTracking` | ⬜ | ⬜ | ⬜ | P4 |
| 72 | Código de compensación laboral | `WorkersCompCode` | ⬜ | ⬜ | ⬜ | P5 |
| 73 | Ítem de nómina — salario | `PayrollItemWage` | ⬜ | `-` | ⬜ | P5 |
| 74 | Ítem de nómina — no salarial | `PayrollItemNonWage` | `-` | `-` | ⬜ | P5 |

---

## Módulo 9 — Reportes

> Todos son Query únicamente.

| # | Entidad | Tipo XML | Query | Prioridad |
|---|---|---|---|---|
| 75 | Reporte de antigüedad | `AgingReport` | ⬜ | P4 |
| 76 | Reporte detallado personalizado | `CustomDetailReport` | ⬜ | P4 |
| 77 | Reporte resumido personalizado | `CustomSummaryReport` | ⬜ | P4 |
| 78 | Reporte general detallado | `GeneralDetailReport` | ⬜ | P4 |
| 79 | Reporte general resumido | `GeneralSummaryReport` | ⬜ | P4 |
| 80 | Transacción genérica | `Transaction` | ⬜ | P4 |
| 81 | Reporte de trabajos | `JobReport` | ⬜ | P5 |
| 82 | Reporte de nómina detallado | `PayrollDetailReport` | ⬜ | P5 |
| 83 | Reporte de nómina resumido | `PayrollSummaryReport` | ⬜ | P5 |
| 84 | Declaración de impuesto sobre ventas | `SalesTaxReturn` | ⬜ | P5 |
| 85 | Línea de declaración fiscal | `SalesTaxReturnLine` | ⬜ | P5 |
| 86 | Reporte de tiempo | `TimeReport` | ⬜ | P5 |
| 87 | Reporte de presupuesto | `BudgetSummaryReport` | ⬜ | P5 |

---

## Módulo 10 — Sistema

> Operaciones de sistema y SDK. No se exponen como webhooks de negocio.

| # | Entidad | Tipo XML | Ops disponibles | Prioridad |
|---|---|---|---|---|
| 88 | Eliminar transacción | `TxnDel` | Del | P4 |
| 89 | Consulta transacciones eliminadas | `TxnDeletedQuery` | Query | P4 |
| 90 | Anular transacción | `TxnVoid` | Void | P4 |
| 91 | Información de compañía | `Company` | Query | P5 |
| 92 | Actividad de compañía | `CompanyActivity` | Query | P5 |
| 93 | Host QB | `Host` | Query | P5 |
| 94 | Preferencias QB | `Preferences` | Query | P5 |
| 95 | Estado de conciliación | `ClearedStatus` | Mod | P5 |
| 96 | Campo personalizado | `DataExt` | Add · Mod · Del | P5 |
| 97 | Definición de campo personalizado | `DataExtDef` | Add · Mod · Del · Query | P5 |
| 98 | Eliminar lista | `ListDel` | Del | P5 |
| 99 | Consulta listas eliminadas | `ListDeletedQuery` | Query | P5 |
| 100 | Tarea pendiente | `ToDo` | Add · Mod · Query | P6 |
| 101 | Vehículo | `Vehicle` | Add · Mod · Query | P6 |
| 102 | Kilometraje de vehículo | `VehicleMileage` | Add · Query | P6 |
| 103 | Suscripción a evento de datos | `DataEventSubscription` | Add · Query | P6 |
| 104 | Recuperación de evento de datos | `DataEventRecoveryInfo` | Del · Query | P6 |
| 105 | Suscripción a evento UI | `UIEventSubscription` | Add · Query | P6 |
| 106 | Suscripción extensión UI | `UIExtensionSubscription` | Add · Query | P6 |
| 107 | Mostrar lista (Add) | `ListDisplayAdd` | Add | P6 |
| 108 | Mostrar lista (Mod) | `ListDisplayMod` | Mod | P6 |
| 109 | Combinar listas | `ListMerge` | Merge | P6 |
| 110 | Mostrar transacción (Add) | `TxnDisplayAdd` | Add | P6 |
| 111 | Mostrar transacción (Mod) | `TxnDisplayMod` | Mod | P6 |
| 112 | Cuenta especial | `SpecialAccount` | Add | P6 |
| 113 | Ítem especial | `SpecialItem` | Add | P6 |
| 114 | Eliminar suscripción | `SubscriptionDel` | Del | P6 |
| 115 | Eventos QBXML | `QBXMLEvents` | Events | P6 |

---

## Estado por sede — entidades entregadas

| Entidad | TEST | RUS | REC | RBR | RMX | TSI | RRC |
|---|---|---|---|---|---|---|---|
| ItemInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemNonInventory | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| ItemService | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Customer | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Vendor | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| SalesOrder | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| PurchaseOrder | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Invoice | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Bill | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| InventorySite | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| CreditCardCharge | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| InventoryTransfer | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |
| Assembly | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | ⏳ |

---

## Pendientes técnicos

| Item | Proyecto | Estado |
|---|---|---|
| PROMPT-006 — requiredBySede vacío en GenerateContract | LedgerBridge | ✅ solved |
| TSI + RRC — configuración LedgerBridge | LedgerBridge | ⏳ bloqueado |
