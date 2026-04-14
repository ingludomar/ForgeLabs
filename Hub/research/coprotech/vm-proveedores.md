# CoproTech — Investigación Proveedores VM

> Fuente: conocimiento base agosto 2025

---

## Comparativa de proveedores

| Proveedor | Plan básico (2C/4GB/80GB) | Plan intermedio (4C/8GB/160GB) | DC Latam | Uptime | Panel | Escalabilidad |
|---|---|---|---|---|---|---|
| **Hetzner** | ~$6–8 USD/mes | ~$14–16 USD/mes | No · EU + USA (Virginia) | Excelente 99.9%+ | Bueno · backups y snapshots incluidos | Vertical sencillo · horizontal via API |
| **Contabo** | ~$7–9 USD/mes | ~$13–15 USD/mes | No · EU + USA + Asia | Buena | Básico · backups con costo extra | Limitada · resize manual |
| **DigitalOcean** | ~$24 USD/mes | ~$48 USD/mes | No · NYC/SFO/AMS | Excelente 99.99% SLA | Muy bueno · backups auto | Excelente · LB + K8s |
| **Linode (Akamai)** | ~$24 USD/mes | ~$48 USD/mes | Miami + Atlanta | Excelente 99.9% SLA | Muy bueno · backups auto | Muy buena |
| **Vultr** | ~$24 USD/mes | ~$48 USD/mes | **São Paulo (BR)** | Buena 99.9% SLA | Bueno · backups y snapshots | Buena · bare metal disponible |
| **Scaleway** | ~$10–13 USD/mes | ~$20–25 USD/mes | No · París/Amsterdam | Buena | Moderno · snapshots incluidos | Buena |

---

## Recomendación

### Primera opción: Vultr
- Único proveedor con datacenter en Latinoamérica (São Paulo)
- Menor latencia para clientes en Colombia, Ecuador, Perú, México
- Precio competitivo en el rango medio
- Panel sólido con backups y snapshots

### Segunda opción: Hetzner
- Mejor precio/rendimiento del mercado
- Hardware de calidad, muy estable
- Datacenter en Virginia (USA) — aceptable para Caribe y parte de Sudamérica
- Ideal si el costo es el factor decisivo

### Descartar por precio: DigitalOcean, Linode, Vultr plan intermedio
- 3x el precio de Hetzner sin ventaja real para este caso de uso

---

## Modelo recomendado para CoproTech

**Una VM por cliente** — aislamiento completo, facturación directa, sin riesgo entre clientes.

| Tamaño cliente | VM recomendada | Proveedor | Costo aprox. |
|---|---|---|---|
| Pequeño (hasta 100 unidades) | 2 vCPU / 4GB / 80GB SSD | Vultr / Hetzner | $8–24 USD/mes |
| Mediano (100-200 unidades) | 4 vCPU / 8GB / 160GB SSD | Vultr / Hetzner | $16–48 USD/mes |
| Grande (+200 unidades) | 4-8 vCPU / 16GB / 240GB SSD | Vultr / Hetzner | $30–80 USD/mes |

---

## Margen de servicio

El costo de VM se incluye en el precio mensual al cliente con margen.
Ejemplo con Hetzner plan básico ($8 USD):

| Plan CoproTech | Costo VM | Precio al cliente | Margen bruto |
|---|---|---|---|
| Básico | ~$8 USD | $XX USD (por definir) | $XX – $8 USD |

> Los precios al cliente se definen una vez se tenga el costo total: VM + soporte + desarrollo amortizado.
