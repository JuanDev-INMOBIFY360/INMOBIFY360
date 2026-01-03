import {
  getTypeProperties,
  getTypePropertyById,
  createTypeProperty,
  updateTypeProperty,
  deleteTypeProperty,
} from './type.repository.js';
import { getPagination } from '../../utils/pagination.js';

export const fetchTypeProperties = async (query) => {
  const { skip, take, page, limit } = getPagination(query);

  const [typeProperties, total] = await Promise.all([
    getTypeProperties({ skip, take }),
    getTypeProperties({ count: true }),
  ]);

  return {
    data: typeProperties,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
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
