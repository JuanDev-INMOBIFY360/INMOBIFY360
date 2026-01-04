import { getAllcommonAreas,getcommonAreaById,createcommonArea,updatecommonArea,deletecommonArea } from "./commonArea.Repository.js";

export const fetchAllcommonAreas = async () => {
  return await getAllcommonAreas();
};

export const fetchcommonAreaById = async (id) => {
  return await getcommonAreaById(id);
};

export const createNewcommonArea = async (data) => {
  return await createcommonArea(data);
};
export const updateExistingcommonArea = async (id, data) => {
  return await updatecommonArea(id, data);
};
export const deletecommonAreaById = async (id) => {
  return await deletecommonArea(id);
};