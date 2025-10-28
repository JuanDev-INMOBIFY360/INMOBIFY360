import {getProperties, getPropertyById, createProperty, updateProperty, deleteProperty} from './property.repository.js';

export const fetchAllProperties = async () => {
  return await getProperties();
};
export const fetchPropertyById = async (id) => {
  return await getPropertyById(id);
};
export const addProperty = async (data) => {
  return await createProperty(data);
};
export const modifyProperty = async (id, data) => {
  return await updateProperty(id, data);
};
export const removeProperty = async (id) => {
  return await deleteProperty(id);
};  
