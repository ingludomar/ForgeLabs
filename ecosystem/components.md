# Componentes del ecosistema

## LedgerOps

**Rol:** Capa de aplicación. Lo que el equipo de automatización usa directamente.

**Hace:**
- Exponer webhooks por módulo, entidad y operación
- Validar type, sede y data en cada request
- Aplicar reglas de negocio de la organización
- Estructurar y delegar el payload a LedgerExec
- Gestionar Monday.com para TODO el ecosistema
- Emitir PROMPTs a proyectos dependientes
- Documentar entregas formales por rol

**No hace:** construir XML, conectar a QB Desktop, validar QBXML, routing de sedes.

**Stack:** N8N workflows versionados en Git.
**URL scheme:** `POST /webhook/{module}/{entity}/{op}`

---

## LedgerExec

**Rol:** Orquestador genérico. Motor de ejecución sin lógica de negocio.

**Hace:**
- Recibir el payload estructurado de LedgerOps
- Invocar LedgerBridge vía SSH con el JSON
- Devolver la respuesta de vuelta a LedgerOps

**No hace:** validar tipos, aplicar reglas de negocio, construir QBXML.

**Stack:** N8N workflows.

---

## LedgerBridge

**Rol:** Fuente de verdad del ecosistema. Toda la lógica QB vive aquí.

**Hace:**
- Validar schemas QBXML por tipo y versión
- Aplicar business rules (`requiredBySede`, transformaciones por sede)
- Construir el QBXML completo listo para QB Desktop
- Parsear la respuesta XML de QB y convertirla a JSON
- Exponer herramientas: `describe`, `jsonin`, `business-rules`, `generate-contract`, `analyze-sede-fields`
- Soportar múltiples versiones QBXML (v13.0 para RMX, v17.0 para el resto)

**No hace:** exponer webhooks al sistema origen, lógica de negocio de la organización.

**Stack:** Bash + Python. Corre en Linux `/opt/LedgerBridge`.

---

## qbxmlIntegrator

**Rol:** Interfaz COM con QB Desktop. El único componente que toca QB directamente.

**Hace:**
- Recibir el QBXML completo de LedgerBridge
- Ejecutarlo en QB Desktop vía win32com
- Devolver la respuesta XML parseada

**No hace:** construir QBXML, validar schemas, lógica de negocio.

**Stack:** FastAPI. Corre en Windows (misma máquina que QB Desktop). Puerto `{sede-ip}:8600`.
