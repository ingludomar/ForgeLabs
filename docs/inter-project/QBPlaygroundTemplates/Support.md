# QB Playground Templates — Guía de Soporte y Uso

## ¿Qué es esta función?

Los **QB Templates** permiten a un administrador definir qué campos aparecen en el QB Playground
para cada tipo de operación y sede. En lugar de ver los 32 campos del formulario completo, los
usuarios solo ven los campos relevantes para su trabajo diario.

---

## Cómo acceder al panel de administración

1. Iniciar sesión con una cuenta de **Administrador**
2. Ir a **Configuración** → **Integraciones** → **QB Templates**

---

## Cómo crear un template

1. Clic en **Generar template base**
2. Seleccionar el **Tipo de Operación** (ej. `Item — Add`)
3. Seleccionar la **Sede**
4. Ingresar un nombre descriptivo
5. Clic en **Siguiente** — el sistema carga los campos del contrato
6. En la lista de checkboxes:
   - Campos marcados con **req**: siempre incluidos, no se pueden desmarcar
   - Campos opcionales: marcar los que deben aparecer en el Playground
   - El **label** de cualquier campo puede editarse haciendo clic sobre el texto
7. Clic en **Generar template**

> El primer template creado para una combinación tipo + sede se activa automáticamente como default.

---

## Cómo editar un template

1. En la lista, clic en el ícono **lápiz** del template
2. Se carga el editor de checkboxes con los campos actuales
3. Marcar, desmarcar o editar labels según sea necesario
4. Clic en **Guardar**

El cambio aplica de inmediato en el Playground — no es necesario reiniciar la aplicación.

---

## Cómo marcar un template como default

Cuando existe más de un template para una misma operación y sede, solo uno puede ser el default
(el que el Playground aplica automáticamente).

1. Localizar el template que debe ser el nuevo default
2. Clic en el ícono **⭐**
3. El badge **Default** se mueve a ese template

---

## Cómo eliminar un template

1. Clic en el ícono **papelera** del template
2. Confirmar la eliminación

El template se desactiva (no se borra físicamente). Si era el default, el Playground volverá al
formulario completo hasta que otro template se marque como default.

---

## Cómo usar los templates en el QB Playground

Cuando existe al menos un template para la combinación activa (tipo + sede), aparece un
**selector** en el action bar del Playground:

- Seleccionar un template → el formulario se reduce a solo esos campos
- Seleccionar **Todos los campos** → el formulario muestra el contrato completo
- La selección se guarda por usuario — al volver al Playground el mismo template estará activo

---

## Cuándo usar esta función

- Al incorporar un nuevo usuario a operaciones QB: crear un template con solo los campos que
  debe completar
- Al detectar errores frecuentes por campos incorrectamente llenados: eliminar esos campos del
  template
- Al migrar de sede TEST a producción: crear templates equivalentes para la sede de producción

---

## Qué NO hacer

- **No eliminar el template default sin tener otro listo** — el Playground volverá al
  formulario completo con todos los campos
- **No desmarcar campos requeridos** — el sistema no lo permite; son obligatorios para QB Desktop
- **No crear templates duplicados** — si ya existe un template con el mismo nombre para esa
  operación y sede, el sistema rechazará la creación
