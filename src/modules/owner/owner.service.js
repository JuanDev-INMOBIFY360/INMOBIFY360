import {
  getOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
} from './owner.repository.js';
import { getPagination } from '../../utils/pagination.js';

export const fetchOwners = async (query) => {
  const { skip, take, page, limit } = getPagination(query);

  const [owners, total] = await Promise.all([
    getOwners({ skip, take }),
    getOwners({ count: true }),
  ]);

  return {
    data: owners,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
};
export const fetchOwnerById = async (id) => {
  return await getOwnerById(id);
};

export const addOwner = async (data) => {
  return await createOwner(data);
};

export const modifyOwner = async (id, data) => {
  return await updateOwner(id, data);
};
export const removeOwner = async (id) => {
  return await deleteOwner(id);
};
