import prisma from "../../config/db.js";
import { generateToken } from "../../utils/jwt.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role?.name,
  });
  return { user, token };
};

export const logoutUser = async (userId) => {
  // Marca el usuario como desconectado (opcional, según tu lógica de negocio)
  // Aquí podrías registrar el logout, limpiar tokens, etc.
  // Por ahora simplemente retornamos true indicando que el logout fue exitoso
  // El cliente debe eliminar el token del localStorage/sessionStorage
  
  // Opcional: Si quieres registrar el logout en BD, puedes guardar un timestamp
  // const user = await prisma.user.update({
  //   where: { id: userId },
  //   data: { lastLogoutAt: new Date() },
  // });
  
  return {
    success: true,
    message: "Sesión cerrada correctamente",
  };
};

export const getProfileService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) throw new Error("Usuario no encontrado");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name,
    status: user.status,
  };
};


export const updateProfileService = async (userId, data) => {
  const { name, password } = data;
  const dataToUpdate = {};

  if (name) dataToUpdate.name = name;

  if (password) {
    const saltRounds = parseInt(process.env.HASHED_PASSWORD_SALT_ROUNDS);
    const salt = await bcrypt.genSalt(saltRounds);
    dataToUpdate.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
  };
};
