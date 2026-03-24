# SyncBridge — Instrucciones para Claude Code

## Qué es este proyecto
SyncBridge es el espacio de dirección del ecosistema. No es un componente técnico — es la metodología, las decisiones y el roadmap. No se despliega, no tiene webhooks, no tiene código de producción.

## Comunicación
- Con el usuario: **español**
- Código, paths, nombres técnicos: **inglés**
- Documentación: **español**

## El ecosistema — 4 componentes

| Proyecto | Rol | Repo |
|---|---|---|
| **LedgerOps** | Capa de aplicación N8N. Expone webhooks, valida, aplica reglas de negocio, delega a LedgerExec. | `/Users/luisdominguez/Documents/GitHub/LedgerOps` |
| **LedgerExec** | Orquestador N8N genérico. Recibe de LedgerOps, invoca LedgerBridge vía SSH. Sin lógica de negocio. | — |
| **LedgerBridge** | Fuente de verdad. Construye QBXML, valida schemas, aplica business rules, parsea respuestas QB. | `/opt/LedgerBridge` |
| **qbxmlIntegrator** | Interfaz COM. Recibe QBXML de LedgerBridge, lo ejecuta en QB Desktop via win32com. | `/Users/luisdominguez/Documents/GitHub/qbxmlIntegrator` |

## Propósito de cada carpeta

| Carpeta | Uso |
|---|---|
| `ecosystem/` | Arquitectura, roles, decisiones técnicas (ADRs) |
| `methodology/` | Cómo se trabaja — P1-P5, entregas, PROMPTs |
| `roadmap/` | Qué está hecho y qué viene |
| `ideas/` | Borradores, experimentos, conversaciones |

## Regla de oro
Lo que vive aquí NO va a los proyectos técnicos. Los proyectos técnicos deben poder operar sin este repositorio.
