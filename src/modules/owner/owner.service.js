import { getOwners,getOwnerById,createOwner,updateOwner,deleteOwner } from "./owner.repository.js";

export const fetchOwners = async () => {
  return await getOwners();
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