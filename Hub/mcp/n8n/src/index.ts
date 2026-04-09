import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const N8N_BASE_URL = process.env.N8N_BASE_URL!;
const N8N_API_KEY = process.env.N8N_API_KEY!;

if (!N8N_BASE_URL || !N8N_API_KEY) {
  process.stderr.write("ERROR: N8N_BASE_URL and N8N_API_KEY are required\n");
  process.exit(1);
}

const api = axios.create({
  baseURL: `${N8N_BASE_URL}/api/v1`,
  headers: {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json",
  },
});

const server = new McpServer({
  name: "ledgerops-n8n",
  version: "1.0.0",
});

// ── list_workflows ─────────────────────────────────────────────────────────
server.registerTool(
  "n8n_list_workflows",
  { description: "List all workflows in N8N. Returns id, name, active status and tags." },
  async () => {
    const res = await api.get("/workflows");
    const workflows = res.data.data.map((w: any) => ({
      id: w.id,
      name: w.name,
      active: w.active,
      tags: w.tags?.map((t: any) => t.name) ?? [],
      updatedAt: w.updatedAt,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(workflows, null, 2) }],
    };
  }
);

// ── get_workflow ───────────────────────────────────────────────────────────
server.registerTool(
  "n8n_get_workflow",
  {
    description: "Get the full JSON of a workflow by its ID.",
    inputSchema: { id: z.string().describe("Workflow ID") },
  },
  async ({ id }) => {
    const res = await api.get(`/workflows/${id}`);
    return {
      content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
    };
  }
);

// ── create_workflow ────────────────────────────────────────────────────────
server.registerTool(
  "n8n_create_workflow",
  {
    description:
      "Create a new workflow in N8N. Pass the full workflow JSON object (name, nodes, connections, settings).",
    inputSchema: {
      workflow: z.record(z.string(), z.any()).describe("Full workflow JSON object"),
    },
  },
  async ({ workflow }) => {
    const res = await api.post("/workflows", workflow);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { id: res.data.id, name: res.data.name, active: res.data.active },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── update_workflow ────────────────────────────────────────────────────────
server.registerTool(
  "n8n_update_workflow",
  {
    description: "Update an existing workflow by ID. Pass the full workflow JSON to replace it.",
    inputSchema: {
      id: z.string().describe("Workflow ID"),
      workflow: z.record(z.string(), z.any()).describe("Full workflow JSON object"),
    },
  },
  async ({ id, workflow }) => {
    // N8N API rejects 'description' as additional property — strip it before PUT
    const { description: _desc, ...cleanWorkflow } = workflow as any;
    const res = await api.put(`/workflows/${id}`, cleanWorkflow);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { id: res.data.id, name: res.data.name, active: res.data.active },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── activate_workflow ──────────────────────────────────────────────────────
server.registerTool(
  "n8n_activate_workflow",
  {
    description: "Activate a workflow so its webhook becomes live.",
    inputSchema: { id: z.string().describe("Workflow ID") },
  },
  async ({ id }) => {
    const res = await api.post(`/workflows/${id}/activate`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { id: res.data.id, name: res.data.name, active: res.data.active },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── deactivate_workflow ────────────────────────────────────────────────────
server.registerTool(
  "n8n_deactivate_workflow",
  {
    description: "Deactivate a workflow (webhook goes offline).",
    inputSchema: { id: z.string().describe("Workflow ID") },
  },
  async ({ id }) => {
    const res = await api.post(`/workflows/${id}/deactivate`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { id: res.data.id, name: res.data.name, active: res.data.active },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── delete_workflow ────────────────────────────────────────────────────────
server.registerTool(
  "n8n_delete_workflow",
  {
    description: "Delete a workflow permanently by ID.",
    inputSchema: { id: z.string().describe("Workflow ID") },
  },
  async ({ id }) => {
    await api.delete(`/workflows/${id}`);
    return {
      content: [{ type: "text", text: `Workflow ${id} deleted.` }],
    };
  }
);

// ── get_executions ─────────────────────────────────────────────────────────
server.registerTool(
  "n8n_get_executions",
  {
    description: "Get recent executions for a workflow.",
    inputSchema: {
      workflowId: z.string().optional().describe("Filter by workflow ID (optional)"),
      limit: z.number().optional().default(20).describe("Max results (default 20)"),
    },
  },
  async ({ workflowId, limit }) => {
    const params: Record<string, any> = { limit };
    if (workflowId) params.workflowId = workflowId;
    const res = await api.get("/executions", { params });
    const executions = res.data.data.map((e: any) => ({
      id: e.id,
      workflowId: e.workflowId,
      status: e.status,
      startedAt: e.startedAt,
      stoppedAt: e.stoppedAt,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(executions, null, 2) }],
    };
  }
);

// ── get_execution ──────────────────────────────────────────────────────────
server.registerTool(
  "n8n_get_execution",
  {
    description: "Get full detail of a specific execution, including node outputs.",
    inputSchema: { id: z.string().describe("Execution ID") },
  },
  async ({ id }) => {
    const res = await api.get(`/executions/${id}`);
    return {
      content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
    };
  }
);

// ── start ──────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("LedgerOps N8N MCP server running\n");
