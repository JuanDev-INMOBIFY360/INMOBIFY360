import {getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment} from './departament.repository.js';

export const fetchDepartament = async () => {
  return await getDepartments();
};
export const  fetchDepartamentById = async (id) => {
  return await getDepartmentById(id);
}
export const addDepartament = async (data) => {
  return await createDepartment(data);
}
export const modifyDepartament = async (id, data) => {
  return await updateDepartment(id, data);
}
export const removeDepartament = async (id) => {
  return await deleteDepartment(id);
}