import {
  getNeighborhoods,
  getNeighborhoodById,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
} from './neighborhoods.repository.js';

export const fetchNeighborhoods = async () => {
  return await getNeighborhoods();
};
export const fetchNeighborhoodById = async (id) => {
  return await getNeighborhoodById(id);
};
export const addNeighborhood = async (data) => {
  return await createNeighborhood(data);
};
export const modifyNeighborhood = async (id, data) => {
  return await updateNeighborhood(id, data);
};
export const removeNeighborhood = async (id) => {
  return await deleteNeighborhood(id);
};
