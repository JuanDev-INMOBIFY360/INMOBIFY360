import { getAllPrivileges,getPrivilegeById,createPrivilege,updatePrivilege,deletePrivilege } from "./privileges.repository.js";

export const fetchAllPrivileges = async () => {
  return await getAllPrivileges();
}
export const fetchPrivilegeById = async (id) => {
  return await getPrivilegeById(id);
}
export const addPrivilege = async (data) => {
  return await createPrivilege(data);
}
export const modifyPrivilege = async (id, data) => {
  return await updatePrivilege(id, data);
}
export const removePrivilege = async (id) => {
  return await deletePrivilege(id);
}