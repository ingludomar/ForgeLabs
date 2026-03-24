# LedgerOps — Roadmap

> Prioridad oficial de desarrollo. Cuando un grupo se complete, actualizar `features.md`.
> Proceso de desarrollo: ver [`feature-dev-process.md`](feature-dev-process.md)

---

## Prioridad de desarrollo

| # | Entidad | Estado | Notas |
|---|---------|--------|-------|
| 1 | **Item Inventory** | ✅ Listo para producción | P4 completo 2026-03-19 · P5 pendiente correo release |
| 2 | **Item Non-Inventory** | ✅ Listo para producción | P4 completo 2026-03-19 · P5 pendiente correo release |
| 3 | **Item Service** | 🔨 | Workflows existen — pendiente testear |
| 4 | **Customer** | 🔨 | Add existe — Mod/Query pendiente crear |
| 5 | **Vendor** | 🔨 | Add existe — Mod/Query pendiente crear |
| 6 | **Sales Order (SO)** | ⬜ | Workflows por crear |
| 7 | **Purchase Order (PO)** | 🔨 | Add existe — Mod/Query pendiente crear |
| 8 | **Invoice** | 🔨 | Add existe — Mod/Query pendiente crear |
| 9 | **Bill** | 🔨 | Add+Mod existen — Query pendiente crear |
| 10 | **Inventory Site** | ⬜ | Workflows por crear |
| 11 | **Inventory Transfer** | ⬜ | Workflows por crear |
| 12 | **Assembly** | ⬜ | Workflows por crear |
| 13 | **Credit Card Charges** | 🔨 | Add existe — Mod/Query pendiente crear |

---

## Detalle — Item Inventory ✅

- [x] P1 AnalyzeSedeFields TEST/RUS/REC/RBR
- [x] P2 Business rules Add+Mod · TEST/RUS/REC/RBR
- [x] P3 Workflows Add/Mod/Query activos
- [x] P4 Testing — TC-ADD-01→07, TC-QRY-01→04, TC-MOD-01→06, TC-DEL-01→03
- [x] features.md ✅
- [ ] P5 Correo de release — pendiente configurar SMTP

---

## Detalle — Item Non-Inventory ✅

- [x] P1 AnalyzeSedeFields TEST/RUS/REC/RBR
- [x] P2 Business rules Add+Mod · TEST/RUS/REC/RBR
- [x] P3 Workflows Add/Mod/Query activos
- [x] P4 Testing — TC-ADD-01→07, TC-QRY-01→04, TC-MOD-01→06, TC-DEL-01→03
- [x] features.md ✅
- [ ] P5 Correo de release — pendiente configurar SMTP

---

## Detalle — Item Service (siguiente)

- [ ] AnalyzeSedeFields → ItemServiceAdd / TEST
- [ ] Testear ItemServiceAdd
- [ ] Testear ItemServiceMod
- [ ] Marcar en features.md

---

## Notas por entidad

| Entidad | Workflows existentes | Por crear |
|---------|---------------------|-----------|
| ItemInventory | Add ✅ Mod ✅ Query ✅ | — |
| ItemNonInventory | Add ✅ Mod ✅ | Query (usa mismo endpoint item/query) |
| ItemService | Add ✅ Mod ✅ | Query (usa mismo endpoint item/query) |
| Customer | Add ✅ | Mod, Query |
| Vendor | Add ✅ | Mod, Query |
| SalesOrder | — | Add, Mod, Query |
| PurchaseOrder | Add ✅ | Mod, Query |
| Invoice | Add ✅ | Mod, Query |
| Bill | Add ✅ Mod ✅ | Query |
| InventorySite | — | Add, Mod, Query |
| TransferInventory | — | Add, Query |
| Assembly (BuildAssembly) | — | Add, Query |
| CreditCardCharge | Add ✅ | Mod, Query |
