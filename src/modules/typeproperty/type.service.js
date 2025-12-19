import {
  getTypeProperties,
  getTypePropertyById,
  createTypeProperty,
  updateTypeProperty,
  deleteTypeProperty,
} from './type.repository.js';

export const fetchTypeProperties = async () => {
  return await getTypeProperties();
};

export const fetchTypePropertyById = async (id) => {
  return await getTypePropertyById(id);
};
export const addTypeProperty = async (data) => {
  return await createTypeProperty(data);
};
export const modifyTypeProperty = async (id, data) => {
  return await updateTypeProperty(id, data);
};
export const removeTypeProperty = async (id) => {
  return await deleteTypeProperty(id);
};
