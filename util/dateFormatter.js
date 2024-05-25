import { format } from "date-fns";

export function fromatInputDate(originalDateString) {
  try {
    const formattedDate = format(originalDateString, "dd/MM/yyyy");
    return formattedDate;
  } catch (error) {
    console.log(error);
  }
}

export function formatDateReport(date) {
  return format(new Date(date), "MMMM d, yyyy, h:mm a");
}
