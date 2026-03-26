# LedgerOps — Catálogo de Features QB Desktop

## Leyenda

| Estado | Descripción |
|--------|-------------|
| ⬜ | Pendiente — no iniciado |
| 🔨 | Desarrollado — workflow creado, pendiente activar o testear |
| 🧪 | Testing — en curso, pruebas parciales |
| ✅ | Completado — pruebas superadas en sede TEST (QBD real) |
| `-` | No aplica — operación no existe en QB para este tipo |

> **Nota:** La sede TEST es un QuickBooks Desktop con datos productivos.
> Las pruebas realizadas ahí son válidas y suficientes para marcar un feature como completado.

---

## Módulo: Inventory

### Items

Endpoint base: `POST /webhook/inventory/item/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| ItemInventory | ✅ | ✅ | ✅ |
| ItemNonInventory | ✅ | ✅ | ✅ |
| ItemService | ✅ | ✅ | ✅ |
| ItemInventoryAssembly | ⬜ | ⬜ | ⬜ |
| ItemOtherCharge | ⬜ | ⬜ | ⬜ |
| ItemDiscount | ⬜ | ⬜ | ⬜ |
| ItemSalesTax | ⬜ | ⬜ | ⬜ |
| ItemSalesTaxGroup | ⬜ | ⬜ | ⬜ |
| ItemGroup | ⬜ | ⬜ | ⬜ |
| ItemPayment | ⬜ | ⬜ | ⬜ |
| ItemSubtotal | ⬜ | ⬜ | ⬜ |
| ItemFixedAsset | ⬜ | ⬜ | ⬜ |

> **Delete lógico** = Mod con `IsActive: false`

### Inventory Management

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| InventoryAdjustment | ⬜ | ⬜ | ⬜ |
| InventorySite | ✅ | ✅ | ✅ |
| BuildAssembly | ⬜ | ⬜ | ⬜ |
| TransferInventory | ⬜ | ⬜ | ⬜ |
| ItemReceipt | ⬜ | ⬜ | ⬜ |

### Item Queries especiales

| Tipo QB | Query |
|---------|-------|
| Item (genérico) | ⬜ |
| ItemSites | ⬜ |
| ItemAssembliesCanBuild | ⬜ |

---

## Módulo: Sales

### Transacciones

Endpoint base: `POST /webhook/sales/{entity}/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| Invoice | ✅ | ✅ | ✅ |
| SalesOrder | ✅ | ✅ | ✅ |
| SalesReceipt | ⬜ | ⬜ | ⬜ |
| CreditMemo | ⬜ | ⬜ | ⬜ |
| Estimate | ⬜ | ⬜ | ⬜ |
| Charge | ⬜ | ⬜ | ⬜ |

### Cobros

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| ReceivePayment | ⬜ | ⬜ | ⬜ |
| ARRefundCreditCard | ⬜ | - | ⬜ |

| Tipo QB | Query |
|---------|-------|
| ReceivePaymentToDeposit | ⬜ |

---

## Módulo: Purchasing

### Transacciones

Endpoint base: `POST /webhook/purchasing/{entity}/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| Bill | ✅ | ✅ | ✅ |
| PurchaseOrder | ✅ | ✅ | ✅ |
| VendorCredit | ⬜ | ⬜ | ⬜ |
| ItemReceipt | ⬜ | ⬜ | ⬜ |
| BillPaymentCheck | ⬜ | ⬜ | ⬜ |
| BillPaymentCreditCard | ⬜ | - | ⬜ |

| Tipo QB | Query |
|---------|-------|
| BillToPay | ⬜ |

---

## Módulo: Banking

Endpoint base: `POST /webhook/banking/{entity}/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| Check | ⬜ | ⬜ | ⬜ |
| Deposit | ⬜ | ⬜ | ⬜ |
| CreditCardCharge | 🔨 | ⬜ | ⬜ |
| CreditCardCredit | ⬜ | ⬜ | ⬜ |
| Transfer | ⬜ | ⬜ | ⬜ |
| SalesTaxPaymentCheck | ⬜ | ⬜ | ⬜ |
| JournalEntry | ⬜ | ⬜ | ⬜ |

---

## Módulo: Contacts

Endpoint base: `POST /webhook/contacts/{entity}/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| Customer | ✅ | ✅ | ✅ |
| Vendor | ✅ | ✅ | ✅ |
| Employee | ⬜ | ⬜ | ⬜ |
| OtherName | ⬜ | ⬜ | ⬜ |
| Lead | ⬜ | ⬜ | ⬜ |

---

## Módulo: Accounts

Endpoint base: `POST /webhook/accounts/{entity}/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| Account | ⬜ | ⬜ | ⬜ |

| Tipo QB | Query |
|---------|-------|
| AccountTaxLineInfo | ⬜ |

---

## Módulo: Lists & Configuration

> Catálogos y configuraciones. Endpoint base: `POST /webhook/config/{entity}/{op}`

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| Class | ⬜ | ⬜ | ⬜ |
| SalesTaxCode | ⬜ | ⬜ | ⬜ |
| Currency | ⬜ | ⬜ | ⬜ |
| PriceLevel | ⬜ | ⬜ | ⬜ |
| SalesRep | ⬜ | ⬜ | ⬜ |
| PaymentMethod | ⬜ | - | ⬜ |
| ShipMethod | ⬜ | - | ⬜ |
| StandardTerms | ⬜ | - | ⬜ |
| DateDrivenTerms | ⬜ | - | ⬜ |
| CustomerType | ⬜ | - | ⬜ |
| VendorType | ⬜ | - | ⬜ |
| JobType | ⬜ | - | ⬜ |
| CustomerMsg | ⬜ | - | ⬜ |
| BillingRate | ⬜ | - | ⬜ |
| UnitOfMeasureSet | ⬜ | - | ⬜ |

| Tipo QB | Query |
|---------|-------|
| Terms | ⬜ |
| SalesTaxPayable | ⬜ |
| Template | ⬜ |
| Entity | ⬜ |
| BarCode | ⬜ |

---

## Módulo: Payroll & Time

| Entidad | Add | Mod | Query |
|---------|---------|---------|---------|
| WorkersCompCode | ⬜ | ⬜ | ⬜ |
| TimeTracking | ⬜ | ⬜ | ⬜ |

| Tipo QB | Add | Query |
|---------|-----|-------|
| PayrollItemWage | ⬜ | ⬜ |
| PayrollItemNonWage | - | ⬜ |

---

## Módulo: Reports

> Todos son Query únicamente.

| Reporte | Query |
|---------|-------|
| AgingReport | ⬜ |
| BudgetSummaryReport | ⬜ |
| CustomDetailReport | ⬜ |
| CustomSummaryReport | ⬜ |
| GeneralDetailReport | ⬜ |
| GeneralSummaryReport | ⬜ |
| JobReport | ⬜ |
| PayrollDetailReport | ⬜ |
| PayrollSummaryReport | ⬜ |
| SalesTaxReturn | ⬜ |
| SalesTaxReturnLine | ⬜ |
| TimeReport | ⬜ |
| Transaction | ⬜ |

---

## Módulo: System

> Operaciones de sistema SDK. No se exponen como webhooks de LedgerOps.

| Tipo QB | Ops disponibles |
|---------|-----------------|
| Company | Query |
| CompanyActivity | Query |
| Host | Query |
| Preferences | Query |
| ClearedStatus | Mod |
| Form1099CategoryAccountMapping | Mod+Query |
| ToDo | Add+Mod+Query |
| Vehicle | Add+Mod+Query |
| VehicleMileage | Add+Query |
| DataExt | Add+Mod+Del |
| DataExtDef | Add+Mod+Del+Query |
| DataEventSubscription | Add+Query |
| DataEventRecoveryInfo | Del+Query |
| UIEventSubscription | Add+Query |
| UIExtensionSubscription | Add+Query |
| ListDel | Del |
| ListDeletedQuery | Query |
| ListDisplayAdd | Add |
| ListDisplayMod | Mod |
| ListMerge | Merge |
| TxnDel | Del |
| TxnDeletedQuery | Query |
| TxnDisplayAdd | Add |
| TxnDisplayMod | Mod |
| TxnVoid | Void |
| SpecialAccount | Add |
| SpecialItem | Add |
| SubscriptionDel | Del |
| QBXMLEvents | Events |

---

## Tools

| Herramienta | Endpoint | Estado |
|-------------|----------|--------|
| GenerateContract | `POST /webhook/tools/contract` | ✅ |
| AnalyzeSedeFields | `POST /webhook/tools/analyze-sede-fields` | ✅ |

