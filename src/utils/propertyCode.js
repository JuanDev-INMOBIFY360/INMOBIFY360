export const generatePropertyCode = async (prisma) => {
  const lastProperty = await prisma.property.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });

  const nextId = lastProperty ? lastProperty.id + 1 : 1;

  return `PROP-${String(nextId).padStart(6, '0')}`;
};