import prisma from '../config/db.js';

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
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // ✅ Cargar solo RolePermission para el módulo actual y traer los privilegios asociados
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                where: {
                  permission: { name: moduleName },
                },
                include: {
                  permission: true,
                  privileges: {
                    include: {
                      privilege: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.role) {
        return res.status(403).json({ message: 'No tienes un rol asignado' });
      }

      const rolePermission = user.role.rolePermissions[0]; // rolePermission filtrado por módulo

      if (!rolePermission) {
        return res.status(403).json({
          message: `No tienes permisos para el módulo '${moduleName}'`,
        });
      }

      // Mapear a la forma esperada: array de Privileges (con action)
      const privileges = (rolePermission.privileges || []).map((rp) => rp.privilege);

      const hasPrivilege = privileges.some(
        (priv) => priv.action.toUpperCase() === action.toUpperCase()
      );

      if (!hasPrivilege) {
        return res.status(403).json({
          message: `No tienes privilegios para realizar la acción '${action}' en el módulo '${moduleName}'`,
        });
      }

      next();
    } catch (error) {
      console.error('Error en authorize middleware:', error);
      return res.status(500).json({
        message: 'Error interno en la autorización',
        error: error.message,
      });
    }
  };
};
