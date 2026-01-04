import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import locationRoutes from './modules/Location/locations.routes.js';
import rolesRoutes from './modules/roles/roles.routes.js';
import permissionRoutes from './modules/permissions/permissions.routes.js';
import privilegesRoutes from './modules/privileges/privileges.routes.js';
import ownerRoutes from './modules/owner/owner.routes.js';
import userRoutes from './modules/user/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import typeRoutes from './modules/typeproperty/type.routes.js';
import propertyRoutes from './modules/property/property.routes.js';
import commonArea from './modules/commonArea/commonArea.Route.js';
import nearbyPlace from './modules/nearbyPlace/nearby.Route.js';

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // JSON parser - Aumentar límite para base64
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Logger
    this.app.use(morgan('dev'));

    // CORS configurado
    const corsOptions = {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    this.app.use(cors(corsOptions));

    // Security headers
    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      })
    );
  }

  routes() {
    // Health check
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Bienvenido a Inmobify360 API',
        status: 'OK',
        timestamp: new Date().toISOString(),
      });
    });

    // Rutas de la aplicación
    this.app.use('/api/locations', locationRoutes);
    this.app.use('/api/roles', rolesRoutes);
    this.app.use('/api/permissions', permissionRoutes);
    this.app.use('/api/privileges', privilegesRoutes);
    this.app.use('/api/owners', ownerRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/types', typeRoutes);
    this.app.use('/api/properties', propertyRoutes);
    this.app.use('/api/common-areas', commonArea);
    this.app.use('/api/nearby-places', nearbyPlace);

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path,
      });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    });
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();