# MCP — Monday.com (LedgerOps)

Servidor MCP que expone la API de Monday.com como herramientas para Claude Code.

## Setup

```bash
# 1. Instalar dependencias
cd mcp/monday && npm install

# 2. Crear archivo .env con tu API token de Monday
cp .env.example .env
# Editar .env y agregar tu token

# 3. Compilar
npm run build

# 4. Registrar en Claude Code (scope local al proyecto)
claude mcp add ledgerops-monday node /ruta/absoluta/LedgerOps/mcp/monday/dist/index.js
```

## Obtener el API Token de Monday

1. Ir a Monday.com → tu avatar (esquina inferior izquierda)
2. Admin → API
3. Copiar el **Personal API Token**

## Herramientas disponibles

| Herramienta | Descripción |
|---|---|
| `monday_get_boards` | Listar tableros disponibles |
| `monday_find_board_by_name` | Buscar tablero por nombre |
| `monday_get_items` | Ver items de un tablero |
| `monday_create_item` | Crear tarea en un tablero |
| `monday_create_subitem` | Crear subtarea bajo un item |
| `monday_update_item` | Actualizar columnas de un item |

## Uso típico

```
"Busca el tablero LedgerOps y crea un subitem llamado 'Metodología CRUD' bajo el item LedgerOps"
```
