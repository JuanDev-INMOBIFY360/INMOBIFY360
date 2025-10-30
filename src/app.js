import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import countryRoutes from "./modules/country/country.routes.js";
import citiesRoutes from "./modules/city/city.routes.js";
import departamentRoutes from "./modules/departament/departament.routes.js";
import neighborhoodRoutes from "./modules/neighborhoods/neighborhoods.routes.js";
import rolesRoutes from "./modules/roles/roles.routes.js";
import permissionRoutes from "./modules/permissions/permissions.routes.js";
import privilegesRoutes from "./modules/priviliges/privileges.routes.js";
import ownerRoutes from "./modules/owner/owner.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import propertyRoutes from "./modules/property/property.routes.js";
import authRoutes from "./modules/auth/auth.route.js";
import typeRoutes from "./modules/tyeproperty/type.route.js";
dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(helmet());
  }

  routes() {
    this.app.use("/countries", countryRoutes);
    this.app.use("/departaments", departamentRoutes);
    this.app.use("/cities", citiesRoutes);
    this.app.use("/neighborhoods", neighborhoodRoutes);
    this.app.use("/roles", rolesRoutes);
    this.app.use("/permissions", permissionRoutes);
    this.app.use("/privileges", privilegesRoutes);
    this.app.use("/owners", ownerRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/properties", propertyRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/types", typeRoutes);

  
    this.app.get("/", (req, res) => {
      res.json({ message: "Bienvenido a Inmobify360 API" });
    });
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();
