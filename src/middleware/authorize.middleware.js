import prisma from "../config/db.js";

/**
 * Middleware de autorización basado en Roles → Permissions → Privileges.
 * @param {string} moduleName - Nombre del módulo (por ejemplo "city", "user", "property").
 * @param {string} action - Acción a verificar (CREATE, READ, UPDATE, DELETE, CHANGE_STATE).
 */
export const authorize = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Cargar el rol, permisos y privilegios del usuario
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  privileges: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.role) {
        return res.status(403).json({ message: "No tienes un rol asignado" });
      }

     
      const permission = user.role.permissions.find(
        (perm) => perm.name.toLowerCase() === moduleName.toLowerCase()
      );

      if (!permission) {
        return res.status(403).json({ message: `No tienes permisos para el módulo '${moduleName}'` });
      }

      const hasPrivilege = permission.privileges.some(
        (priv) => priv.action.toUpperCase() === action.toUpperCase()
      );

      if (!hasPrivilege) {
        return res.status(403).json({
          message: `No tienes privilegios para realizar la acción '${action}' en el módulo '${moduleName}'`,
        });
      }

      next();
    } catch (error) {
      console.error("Error en authorize middleware:", error);
      return res.status(500).json({
        message: "Error interno en la autorización",
        error: error.message,
      });
    }
  };
};
