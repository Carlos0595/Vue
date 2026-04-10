export const formatDate = (dateString, locale = 'es-ES') => {
  if (!dateString) return 'N/A';

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleDateString(locale);
};

export const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'INACTIVE':
      return 'inactive';
    case 'FROZEN':
      return 'frozen';
    case 'RESOLVED':
      return 'resolved';
    default:
      return 'unknown';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'Activo';
    case 'INACTIVE':
      return 'Inactivo';
    case 'FROZEN':
      return 'Congelado';
    case 'RESOLVED':
      return 'Resuelto';
    default:
      return status || 'Sin estado';
  }
};
