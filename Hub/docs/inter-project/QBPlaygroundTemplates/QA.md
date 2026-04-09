# QB Playground Templates — Guía de Testing

## Acceso al panel de administración

`Redix → Configuración → Integraciones → QB Templates`

---

## TC-01 — Generar template base: auto-default en primera creación

**Precondición:** no existe ningún template para `ItemInventoryAdd` + sede TEST.

1. Abrir el panel QB Templates → clic en **Generar template base**
2. Seleccionar tipo `Item — Add (ItemInventoryAdd)`, sede `TEST`, nombre `"Template Base"`
3. Verificar que aparece la lista de checkboxes con todos los campos del contrato
4. Campos requeridos (req): pre-chequeados y deshabilitados
5. Campos opcionales: desmarcados, pueden seleccionarse libremente
6. Seleccionar algunos opcionales → clic en **Generar template**
7. **Resultado esperado:** template creado con `isDefault = true`

```bash
curl "http://localhost:5170/api/integration/qb-template?type=ItemInventoryAdd&sede=TEST"
# → data.template != null, data.template.isDefault = true
```

---

## TC-02 — Template se aplica automáticamente en el Playground

**Precondición:** TC-01 ejecutado.

1. Ir a QB Playground → seleccionar `Item — Add` y sede `TEST`
2. **Resultado esperado:** formulario muestra solo los campos del template (no los 32 del contrato completo)
3. En el action bar debe aparecer el selector de template con el nombre del template activo

---

## TC-03 — Selector visible con un solo template

**Precondición:** existe exactamente un template para la combinación activa.

1. Con el template del TC-01 activo, verificar el action bar del Playground
2. **Resultado esperado:** el selector aparece con la opción "Todos los campos" y el nombre del template

---

## TC-04 — Opción "Todos los campos" restaura formulario completo

1. Con un template activo en el Playground, seleccionar **Todos los campos** en el selector
2. **Resultado esperado:** el formulario muestra el contrato completo (todos los campos)
3. La preferencia guardada NO se sobrescribe (al recargar vuelve al template)

---

## TC-05 — Preferencia de template se persiste por usuario

1. En el Playground, cambiar a un template específico
2. Recargar la página
3. **Resultado esperado:** el mismo template sigue seleccionado

---

## TC-06 — Editar campos de un template

1. En el panel QB Templates, clic en **Editar** sobre un template
2. Verificar que aparece el editor de checkboxes con todos los campos del contrato
3. Los campos ya guardados aparecen chequeados
4. Campos requeridos: bloqueados
5. Modificar labels de campos opcionales → clic en **Guardar**
6. **Resultado esperado:** los cambios se reflejan en el Playground sin reinicio

---

## TC-07 — Segundo template: auto-default NO se activa

1. Crear un segundo template para `ItemInventoryAdd` + `TEST`
2. **Resultado esperado:** `is_default = false` en el nuevo template; el primero conserva `is_default = true`

---

## TC-08 — Marcar template como default

1. En el panel QB Templates, clic en el ícono ⭐ del segundo template
2. **Resultado esperado:** el segundo template pasa a `isDefault = true`; el primero a `false`
3. Abrir Playground → el template default activo es ahora el segundo

---

## TC-09 — Soft delete

1. Eliminar un template desde el panel
2. **Resultado esperado:**
   - El template desaparece del panel (`is_active = false`)
   - `GET /api/integration/qb-template/list` no lo retorna
   - Si era el default, el Playground vuelve al formulario completo

---

## Errores esperados

| Error | Causa | Solución |
|-------|-------|----------|
| Dropdown de sede vacío en el modal | LO no responde | Verificar que LedgerOps esté activo |
| Tipo no encontrado en contratos estáticos | Tipo no existe en `QB_ACTIONS` | Verificar `contracts.ts` |
| Template no aparece en Playground | `is_default = false` y no hay preferencia guardada | Marcar el template como default desde el panel |
| `500` en `GET /api/integration/qb-template` | BD no accesible | Verificar conexión a PostgreSQL |
