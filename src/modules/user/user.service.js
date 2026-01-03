import { getUsers, getUserById, createUser, updateUser, deleteUser } from './user.repository.js';
import bcrypt from 'bcryptjs';
import { getPagination } from '../../utils/pagination.js';


export const fetchUsers = async (query) => {
  const { skip, take, page, limit } = getPagination(query);

  const [users, total] = await Promise.all([
    getUsers({ skip, take }),
    getUsers({ count: true }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  };
}
export const fetchUserById = async (id) => {
  return await getUserById(id);
};

export const addUser = async (data) => {
  const saltRounds = Number(process.env.HASHED_PASSWORD_SALT_ROUNDS) ;

  const userData = { ...data };

  if (data.password) {
    userData.password = await bcrypt.hash(data.password, saltRounds);
  }

  return await createUser(userData);
};

export const modifyUser = async (id, data) => {
  const saltRounds = Number(process.env.HASHED_PASSWORD_SALT_ROUNDS) || 10;
  const userData = { ...data };

  if (data.password) {
    userData.password = await bcrypt.hash(data.password, saltRounds);
  }

  return await updateUser(id, userData);
};

export const removeUser = async (id) => {
  return await deleteUser(id);
};
