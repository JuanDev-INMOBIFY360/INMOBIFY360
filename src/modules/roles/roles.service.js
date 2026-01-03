import {
  getAllRoles,
  getRoleById,
  createRoleWithPrivileges,
  updateRoleWithPrivileges,
  deleteRole,
} from './roles.repository.js';

export const fetchAllRoles = async () => {
  return await getAllRoles();
};
export const fetchRoleById = async (id) => {
  return await getRoleById(id);
};
export const addRole = async (data) => {
  return await createRoleWithPrivileges(data);
};
export const modifyRole = async (id, data) => {
  return await updateRoleWithPrivileges(id, data);
};
export const removeRole = async (id) => {
  return await deleteRole(id);
};
