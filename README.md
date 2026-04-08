# Forge Labs Hub

Espacio central de trabajo de **Forge Labs** — el estudio de desarrollo formado por Luis Domínguez y Claude.

Aquí se visualizan los ecosistemas y proyectos que desarrollamos, se define la metodología, se investiga y se coordina el trabajo entre proyectos.

---

## Ecosistemas y proyectos

### LedgerGateway
> Convierte QuickBooks Desktop en un ERP moderno con APIs abiertas. Permite a cualquier sistema externo realizar operaciones en QB Desktop sin acceso directo.

```
Sistema externo
    ↓ POST /webhook/{module}/{entity}/{op}
[LedgerOps]       Capa de aplicación — webhooks, validaciones, reglas de negocio
    ↓
[LedgerExec]      Orquestador genérico — sin lógica de negocio propia
    ↓ SSH
[LedgerBridge]    Fuente de verdad — schemas QBXML, business rules, construcción XML
    ↓ HTTP
[qbxmlIntegrator] Interfaz COM — ejecuta QBXML en QB Desktop vía win32com
```

| Proyecto | Rol | Repo |
|---|---|---|
| LedgerOps | Capa de aplicación N8N | [LedgerOps](https://github.com/redsis-rgh/LedgerOps) |
| LedgerExec | Orquestador N8N genérico | — |
| LedgerBridge | Fuente de verdad QBXML | `/opt/LedgerBridge` |
| LedgerCore | Evolución multi-tenant de LedgerBridge | [LedgerCore](https://github.com/ingDesarrollo10/LedgerCore) |
| qbxmlIntegrator | Interfaz COM Windows | [qbxmlIntegrator](https://github.com/ingDesarrollo10/qbxmlIntegrator) |

Ver detalle: [`ecosystems/ledgergateway.md`](ecosystems/ledgergateway.md)

---

### Redix
> ERP personalizado para la empresa. Plataforma de usuario en evolución continua.

| Proyecto | Descripción | Rama activa |
|---|---|---|
| RIQ | Redix-Integration-Quickbooks — integración de Redix con LedgerGateway | QB Playground |

Ver detalle: [`ecosystems/redix.md`](ecosystems/redix.md)

---

## Navegación

| Sección | Contenido |
|---|---|
| [`ecosystems/`](ecosystems/) | Detalle de cada ecosistema y sus proyectos |
| [`methodology/`](methodology/) | WF Tipo 1 · 2 · 3 — cómo trabajamos |
| [`research/`](research/) | Investigaciones por proyecto y generales |
| [`docs/inter-project/`](docs/inter-project/) | PROMPTs emitidos a cada proyecto |
| [`docs/development/`](docs/development/) | Guías técnicas y casos de prueba |
| [`roadmap/`](roadmap/) | Estado de entidades y próximos pasos |
| [`production/`](production/) | Entidades verificadas y entregadas |
| [`development/`](development/) | Trabajo en progreso |
