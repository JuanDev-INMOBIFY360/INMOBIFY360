/**
 * Obtener parámetros de paginación desde el query
 * @param {Object} query - Query params del request
 * @returns {Object} Parámetros de paginación
 */
export const getPagination = (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
};