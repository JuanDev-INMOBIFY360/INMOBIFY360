import request from "supertest";
import app from "../../src/app.js";

describe("🔹 Pruebas básicas de la API", () => {
  it("Debe responder correctamente en la ruta raíz /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Bienvenido a Inmobify360 API");
  });

  it("Debe devolver 404 para rutas no definidas", async () => {
    const res = await request(app).get("/*");
    expect(res.statusCode).toBe(404);
  });
});

