import { getAllRoles,getRoleById,createRole,updateRole,deleteRole } from "./roles.repository.js";

export const fetchAllRoles = async () => {
  return await getAllRoles();
}
export const fetchRoleById = async (id) => {
  return await getRoleById(id);
}
export const addRole = async (data) => {
  return await createRole(data);
}
export const modifyRole = async (id, data) => {
  return await updateRole(id, data);
}
export const removeRole = async (id) => {
  return await deleteRole(id);
}