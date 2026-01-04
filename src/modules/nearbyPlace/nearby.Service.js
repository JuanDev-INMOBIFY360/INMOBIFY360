import { getAllNearbyPlaces,getNearbyPlaceById,createNearbyPlace,updateNearbyPlace,deleteNearbyPlace } from "./nearby.Repository.js";

export const fetchAllNearbyPlaces = async () => {
  return await getAllNearbyPlaces();
};
export const fetchNearbyPlaceById = async (id) => {
  return await getNearbyPlaceById(id);
};

export const createNewNearbyPlace = async (data) => {
  return await createNearbyPlace(data);
};  
export const updateExistingNearbyPlace = async (id, data) => {
  return await updateNearbyPlace(id, data);
};
export const deleteNearbyPlaceById = async (id) => {
  return await deleteNearbyPlace(id);
};