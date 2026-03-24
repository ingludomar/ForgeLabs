# LedgerOps — Template de notificación de release

> Usar este template cada vez que se termina un feature y está listo para testing.
> Copiar, rellenar los `{placeholders}` y enviar por correo.

---

## Cómo usar este template

1. Copiar la sección **Cuerpo del correo** completa
2. Reemplazar todos los `{placeholders}` con los valores reales
3. Adjuntar el `.contract.json` correspondiente si el equipo lo solicita (opcional — ya va inline)
4. Guardar una copia en `docs/releases/{Type}-{Sede}.md` para historial

---

## Asunto del correo

```
[LedgerOps] ✅ {Entidad} — {Operación} lista para testing ({SEDE})
```

Ejemplo: `[LedgerOps] ✅ ItemInventory — Add lista para testing (TEST)`

---

## Cuerpo del correo

---

**[LedgerOps] ✅ {Entidad} — {Operación} lista para testing**

Hola equipo,

La operación **{Entidad} — {Operación}** ya está disponible en el ecosistema LedgerOps para la sede **{SEDE}**.

---

### Inicio rápido

Endpoint: `POST {endpoint_completo}`

Copia este payload y envíalo tal cual — son datos reales verificados en {SEDE}:

```bash
curl -X POST {endpoint_completo} \
  -H "Content-Type: application/json" \
  -d '{
    "type": "{type}",
    "sede": "{SEDE}",
    "version": "{version}",
    "object": "{object}",
    "data": {
      "{type}": {
        {campos_con_valores_reales}
      }
    }
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Campos obligatorios

| Campo | Motivo |
|-------|--------|
{tabla_campos_requeridos}

> Los campos de tipo `Ref` (`IncomeAccountRef`, `COGSAccountRef`, etc.) necesitan el `ListID` de la cuenta correspondiente en esa sede.
> Los ListIDs varían por sede — ver la sección **Cuentas usadas** al final.

---

### Contrato de referencia (todos los campos disponibles)

```json
{contract_json_completo}
```

---

### Cuentas usadas en el ejemplo ({SEDE})

| Campo | ListID | Nombre en QB |
|-------|--------|--------------|
{tabla_cuentas}

> ⚠️ Estos ListIDs son específicos de la sede **{SEDE}**.
> Para otras sedes, solicitar los ListIDs correspondientes antes de hacer pruebas.

---

### Notas de testing

- **Sede:** {SEDE}
- **Registro de prueba creado exitosamente:** `{nombre_item_prueba}` — ListID `{listid_prueba}`
- **Fecha de testing:** {fecha}

Saludos,
{firma}

---

---

## Referencia rápida de placeholders

| Placeholder | Qué poner |
|-------------|-----------|
| `{Entidad}` | Nombre legible de la entidad (ej: `ItemInventory`) |
| `{Operación}` | Add / Mod / Query / Delete |
| `{SEDE}` | Código de sede (ej: `TEST`, `REC`, `MIA`) |
| `{endpoint_completo}` | URL completa del webhook (ej: `https://n8n-development.redsis.ai/webhook/inventory/item/add`) |
| `{type}` | Tipo QB (ej: `ItemInventoryAdd`) |
| `{version}` | Versión QBXML (ej: `17.0`) |
| `{object}` | Objeto QB — igual que `type` en Add/Mod (ej: `ItemInventoryAdd`) |
| `{campos_con_valores_reales}` | JSON con los campos tal como se enviaron en el test exitoso |
| `{tabla_campos_requeridos}` | Filas de la tabla con los campos obligatorios |
| `{contract_json_completo}` | Contenido del `.contract.json` correspondiente |
| `{tabla_cuentas}` | ListIDs de las cuentas usadas en el payload de ejemplo |
| `{nombre_item_prueba}` | Name del ítem/registro creado en el test |
| `{listid_prueba}` | ListID del registro creado |
| `{fecha}` | Fecha del testing |
| `{firma}` | Nombre del desarrollador |
