import { getUsers, getUserById, createUser, updateUser, deleteUser } from './user.repository.js';

export const fetchUsers = async () => {
  return await getUsers();
};
export const fetchUserById = async (id) => {
  return await getUserById(id);
};

export const addUser = async (data) => {
  return await createUser(data);
};

export const modifyUser = async (id, data) => {
  return await updateUser(id, data);
};
export const removeUser = async (id) => {
  return await deleteUser(id);
};
