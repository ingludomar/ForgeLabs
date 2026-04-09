#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
const MONDAY_API_URL = 'https://api.monday.com/v2';
const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN || '';
async function mondayQuery(query, variables) {
    const res = await fetch(MONDAY_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': MONDAY_API_TOKEN,
            'API-Version': '2024-01',
        },
        body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors)
        throw new Error(JSON.stringify(json.errors));
    return json.data;
}
const server = new Server({ name: 'ledgerops-monday', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'monday_get_boards',
            description: 'Listar tableros disponibles en Monday.com',
            inputSchema: {
                type: 'object',
                properties: {
                    limit: { type: 'number', description: 'Máximo de tableros a retornar (default 20)' },
                },
            },
        },
        {
            name: 'monday_get_items',
            description: 'Obtener items de un tablero por nombre o ID',
            inputSchema: {
                type: 'object',
                properties: {
                    board_id: { type: 'string', description: 'ID del tablero' },
                    limit: { type: 'number', description: 'Máximo de items (default 20)' },
                },
                required: ['board_id'],
            },
        },
        {
            name: 'monday_create_item',
            description: 'Crear un item (tarea) en un tablero de Monday.com',
            inputSchema: {
                type: 'object',
                properties: {
                    board_id: { type: 'string', description: 'ID del tablero' },
                    item_name: { type: 'string', description: 'Nombre del item/tarea' },
                    group_id: { type: 'string', description: 'ID del grupo dentro del tablero (opcional)' },
                    column_values: { type: 'string', description: 'JSON string con valores de columnas (opcional)' },
                },
                required: ['board_id', 'item_name'],
            },
        },
        {
            name: 'monday_create_subitem',
            description: 'Crear un subitem (subtarea) bajo un item existente en Monday.com',
            inputSchema: {
                type: 'object',
                properties: {
                    parent_item_id: { type: 'string', description: 'ID del item padre' },
                    subitem_name: { type: 'string', description: 'Nombre del subitem/subtarea' },
                    column_values: { type: 'string', description: 'JSON string con valores de columnas (opcional)' },
                },
                required: ['parent_item_id', 'subitem_name'],
            },
        },
        {
            name: 'monday_update_item',
            description: 'Actualizar el nombre o columnas de un item existente',
            inputSchema: {
                type: 'object',
                properties: {
                    board_id: { type: 'string', description: 'ID del tablero' },
                    item_id: { type: 'string', description: 'ID del item a actualizar' },
                    column_values: { type: 'string', description: 'JSON string con los valores de columnas a actualizar' },
                },
                required: ['board_id', 'item_id', 'column_values'],
            },
        },
        {
            name: 'monday_find_board_by_name',
            description: 'Buscar un tablero por nombre (parcial o exacto)',
            inputSchema: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Nombre o parte del nombre del tablero' },
                },
                required: ['name'],
            },
        },
        {
            name: 'monday_get_me',
            description: 'Obtener el perfil del usuario autenticado (incluye ID numérico)',
            inputSchema: { type: 'object', properties: {} },
        },
        {
            name: 'monday_get_users',
            description: 'Listar usuarios del workspace de Monday.com para obtener su ID numérico',
            inputSchema: {
                type: 'object',
                properties: {
                    email: { type: 'string', description: 'Filtrar por email (opcional)' },
                },
            },
        },
        {
            name: 'monday_get_subitem_columns',
            description: 'Obtener las columnas disponibles de un subitem (incluyendo IDs y tipos)',
            inputSchema: {
                type: 'object',
                properties: {
                    subitem_id: { type: 'string', description: 'ID del subitem a inspeccionar' },
                },
                required: ['subitem_id'],
            },
        },
    ],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === 'monday_get_boards') {
            const limit = args?.limit || 20;
            const data = await mondayQuery(`
        query { boards(limit: ${limit}) { id name description } }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.boards, null, 2) }] };
        }
        if (name === 'monday_find_board_by_name') {
            const nameFilter = (args?.name).toLowerCase();
            const data = await mondayQuery(`
        query { boards(limit: 50) { id name } }
      `);
            const matches = data.boards.filter(b => b.name.toLowerCase().includes(nameFilter));
            return { content: [{ type: 'text', text: JSON.stringify(matches, null, 2) }] };
        }
        if (name === 'monday_get_items') {
            const { board_id, limit = 20 } = args;
            const data = await mondayQuery(`
        query {
          boards(ids: [${board_id}]) {
            groups { id title }
            items_page(limit: ${limit}) {
              items { id name group { id title } }
            }
          }
        }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.boards, null, 2) }] };
        }
        if (name === 'monday_create_item') {
            const { board_id, item_name, group_id, column_values } = args;
            const groupPart = group_id ? `, group_id: "${group_id}"` : '';
            const colPart = column_values ? `, column_values: ${JSON.stringify(column_values)}` : '';
            const data = await mondayQuery(`
        mutation {
          create_item(board_id: ${board_id}, item_name: "${item_name}"${groupPart}${colPart}) {
            id name
          }
        }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.create_item, null, 2) }] };
        }
        if (name === 'monday_create_subitem') {
            const { parent_item_id, subitem_name, column_values } = args;
            const colPart = column_values ? `, column_values: ${JSON.stringify(column_values)}` : '';
            const data = await mondayQuery(`
        mutation {
          create_subitem(parent_item_id: ${parent_item_id}, item_name: "${subitem_name}"${colPart}) {
            id name
          }
        }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.create_subitem, null, 2) }] };
        }
        if (name === 'monday_update_item') {
            const { board_id, item_id, column_values } = args;
            const data = await mondayQuery(`
        mutation {
          change_multiple_column_values(
            board_id: ${board_id},
            item_id: ${item_id},
            column_values: ${JSON.stringify(column_values)}
          ) { id name }
        }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.change_multiple_column_values, null, 2) }] };
        }
        if (name === 'monday_get_subitem_columns') {
            const { subitem_id } = args;
            const data = await mondayQuery(`
        query {
          items(ids: [${subitem_id}]) {
            id name
            board { id name }
            column_values {
              id
              column { id title type }
              text
              value
            }
          }
        }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.items, null, 2) }] };
        }
        if (name === 'monday_get_users') {
            const { email } = (args || {});
            const data = await mondayQuery(`
        query { users { id name email } }
      `);
            const result = email
                ? data.users.filter(u => u.email.toLowerCase().includes(email.toLowerCase()))
                : data.users;
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        if (name === 'monday_get_me') {
            const data = await mondayQuery(`
        query { me { id name email } }
      `);
            return { content: [{ type: 'text', text: JSON.stringify(data.me, null, 2) }] };
        }
        return { content: [{ type: 'text', text: `Tool not found: ${name}` }] };
    }
    catch (err) {
        return { content: [{ type: 'text', text: `Error: ${String(err)}` }], isError: true };
    }
});
async function main() {
    if (!MONDAY_API_TOKEN) {
        console.error('Error: MONDAY_API_TOKEN no está configurado en .env');
        process.exit(1);
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main();
