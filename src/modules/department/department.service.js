import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from './department.repository.js';

export const fetchDepartment = async () => {
  return await getDepartments();
};
export const fetchDepartmentById = async (id) => {
  return await getDepartmentById(id);
};
export const addDepartment = async (data) => {
  return await createDepartment(data);
};
export const modifyDepartment = async (id, data) => {
  return await updateDepartment(id, data);
};
export const removeDepartment = async (id) => {
  return await deleteDepartment(id);
};
