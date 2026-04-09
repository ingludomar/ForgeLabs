# Guía de prueba — QB Playground

**Fecha:** 2026-03-30
**Rama:** redix-integration-quickbooks
**Prerequisito:** Docker corriendo con la rama activa

---

## Acceso

Abrir en el navegador:
```
http://localhost:{PUERTO}/settings
```

Navegar a la sección **QB Playground** dentro de Settings.

---

## Pruebas recomendadas — de menor a mayor riesgo

### 1. Queries (solo lectura — sin riesgo)

Empezar siempre por las queries. No crean ni modifican datos en QB Desktop.

**Vendor Query**
1. Entidad: `Vendor — Query`
2. Sede: `TEST`
3. Click **Fill Examples**
4. Click **Send**
5. Resultado esperado: `success: true` · `VendorRet.Name = "REDSIS CORP-USD"`

**Customer Query**
1. Entidad: `Customer — Query`
2. Sede: `TEST`
3. Click **Fill Examples**
4. Click **Send**
5. Resultado esperado: `success: true` · `CustomerRet.FullName = "Lenovo Mexico USD"`

**Sales Order Query**
1. Entidad: `Sales Order — Query`
2. Sede: `TEST`
3. Click **Fill Examples**
4. Click **Send**
5. Resultado esperado: `success: true` · `SalesOrderRet.CustomerRef.ListID = "800002C4-1597179052"`

---

### 2. Add (crea registros en QB Desktop)

Si las queries pasan, probar un Add.

**Vendor Add**
1. Entidad: `Vendor — Add`
2. Sede: `TEST`
3. Click **Fill Examples**
4. Click **Send**
5. Resultado esperado: `success: true` · `VendorRet.ListID` con un ID nuevo

> Nota: el Name en el ejemplo es `RDX-VENDOR-001` — si ya fue creado antes, QB puede rechazarlo por nombre duplicado. En ese caso cambiar el Name manualmente antes de Send.

---

### 3. Verificar contratos dinámicos

Confirmar que el formulario se construye desde LedgerOps y no desde datos estáticos.

1. Seleccionar `Vendor — Add` + sede `TEST`
2. Verificar que los campos **Name**, **IsVendorEligibleFor1099** y **CurrencyRef** aparecen marcados como requeridos
3. Cambiar a sede `RMX` — los campos requeridos deben ser los mismos (contratos idénticos entre versiones)
4. Verificar que el selector de sede muestra `TSI` y `RRC` deshabilitados

---

## Criterio de éxito

| Verificación | Esperado |
|---|---|
| Dropdown de sede carga al abrir | 5 sedes activas + 2 deshabilitadas |
| Vendor Query retorna datos reales | `REDSIS CORP-USD` en TEST |
| Customer Query retorna datos reales | `Lenovo Mexico USD` en TEST |
| Campos requeridos marcados en el formulario | Name, IsVendorEligibleFor1099, CurrencyRef |
| Add crea registro en QB | `success: true` + ListID nuevo |

---

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| Dropdown de sede vacío | API no conecta a LedgerOps — verificar que Docker tiene salida a internet |
| `INTERNAL_ERROR` en cualquier operación | Verificar que CompanyContextMiddleware está excluido para los endpoints del Playground |
| Timeout 15s en Add | QB Desktop está ocupado — esperar 30s y reintentar |
| `LB-VALIDATION-MISSING_REQUIRED` | El payload de Fill Examples tiene un campo requerido vacío — revisar que Fill Examples se ejecutó antes de Send |
| Name duplicado en Add | Cambiar el Name manualmente (ej. `RDX-VENDOR-002`) |
