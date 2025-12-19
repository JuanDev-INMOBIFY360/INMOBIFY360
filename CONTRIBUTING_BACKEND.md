# Contribuir al backend — Inmobify360

Resumen de la estructura y reglas mínimas para mantener consistencia:

## Estructura por módulo

- `src/modules/<module>/`
  - `<module>.controller.js` — manejadores HTTP (validaciones y respuesta)
  - `<module>.service.js` — lógica de negocio
  - `<module>.repository.js` — acceso a DB (Prisma)
  - `<module>.routes.js` — definición de rutas y middleware

## Convenciones

- Nombres en minúsculas para carpetas; archivos con sufijos: `.controller.js`, `.service.js`, `.repository.js`, `.routes.js`
- Rutas REST en plural: `/api/<resources>` (ej.: `/api/departments`)
- Exportar `export default router` en archivos de rutas
- Validar entradas con `express-validator` y `validationResult`
- Manejo centralizado de errores en middleware cuando sea posible

## Calidad de código

- Se usa ESLint + Prettier (scripts: `npm run lint`, `npm run lint:fix`, `npm run format`)
- Tests en `src/tests` para CRUD críticos y endpoints principales

## Pasos recomendados antes de PR

1. Ejecutar `npm run lint:fix` y `npm run format`
2. Ejecutar la suite de tests `npm test` en entorno de pruebas
3. Asegurarse de que no haya `console.log` temporales y que las variables no utilizadas estén prefijadas con `_` si se ignoran

---

Si prefieres una guía más estricta (singular vs plural de carpetas, naming de funciones, etc.), me indicas la convención y adapto el repo para aplicarla automáticamente.
