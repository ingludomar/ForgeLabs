# SyncBridge — Roadmap por procesos de negocio

> Clasificación por ciclo de negocio real. Cada entidad pertenece a un único proceso (proceso principal).
> Cuando una entidad se usa en otro proceso, se indica como dependencia — no se doble-contabiliza.
> Estadísticas por módulo técnico: [`roadmap-xml.md`](roadmap-xml.md)

---

## Resumen global

| Procesos | Entidades | Total XML | ✅ Entregados | ⬜ Pendientes | % Avance |
|---|---|---|---|---|---|
| 9 | 115 | 236 | 38 | 198 | **16%** |

---

## Por proceso

| # | Proceso | Entidades | XML | ✅ | ⬜ | % Proceso | % del total |
|---|---|---|---|---|---|---|---|
| 1 | Maestros | 20 | 58 | 15 | 43 | 26% | 25% |
| 2 | Configuración y listas | 19 | 37 | 0 | 37 | 0% | 16% |
| 3 | Order-to-Cash · Ventas | 9 | 24 | 6 | 18 | 25% | 10% |
| 4 | Purchase-to-Pay · Compras | 7 | 17 | 6 | 11 | 35% | 7% |
| 5 | Inventario operativo | 6 | 12 | 8 | 4 | **67%** | 5% |
| 6 | Tesorería y banca | 7 | 21 | 3 | 18 | 14% | 9% |
| 7 | Cierre contable y reportes | 19 | 20 | 0 | 20 | 0% | 8% |
| 8 | Nómina y tiempo | 4 | 9 | 0 | 9 | 0% | 4% |
| 9 | Sistema y extensiones | 24 | 38 | 0 | 38 | 0% | 16% |
| | **Total** | **115** | **236** | **38** | **198** | **16%** | **100%** |

> **% del total** = peso del proceso sobre los 236 XML del ecosistema completo.
> Procesos más pesados: Maestros (25%) · Configuración (16%) · Sistema (16%)
> Procesos más avanzados: Inventario (67%) · Purchase-to-Pay (35%) · Maestros (26%)

---

## Detalle por proceso

---

### Proceso 1 — Maestros
> Base de datos maestra. Sin esto, ningún proceso transaccional puede operar.
> **20 entidades · 58 XML · 15 ✅ · 26% avance**
> **Depende de:** ninguno — es el punto de partida

#### Catálogo de ítems

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Ítem de inventario | `ItemInventory` | 3 | 3 | 100% | P1 |
| Ítem sin inventario | `ItemNonInventory` | 3 | 3 | 100% | P1 |
| Servicio | `ItemService` | 3 | 3 | 100% | P1 |
| Ensamblaje (catálogo) | `ItemInventoryAssembly` | 3 | 0 | 0% | P2 |
| Cargo adicional | `ItemOtherCharge` | 3 | 0 | 0% | P3 |
| Grupo de ítems | `ItemGroup` | 3 | 0 | 0% | P3 |
| Descuento | `ItemDiscount` | 3 | 0 | 0% | P3 |
| Activo fijo | `ItemFixedAsset` | 3 | 0 | 0% | P4 |
| Impuesto sobre ventas | `ItemSalesTax` | 3 | 0 | 0% | P4 |
| Grupo de impuestos | `ItemSalesTaxGroup` | 3 | 0 | 0% | P4 |
| Pago (ítem) | `ItemPayment` | 3 | 0 | 0% | P5 |
| Subtotal (ítem) | `ItemSubtotal` | 3 | 0 | 0% | P5 |
| Consulta genérica | `Item` | 1 | 0 | 0% | P3 |

#### Contactos

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Cliente | `Customer` | 3 | 3 | 100% | P1 |
| Proveedor | `Vendor` | 3 | 3 | 100% | P1 |
| Empleado | `Employee` | 3 | 0 | 0% | P2 |
| Otro nombre | `OtherName` | 3 | 0 | 0% | P4 |
| Prospecto / Lead | `Lead` | 3 | 0 | 0% | P4 |

#### Contabilidad

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Cuenta contable | `Account` | 3 | 0 | 0% | P2 |
| Clase / Centro de costo | `Class` | 3 | 0 | 0% | P3 |

---

### Proceso 2 — Configuración y listas
> Catálogos de sistema. Parametrizan impuestos, monedas, términos, métodos de pago y más.
> **19 entidades · 37 XML · 0 ✅ · 0% avance**
> **Depende de:** ninguno — configuración base del sistema

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Moneda | `Currency` | 3 | 0 | 0% | P3 |
| Código de impuesto | `SalesTaxCode` | 3 | 0 | 0% | P3 |
| Nivel de precio | `PriceLevel` | 3 | 0 | 0% | P3 |
| Representante de ventas | `SalesRep` | 3 | 0 | 0% | P4 |
| Método de pago | `PaymentMethod` | 2 | 0 | 0% | P4 |
| Método de envío | `ShipMethod` | 2 | 0 | 0% | P4 |
| Términos estándar | `StandardTerms` | 2 | 0 | 0% | P4 |
| Términos por fecha | `DateDrivenTerms` | 2 | 0 | 0% | P4 |
| Tipo de cliente | `CustomerType` | 2 | 0 | 0% | P4 |
| Tipo de proveedor | `VendorType` | 2 | 0 | 0% | P4 |
| Unidad de medida | `UnitOfMeasureSet` | 2 | 0 | 0% | P4 |
| Tipo de trabajo | `JobType` | 2 | 0 | 0% | P5 |
| Mensaje al cliente | `CustomerMsg` | 2 | 0 | 0% | P5 |
| Tarifa de facturación | `BillingRate` | 2 | 0 | 0% | P5 |
| Impuesto por pagar | `SalesTaxPayable` | 1 | 0 | 0% | P4 |
| Términos (genérico) | `Terms` | 1 | 0 | 0% | P4 |
| Plantilla de documento | `Template` | 1 | 0 | 0% | P5 |
| Entidad genérica | `Entity` | 1 | 0 | 0% | P5 |
| Código de barras | `BarCode` | 1 | 0 | 0% | P5 |

---

### Proceso 3 — Order-to-Cash · Ventas
> Ciclo completo: cotización → orden → factura → cobro → depósito → devolución.
> **9 entidades · 24 XML · 6 ✅ · 25% avance**
> **Depende de:** Maestros (Customer, Items) · Configuración (SalesTaxCode, PaymentMethod, Terms)

```
Estimate → SalesOrder → Invoice(s) → ReceivePayment → Deposit*
                                           ↓ (devolución)
                                       CreditMemo → ARRefundCreditCard
* Deposit pertenece a Tesorería — dependencia compartida
```

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Estimado / Cotización | `Estimate` | 3 | 0 | 0% | P3 |
| Orden de venta | `SalesOrder` | 3 | 3 | 100% | P1 |
| Recibo de venta | `SalesReceipt` | 3 | 0 | 0% | P2 |
| Factura de venta | `Invoice` | 3 | 3 | 100% | P1 |
| Cobro de cliente | `ReceivePayment` | 3 | 0 | 0% | P2 |
| Pagos por depositar | `ReceivePaymentToDeposit` | 1 | 0 | 0% | P3 |
| Nota de crédito | `CreditMemo` | 3 | 0 | 0% | P2 |
| Cargo a cliente | `Charge` | 3 | 0 | 0% | P4 |
| Reembolso con tarjeta (AR) | `ARRefundCreditCard` | 2 | 0 | 0% | P4 |

> **Flujo bloqueado en:** ReceivePayment · CreditMemo — la venta no cierra sin cobro ni devolución.

---

### Proceso 4 — Purchase-to-Pay · Compras
> Ciclo completo: orden de compra → recepción → factura proveedor → pago → devolución (RMA).
> **7 entidades · 17 XML · 6 ✅ · 35% avance**
> **Depende de:** Maestros (Vendor, Items) · Configuración (PaymentMethod, Terms) · Inventario (actualización de stock en ItemReceipt)

```
PurchaseOrder → ItemReceipt → Bill → BillPaymentCheck / BillPaymentCreditCard
                    ↓ (mercancía dañada — RMA)
                VendorCredit
```

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Orden de compra | `PurchaseOrder` | 3 | 3 | 100% | P1 |
| Recepción de mercancía | `ItemReceipt` | 3 | 0 | 0% | P2 |
| Factura de proveedor | `Bill` | 3 | 3 | 100% | P1 |
| Facturas por pagar | `BillToPay` | 1 | 0 | 0% | P2 |
| Crédito de proveedor (RMA) | `VendorCredit` | 3 | 0 | 0% | P2 |
| Pago con cheque | `BillPaymentCheck` | 2 | 0 | 0% | P2 |
| Pago con tarjeta | `BillPaymentCreditCard` | 2 | 0 | 0% | P3 |

> **Flujo bloqueado en:** ItemReceipt — no se puede registrar la entrada física de mercancía.

---

### Proceso 5 — Inventario operativo
> Movimientos físicos de inventario: sitios, traslados, ensamblajes, ajustes.
> **6 entidades · 12 XML · 8 ✅ · 67% avance**
> **Depende de:** Maestros (Items, InventorySite)

```
InventorySite → [base para todos los movimientos]
InventoryAdjustment → ajuste de existencias (merma, conteo físico)
TransferInventory   → traslado entre almacenes
BuildAssembly       → fabricación de ensamblajes
ItemSites / ItemAssembliesCanBuild → consultas de disponibilidad
```

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Sitio de inventario | `InventorySite` | 3 | 3 | 100% | P1 |
| Transferencia de inventario | `TransferInventory` | 2 | 2 | 100% | P1 |
| Construcción de ensamblaje | `BuildAssembly` | 3 | 3 | 100% | P1 |
| Ajuste de inventario | `InventoryAdjustment` | 2 | 0 | 0% | P2 |
| Ítems por sitio | `ItemSites` | 1 | 0 | 0% | P3 |
| Ensamblajes disponibles | `ItemAssembliesCanBuild` | 1 | 0 | 0% | P4 |

---

### Proceso 6 — Tesorería y banca
> Movimientos bancarios, pagos directos, tarjetas, depósitos y asientos.
> **7 entidades · 21 XML · 3 ✅ · 14% avance**
> **Depende de:** Maestros (Account, Vendor, Customer) · Proceso 3 (Deposit recibe de ReceivePayment)

```
Check               → pago de gastos con cheque
CreditCardCharge    → cargo de gastos a tarjeta
CreditCardCredit    → devolución en tarjeta
Deposit             → depósito de cobros al banco
Transfer            → movimiento entre cuentas
JournalEntry        → asiento contable manual
SalesTaxPaymentCheck → pago de impuesto sobre ventas
```

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Cargo de tarjeta de crédito | `CreditCardCharge` | 3 | 3 | 100% | P1 |
| Crédito de tarjeta | `CreditCardCredit` | 3 | 0 | 0% | P2 |
| Cheque | `Check` | 3 | 0 | 0% | P2 |
| Depósito | `Deposit` | 3 | 0 | 0% | P2 |
| Transferencia bancaria | `Transfer` | 3 | 0 | 0% | P2 |
| Asiento contable | `JournalEntry` | 3 | 0 | 0% | P3 |
| Pago de impuesto sobre ventas | `SalesTaxPaymentCheck` | 3 | 0 | 0% | P4 |

---

### Proceso 7 — Cierre contable y reportes
> Visibilidad financiera, reconciliación y cierre de período.
> **19 entidades · 20 XML · 0 ✅ · 0% avance**
> **Depende de:** todos los procesos transaccionales — reporta sobre sus datos

#### Operaciones de cierre

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Mapeo fiscal 1099 | `Form1099CategoryAccountMapping` | 2 | 0 | 0% | P5 |
| Info de línea fiscal | `AccountTaxLineInfo` | 1 | 0 | 0% | P5 |
| Estado de conciliación | `ClearedStatus` | 1 | 0 | 0% | P5 |
| Anular transacción | `TxnVoid` | 1 | 0 | 0% | P4 |
| Eliminar transacción | `TxnDel` | 1 | 0 | 0% | P4 |
| Consulta transacciones eliminadas | `TxnDeletedQuery` | 1 | 0 | 0% | P4 |

#### Reportes

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Reporte de antigüedad | `AgingReport` | 1 | 0 | 0% | P4 |
| Reporte detallado personalizado | `CustomDetailReport` | 1 | 0 | 0% | P4 |
| Reporte resumido personalizado | `CustomSummaryReport` | 1 | 0 | 0% | P4 |
| Reporte general detallado | `GeneralDetailReport` | 1 | 0 | 0% | P4 |
| Reporte general resumido | `GeneralSummaryReport` | 1 | 0 | 0% | P4 |
| Transacción genérica | `Transaction` | 1 | 0 | 0% | P4 |
| Reporte de trabajos | `JobReport` | 1 | 0 | 0% | P5 |
| Reporte de nómina detallado | `PayrollDetailReport` | 1 | 0 | 0% | P5 |
| Reporte de nómina resumido | `PayrollSummaryReport` | 1 | 0 | 0% | P5 |
| Declaración de impuesto sobre ventas | `SalesTaxReturn` | 1 | 0 | 0% | P5 |
| Línea de declaración fiscal | `SalesTaxReturnLine` | 1 | 0 | 0% | P5 |
| Reporte de tiempo | `TimeReport` | 1 | 0 | 0% | P5 |
| Reporte de presupuesto | `BudgetSummaryReport` | 1 | 0 | 0% | P5 |

---

### Proceso 8 — Nómina y tiempo
> Registro de horas, códigos de compensación e ítems de nómina.
> **4 entidades · 9 XML · 0 ✅ · 0% avance**
> **Depende de:** Maestros (Employee) · Configuración (BillingRate)

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Registro de tiempo | `TimeTracking` | 3 | 0 | 0% | P4 |
| Código de compensación laboral | `WorkersCompCode` | 3 | 0 | 0% | P5 |
| Ítem de nómina — salario | `PayrollItemWage` | 2 | 0 | 0% | P5 |
| Ítem de nómina — no salarial | `PayrollItemNonWage` | 1 | 0 | 0% | P5 |

---

### Proceso 9 — Sistema y extensiones
> Operaciones internas del SDK. No se exponen como webhooks de negocio.
> **24 entidades · 38 XML · 0 ✅ · 0% avance**
> **Depende de:** infraestructura LedgerBridge — uso interno

| Entidad | Tipo XML | XML | ✅ | % | Prioridad |
|---|---|---|---|---|---|
| Información de compañía | `Company` | 1 | 0 | 0% | P5 |
| Actividad de compañía | `CompanyActivity` | 1 | 0 | 0% | P5 |
| Host QB | `Host` | 1 | 0 | 0% | P5 |
| Preferencias QB | `Preferences` | 1 | 0 | 0% | P5 |
| Campo personalizado | `DataExt` | 3 | 0 | 0% | P5 |
| Definición de campo personalizado | `DataExtDef` | 4 | 0 | 0% | P5 |
| Eliminar lista | `ListDel` | 1 | 0 | 0% | P5 |
| Consulta listas eliminadas | `ListDeletedQuery` | 1 | 0 | 0% | P5 |
| Tarea pendiente | `ToDo` | 3 | 0 | 0% | P6 |
| Vehículo | `Vehicle` | 3 | 0 | 0% | P6 |
| Kilometraje de vehículo | `VehicleMileage` | 2 | 0 | 0% | P6 |
| Suscripción a evento de datos | `DataEventSubscription` | 2 | 0 | 0% | P6 |
| Recuperación de evento de datos | `DataEventRecoveryInfo` | 2 | 0 | 0% | P6 |
| Suscripción a evento UI | `UIEventSubscription` | 2 | 0 | 0% | P6 |
| Suscripción extensión UI | `UIExtensionSubscription` | 2 | 0 | 0% | P6 |
| Mostrar lista (Add) | `ListDisplayAdd` | 1 | 0 | 0% | P6 |
| Mostrar lista (Mod) | `ListDisplayMod` | 1 | 0 | 0% | P6 |
| Combinar listas | `ListMerge` | 1 | 0 | 0% | P6 |
| Mostrar transacción (Add) | `TxnDisplayAdd` | 1 | 0 | 0% | P6 |
| Mostrar transacción (Mod) | `TxnDisplayMod` | 1 | 0 | 0% | P6 |
| Cuenta especial | `SpecialAccount` | 1 | 0 | 0% | P6 |
| Ítem especial | `SpecialItem` | 1 | 0 | 0% | P6 |
| Eliminar suscripción | `SubscriptionDel` | 1 | 0 | 0% | P6 |
| Eventos QBXML | `QBXMLEvents` | 1 | 0 | 0% | P6 |
