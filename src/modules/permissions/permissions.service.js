import { getAllPermissions,getPermissionById,createPermission,updatePermission,deletePermission } from "./permissions.repository.js";

export const fetchAllPermissions = async () => {
  return await getAllPermissions();
}
export const fetchPermissionById = async (id) => {
  return await getPermissionById(id);
}
export const addPermission = async (data) => {
  return await createPermission(data);
}
export const modifyPermission = async (id, data) => {
  return await updatePermission(id, data);
}
export const removePermission = async (id) => {
  return await deletePermission(id);
}
