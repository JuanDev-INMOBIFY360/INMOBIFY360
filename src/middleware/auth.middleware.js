import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No se proporcionó un token válido en el encabezado Authorization",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Error en la autenticación del token",
      error: error.message,
    });
  }
};
