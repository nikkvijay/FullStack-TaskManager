export const formatDateForAPI = (date: string): string => {
  if (!date) return "";
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch (error) {
    console.error("Date formatting error:", error);
    return date;
  }
};
