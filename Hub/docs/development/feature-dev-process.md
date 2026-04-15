# SyncBridge — Proceso estándar de desarrollo por feature

> SB es responsable del ciclo completo de cada feature — desde análisis hasta cierre formal.
> Los proyectos técnicos (RIQ, LO, LC, LB) ejecutan lo que SB les instruye vía PROMPT.

---

## Clasificación de features

Todo trabajo que entra a SyncBridge es un feature. Antes de iniciar, clasificar:

| Tipo | Descripción | Ejemplo | Destinatario del correo |
|---|---|---|---|
| **Tipo 1 — Entidad QB** | Integración de una entidad QB Desktop vía LedgerOps | ItemInventory, Vendor, SalesOrder | Celia Giraldo |
| **Tipo 2 — Feature de plataforma** | Funcionalidad nueva en Redix (RIQ) visible para el usuario | QB Playground, Webhook Admin, Templates | Luis Potte CC Mike Habib |
| **Tipo 3 — Infraestructura** | Mejora interna sin entrega al usuario final | Singleton WebhookResolver, DB de templates | — (sin correo) |

**Regla universal:** Ningún feature se cierra sin verificación E2E completa desde la app. No basta con pruebas de API.

### Actores

| Símbolo | Actor | Rol |
|---|---|---|
| **SB** | SyncBridge (Claude Code) | Orquesta, documenta, produce artefactos |
| **USR** | Usuario (Luis) | Lleva PROMPTs a los proyectos, envía correos, confirma |
| **PRY** | Proyecto responsable (RIQ / LO / LC / LB) | Implementa, entrega contenido, hace push |

> Los proyectos técnicos no saben qué sigue después de su entrega — SB decide el siguiente paso.

---

## Ciclo de vida universal — todo feature sin excepción

Todo feature, independientemente de su tipo, sigue este ciclo de 5 pasos antes de entrar a su flujo específico (P0-P5 / F1-F8 / I1-I4):

| Paso | Actor | Acción | Monday |
|---|---|---|---|
| **1. Analizar** | SB | Clasificar el feature (Tipo 1/2/3), entender el alcance, identificar proyectos involucrados | — |
| **2. Definir tareas** | SB | Establecer los subitems que componen el trabajo — uno por entregable o PROMPT clave | — |
| **3. Planificar** | SB | Crear el item en Monday con todos los subitems → grupo **Planificación** | Item en grupo Planificación |
| **4. Ejecutar** | SB + USR | Al iniciar el trabajo: mover el item a grupo **Ejecución** + registrar fecha de inicio del item. Al completar cada subtarea: registrar fecha de cierre en esa subtarea | Item en grupo Ejecución · fecha inicio en item · fecha cierre en cada subtarea al terminar |
| **5. Lanzar** | SB | Cuando todas las subtareas están completas: mover item a grupo **Lanzamiento** | Item en grupo Lanzamiento |

> Este ciclo aplica a **todos los items de Monday** — work items y delivery items de cualquier tipo de feature.

---

## Tipo 1 — Entidad QB (P0-P5)

> Flujo completo

```
SB ejecuta:
  P0 — RMX Global       Un solo PROMPT a LedgerBridge para todos los tipos QB pendientes
  P1 — AnalyzeSedeFields   Datos reales de todas las sedes (TEST · RUS · REC · RBR · RMX)
  P2 — Business Rules      Registrar requiredBySede en todas las sedes
  P3 — Workflow            Crear en development/, probar, mover a production/
  P4 — Testing             CRUD completo en sede TEST (E2E desde la app cuando aplica)
  P5 — Cierre formal       Docs por rol → PROMPT a LO → esperar confirmación → correo → Monday

LO aplica:
  Recibe PROMPT de SB → guarda archivos → hace commit → confirma éxito
```

### Ciclo completo — orden y actores

| # | Actor | Acción | Monday | ⏸ Esperar |
|---|---|---|---|---|
| 1 | SB | Clasifica como Tipo 1 · define tareas · crea work item + delivery item en Monday | Crear items → grupo **Planificación** | — |
| 2 | SB | Inicia el trabajo · emite PROMPT-LB a LedgerBridge para schemas v13.0 RMX (P0) | Mover items → grupo **Ejecución** · registrar fecha de inicio | ⏸ Confirmación de LedgerBridge |
| 3 | SB | Ejecuta AnalyzeSedeFields en TEST · RUS · REC · RBR (P1 — en paralelo con P0) | — | — |
| 4 | SB | Ejecuta AnalyzeSedeFields en RMX (P1 — solo tras confirmar P0) | Cerrar subtarea P1 · registrar fecha | — |
| 5 | SB | Registra business rules Add + Mod en todas las sedes (P2) | Cerrar subtarea P2 · registrar fecha | — |
| 6 | SB | Compara contratos v17.0 vs v13.0 → documenta diferencias (P2.5) | — | — |
| 7 | SB | Crea workflow en `development/` → sube a N8N → activa → prueba (P3) | Cerrar subtarea P3 · registrar fecha | — |
| 8 | SB | Ejecuta CRUD completo en TEST → verified.json → mueve a `production/` (P4) | Cerrar subtarea P4 · registrar fecha | ⏸ CRUD sin errores |
| 9 | SB | Genera 6 docs por rol + PROMPT a LO con todos los artefactos (P5.1 + P5.2) | — | — |
| 10 | USR | Lleva el PROMPT a LO | — | ⏸ LO confirma commit + workflows activos |
| 11 | SB | Genera correo de entrega (P5.4) | Cerrar subtarea Docs · registrar fecha (work item + delivery item) | — |
| 12 | USR | Envía correo a Celia Giraldo | — | ⏸ Usuario confirma envío |
| 13 | SB | Actualiza `roadmap.md` + `features.md` (P5.6) | Cerrar subtarea Correo · registrar fecha · `project_status = Listo` | — |
| 14 | SB | Mueve ambos items a grupo Lanzamiento | Mover items → grupo **Lanzamiento** | — |
| 15 | SB | Commit en SyncBridge con todos los artefactos (P5.7) | — | — |
| **FIN** | — | Feature cerrado | Items en Lanzamiento + SyncBridge commit | — |

---

## Estructura de carpetas en SB

```
SB/
├── development/          ← trabajo en curso (borrador, en prueba)
│   ├── purchasing/
│   ├── sales/
│   ├── banking/
│   ├── contacts/
│   └── inventory/
└── production/           ← verificado, listo para clonar en LO
    ├── purchasing/
    ├── sales/
    ├── banking/
    ├── contacts/
    └── inventory/
```

Cuando P4 está completo → mover de `development/` a `production/`.

---

## P0 — PROMPT RMX (por entidad, antes de P1)

Emitir PROMPT a LedgerBridge solicitando los schemas v13.0 para la entidad que se va a trabajar.
RMX usa QB Desktop 2021 — necesita schemas v13.0 antes de poder ejecutar P1+P2 en esa sede.

Formato: `Hub/docs/inter-project/ledgerbridge/PROMPT-{NNN}-{entidad}-rmx-schema.md`
Actualizar índice: `Hub/docs/inter-project/README.md`

Entregar al usuario para que lo lleve a LedgerBridge.
**Esperar confirmación antes de ejecutar P1+P2 en RMX.**
P1+P2 en TEST · RUS · REC · RBR pueden ejecutarse en paralelo mientras se espera.

---

## P1 — AnalyzeSedeFields

Ejecutar para la entidad en **todas las sedes**: TEST · RUS · REC · RBR · RMX

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/analyze-sede-fields \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "TEST", "version": "17.0", "limit": 20 }'
```

**Output clave:**
- `suggestedRequiredBySede` — paths QBXML obligatorios por sede
- `sampleRecord` — registro real con valores válidos
- `listIDs` — ListIDs reales para usar en testing
- `fieldCoverage` — umbral mínimo: 1.0 (100%)

---

## P2 — Business Rules

Registrar `requiredBySede` en LedgerBridge para todas las sedes (Add + Mod por separado).

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/business-rules/replace \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "TEST", "version": "17.0", "paths": [...] }'
```

Repetir para: **TEST · RUS · REC · RBR · RMX**

Verificar: `POST /webhook/tools/contract` → `info.requiredBySede` debe mostrar los campos.

---

## P2.5 — Verificar diferencias de contrato por versión

Después de registrar las business rules en todas las sedes, comparar el contrato generado entre versiones para identificar y documentar diferencias.

**Ejecutar GenerateContract para ambas versiones:**

```bash
# v17.0 — sedes TEST · RUS · REC · RBR
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/contract \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "TEST", "version": "17.0" }'

# v13.0 — sede RMX
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/contract \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "RMX", "version": "13.0" }'
```

**Comparar y registrar:**
- ¿Qué campos existen en v17.0 pero no en v13.0?
- ¿Qué campos son requeridos en RMX pero opcionales en otras sedes (o viceversa)?
- ¿El payload mínimo funcional es diferente entre versiones?

**Output:** Las diferencias documentadas se incluyen en el **developer doc (P5.1)** como sección separada por versión:

```
## Contrato

### QB Desktop 2024 — QBXML v17.0
> Sedes: TEST · RUS · REC · RBR
{contrato v17.0}

### QB Desktop 2021 — QBXML v13.0
> Sede: RMX
{contrato v13.0 — solo si difiere de v17.0}
```

> Si los contratos son idénticos entre versiones, documentar una sola sección con nota: "Válido para todas las sedes y versiones."

---

## P3 — Workflow

1. Crear el workflow JSON en `development/{modulo}/`
2. Subirlo a N8N vía MCP (`n8n_create_workflow`)
3. Activar desde la UI de N8N (el toggle — no usar API `/activate`)
4. Probar manualmente que el webhook responde
5. Cuando P4 esté completo → mover a `production/{modulo}/`

**Patrón estándar:**
```
Webhook → Code Validate → IF OK
  ✅ → HTTP LedgerExec → Respond Result
  ❌ → Respond Validation Error
```

**Payload hacia LedgerExec:**
- Add/Mod: `object: type+'Rq'`, `data: { [type+'Rq']: { [type]: body.data } }`
- Query: `object: type+'Rq'`, `data: { [type+'Rq']: body.data }`

---

## P4 — Testing (sede TEST)

Consultar `tests/{modulo}/{Entidad}Add-TEST.verified.json` antes de ejecutar.

Orden obligatorio:
```
TC-ADD-01 → TC-QRY-01 → TC-MOD-01 → TC-DEL-01 → TC-DEL-02   (flujo positivo)
TC-ADD-02/03/04                                                (negativos Add)
TC-MOD-02/03/04                                                (negativos Mod)
```

Al obtener éxito → actualizar `successfulRecords` y `lastSuccessfulResponse` en el verified.json.

---

## P5 — Cierre formal

### P5.1 — Documentación por rol (6 archivos en LO)
Preparar los 6 docs para `docs/integration/`:
quickstart · executive · developer · architect · qa · support

### P5.2 — PROMPT a LO
Generar PROMPT con todo lo producido:
- Workflow JSON (desde `production/{modulo}/`)
- Verified payload (`verified.json`)
- Business rules registradas (sedes + paths)
- Docs por rol (6 archivos)
- Known issues

Entregar al usuario para que LO lo aplique.
**Esperar confirmación de LO antes de continuar.**

### P5.3 — LO confirma éxito
LO aplica los archivos, hace commit, activa workflows en producción y confirma.
Solo cuando LO confirma → proceder con P5.4 y P5.5.

### P5.4 — Correo de entrega
Generar ASUNTO + CUERPO siguiendo la sección **"Correo de entrega"** de `CLAUDE.md`.
Entregar al usuario para envío manual.
Esperar confirmación del usuario de que el correo fue enviado antes de cerrar en Monday.

### P5.5 — Monday.com
**Item de trabajo** (ej. "SyncBridge | LedgerOps | {Entidad}"):
- 7 subitems: P1 · PROMPT-RMX · P2 · P3 · P4 · Documentación por rol · Correo enviado
- A nivel de **item**: Estado = `Listo` · Owner = Luis (56420968) · Cronograma = rango derivado de subitems · Grupo = Lanzamiento
- A nivel de **subitem**: Estado = `Done` · Owner = Luis (56420968) · Fecha = fecha en que se completó esa fase

**Item de entrega formal** (ej. "LedgerOps | Entrega formal · {Entidad} v{version}"):
- 2 subitems: Documentación por rol · Correo enviado
- A nivel de **item**: Estado = `Listo` · Owner = Luis (56420968) · Cronograma = rango derivado de subitems · Grupo = Lanzamiento · Comentario de entrega
- A nivel de **subitem**: Estado = `Done` · Owner = Luis (56420968) · Fecha = fecha en que se completó esa fase

**Regla de cronograma (project_timeline):**
- Tomar las fechas de todos los subitems del item
- Si todas son iguales → `from` = `to` = esa fecha
- Si son distintas → `from` = fecha mínima · `to` = fecha máxima

### P5.6 — Actualizar roadmap
- `Hub/docs/development/features.md` → operaciones en ✅
- `Hub/docs/development/roadmap.md` → entidad en ✅ con fecha de entrega

### P5.7 — Commit en SyncBridge
Hacer commit en el repo SyncBridge con todos los artefactos generados durante el flujo:
- Workflows JSON (`development/` y `production/`)
- `verified-{entidad}.json`
- PROMPTs emitidos (`Hub/docs/inter-project/`)
- `Hub/docs/development/bitacora.md` actualizada
- `Hub/docs/development/roadmap.md` + `features.md` actualizados
- `Hub/docs/inter-project/README.md` actualizado

---

## Tipo 2 — Feature de plataforma (F1-F8)

Features visibles para el usuario final en Redix. Involucran principalmente a RIQ, y opcionalmente a LO o LC.

### Ciclo completo — orden y actores

| # | Actor | Acción | Monday | ⏸ Esperar |
|---|---|---|---|---|
| 1 | SB | Clasifica como Tipo 2 · define tareas · crea work item + delivery item en Monday | Crear items → grupo **Planificación** | — |
| 2 | SB | Inicia el trabajo · crea PROMPT con contexto + solicitud de propuesta de diseño (F1) | Mover items → grupo **Ejecución** · registrar fecha de inicio | — |
| 3 | USR | Lleva el PROMPT al proyecto responsable | — | ⏸ Proyecto entrega propuesta de diseño |
| 4 | SB | Evalúa la propuesta → aprueba o ajusta → registra aprobación en el PROMPT | — | — |
| 5 | USR | Notifica al proyecto que puede implementar | — | ⏸ Proyecto confirma implementación completa |
| 6 | SB | Registra la implementación en el PROMPT (F2) | Cerrar subtarea del PROMPT · registrar fecha | — |
| 7 | SB + USR | Verifica E2E desde el UI de Redix — flujo positivo + errores esperados (F3) | — | ⏸ E2E completo sin bloqueos |
| 8 | SB | Solicita al proyecto los 5 docs por rol + emite PROMPT a LO para publicarlos (F4) | — | — |
| 9 | USR | Lleva el PROMPT a LO | — | ⏸ LO confirma commit con docs publicados |
| 10 | SB | Actualiza PROMPT-LO · notifica al proyecto para push (F5) | Cerrar subtarea Docs · registrar fecha (work item + delivery item) | — |
| 11 | USR | Le pide al proyecto que suba la rama al repo remoto | — | ⏸ Proyecto confirma push (branch + commit) |
| 12 | SB | Registra el push en el PROMPT del proyecto | — | — |
| 13 | SB | Actualiza PROMPTs · `project_status = Listo` en ambos items (F6) | Cerrar subtareas · registrar fechas · mover items → grupo **Lanzamiento** | — |
| 14 | SB | Commit en ForgeLabs Hub — PROMPTs + README.md (F7) | — | — |
| 15 | SB | Genera correo de entrega (F8) | — | — |
| 16 | USR | Envía correo a Luis Potte CC Mike Habib | — | ⏸ Usuario confirma envío |
| **FIN** | — | Feature cerrado | Items en Lanzamiento + ForgeLabs commit + correo enviado | — |
| **FIN** | — | Feature cerrado | Items en Lanzamiento + SyncBridge commit | — |

### Fases F1-F2 en el mismo PROMPT

Cuando el scope es pequeño, el mismo archivo PROMPT puede contener propuesta → aprobación → implementación → verificación en secciones separadas. Cuando el scope es grande → un PROMPT por fase.

---

### Detalle de cada fase

```
F1 — PROMPT de propuesta
     Emitir PROMPT al proyecto responsable (RIQ / LC / LO)
     El PROMPT solicita propuesta de diseño antes de implementar
     SB espera la propuesta → evalúa → aprueba o ajusta

F2 — Implementación
     El proyecto implementa según el diseño aprobado
     El resultado se embebe en el PROMPT de origen (no archivos separados)

F3 — Verificación E2E
     Flujo completo desde el UI de Redix — no solo API/curl
     Todos los casos: flujo positivo + errores esperados
     Solo cuando E2E pasa → feature considerado implementado

F4 — Documentación por rol
     5 docs mínimos: Executive · Developer · Architect · QA · Support
     El proyecto responsable entrega el contenido en Markdown
     LO publica en docs/platform/{Feature}/ vía PROMPT de SB

F5 — Push del proyecto responsable
     El proyecto sube la rama al repo remoto
     SB actualiza el PROMPT con el commit y la rama

F6 — Monday
     Item de trabajo con subitems por fase + item de entrega formal
     Mover ambos items a grupo Lanzamiento · cerrar subtareas con fechas

F7 — Commit en ForgeLabs Hub
     PROMPTs emitidos + índice README.md actualizados

F8 — Correo de entrega (cierre formal)
     Destinatario: Luis Potte · CC Mike Habib
     Último paso — todo interno debe estar cerrado antes de enviar
     Esperar confirmación del usuario
```

### Reglas Tipo 2

- **Diseño primero:** ningún PROMPT de Tipo 2 pide implementación directa. Siempre se solicita propuesta → SB aprueba → luego implementación.
- **E2E obligatorio:** verificación desde el UI de la app, no desde Postman o curl.
- **LO publica docs:** el proyecto responsable entrega el contenido Markdown en su respuesta — SB genera el PROMPT a LO para que lo ubique en el repo.
- **Push es responsabilidad del proyecto:** RIQ sube su rama, LC sube su rama — SB solo registra el commit en el PROMPT.

---

## Tipo 3 — Infraestructura (I1-I4)

Mejoras internas sin entrega al usuario final. Ejemplos: singleton de servicio, pool de conexiones, migración de DB, configuración de entorno.

### Ciclo completo — orden y actores

| # | Actor | Acción | Monday | ⏸ Esperar |
|---|---|---|---|---|
| 1 | SB | Clasifica como Tipo 3 · define tareas · crea work item en Monday (sin delivery item) | Crear item → grupo **Planificación** | — |
| 2 | SB | Inicia el trabajo · crea PROMPT con contexto + solicitud de propuesta (I1) | Mover item → grupo **Ejecución** · registrar fecha de inicio | — |
| 3 | USR | Lleva el PROMPT al proyecto responsable | — | ⏸ Proyecto entrega propuesta de diseño |
| 4 | SB | Evalúa → aprueba o ajusta → registra aprobación en el PROMPT | — | — |
| 5 | USR | Notifica al proyecto que puede implementar | — | ⏸ Proyecto confirma implementación + verificación técnica |
| 6 | SB | Registra resultado en el PROMPT → marca ✅ solved (I2 + I3) | Cerrar subtarea del PROMPT · registrar fecha | — |
| 7 | USR | Le pide al proyecto que suba la rama al repo remoto | — | ⏸ Proyecto confirma push (branch + commit) |
| 8 | SB | Registra el push en el PROMPT (I4) · `project_status = Listo` | Cerrar subtarea push · mover item → grupo **Lanzamiento** | — |
| 9 | SB | Commit en SyncBridge — PROMPT + README.md actualizados | — | — |
| **FIN** | — | Feature cerrado | Item en Lanzamiento + SyncBridge commit | — |

### Detalle de cada fase

```
I1 — PROMPT de propuesta
     Contexto del problema + solicitud de propuesta de diseño
     SB evalúa y aprueba antes de que el proyecto implemente

I2 — Implementación
     El proyecto implementa según diseño aprobado
     Resultado embebido en el PROMPT

I3 — Verificación técnica
     El sistema funciona correctamente después del cambio
     No requiere validación desde el UI de Redix (a menos que afecte UX)

I4 — Push y cierre
     Push al repo correspondiente
     SB actualiza el PROMPT con el commit
     Sin correo · sin delivery item en Monday
```

### Reglas Tipo 3

- Sin correo de entrega — es una mejora interna.
- Monday: solo item de trabajo (sin item de entrega).
- Si el cambio afecta algo visible al usuario → reclasificar como Tipo 2.

---

## Checklist rápido — Tipo 1

```
INI [ ] Monday: work item + delivery item creados → grupo Planificación
    [ ] Items movidos a grupo Ejecución · fecha de inicio registrada
P0  [ ] PROMPT-{NNN} RMX emitido para esta entidad → confirmado por LedgerBridge
P1  [ ] AnalyzeSedeFields ejecutado en TEST · RUS · REC · RBR · RMX → subtarea cerrada en Monday
P2  [ ] business-rules/replace ejecutado (Add + Mod) en todas las sedes → subtarea cerrada
P2.5[ ] Contratos v17.0 vs v13.0 comparados → diferencias documentadas
P3  [ ] Workflow en development/ → subido a N8N → activo → subtarea cerrada
P4  [ ] CRUD completo verificado en TEST → verified.json actualizado → movido a production/ → subtarea cerrada
P5  [ ] 6 docs por rol preparados
    [ ] PROMPT generado y entregado a LO
    [ ] LO confirma commit + workflows activos en producción → subtarea Docs cerrada en Monday
    [ ] Correo generado → entregado al usuario → usuario confirma envío → subtarea Correo cerrada
    [ ] roadmap.md + features.md actualizados
    [ ] project_status = Listo · items movidos a grupo Lanzamiento
    [ ] Commit en SyncBridge — workflows + verified.json + PROMPTs + bitácora + roadmap
```

## Checklist rápido — Tipo 2

```
INI [ ] Monday: work item + delivery item creados → grupo Planificación
    [ ] Items movidos a grupo Ejecución · fecha de inicio registrada
F1  [ ] PROMPT emitido → propuesta recibida del proyecto
    [ ] SB evaluó y aprobó la propuesta (con ajustes si aplica)
F2  [ ] Implementación confirmada — subtarea del PROMPT cerrada en Monday
F3  [ ] E2E verificado desde el UI de Redix (no solo API)
F4  [ ] 5 docs por rol entregados → PROMPT a LO → LO confirma commit → subtarea Docs cerrada
F5  [ ] Push del proyecto responsable confirmado (rama + commit)
F6  [ ] Monday: subtareas cerradas con fechas · project_status = Listo · items → grupo Lanzamiento
F7  [ ] Commit en ForgeLabs Hub (PROMPTs + README.md)
F8  [ ] Correo generado → entregado al usuario → usuario confirma envío
```

## Checklist rápido — Tipo 3

```
INI [ ] Monday: work item creado (sin delivery item) → grupo Planificación
    [ ] Item movido a grupo Ejecución · fecha de inicio registrada
I1  [ ] PROMPT emitido → propuesta recibida → SB aprobó
I2  [ ] Implementación confirmada → subtarea del PROMPT cerrada en Monday
I3  [ ] Verificación técnica E2E
I4  [ ] Push confirmado (rama + commit) → subtarea push cerrada
    [ ] project_status = Listo · item movido a grupo Lanzamiento
    [ ] Commit en SyncBridge
```

---

## Endpoints por entidad

| Entidad | type (Add) | Add | Mod | Query |
|---|---|---|---|---|
| ItemInventory | `ItemInventoryAdd` | `/webhook/inventory/item/add` | `/webhook/inventory/item/mod` | `/webhook/inventory/item/query` |
| ItemNonInventory | `ItemNonInventoryAdd` | `/webhook/inventory/item/add` | `/webhook/inventory/item/mod` | `/webhook/inventory/item/query` |
| ItemService | `ItemServiceAdd` | `/webhook/inventory/item/add` | `/webhook/inventory/item/mod` | `/webhook/inventory/item/query` |
| Customer | `CustomerAdd` | `/webhook/contacts/customer/add` | `/webhook/contacts/customer/mod` | `/webhook/contacts/customer/query` |
| Vendor | `VendorAdd` | `/webhook/contacts/vendor/add` | `/webhook/contacts/vendor/mod` | `/webhook/contacts/vendor/query` |
| SalesOrder | `SalesOrderAdd` | `/webhook/sales/order/add` | `/webhook/sales/order/mod` | `/webhook/sales/order/query` |
| PurchaseOrder | `PurchaseOrderAdd` | `/webhook/purchasing/purchase-order/add` | `/webhook/purchasing/purchase-order/mod` | `/webhook/purchasing/purchase-order/query` |
| Invoice | `InvoiceAdd` | `/webhook/sales/invoice/add` | `/webhook/sales/invoice/mod` | `/webhook/sales/invoice/query` |
| Bill | `BillAdd` | `/webhook/purchasing/bill/add` | `/webhook/purchasing/bill/mod` | `/webhook/purchasing/bill/query` |
| CreditCardCharge | `CreditCardChargeAdd` | `/webhook/banking/credit-card-charge/add` | `/webhook/banking/credit-card-charge/mod` | `/webhook/banking/credit-card-charge/query` |
