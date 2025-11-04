// jest.config.js
export default {
  testEnvironment: "node",
  transform: {}, // evita errores con ESModules
  setupFiles: ["dotenv/config"], // carga las variables del entorno
  testMatch: ["**/tests/**/*.test.js"], // busca tus tests
  verbose: true,
};
