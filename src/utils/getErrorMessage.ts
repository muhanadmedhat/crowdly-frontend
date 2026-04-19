export const getErrorMessage = (error: any): string => {
  const data = error.response?.data;
  return (
    data?.message ||
    data?.detail ||
    (Object.values(data || {})[0] as any)?.[0] ||
    'Something went wrong. Please try again.'
  );
};
