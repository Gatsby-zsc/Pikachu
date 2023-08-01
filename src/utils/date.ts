import { format, parse, setHours, setMinutes } from "date-fns";
import { enUS, enAU } from "date-fns/locale";

export function combineDateAndTimeString(date: Date, timeString: string): Date {
  const parsedTime = parse(timeString, "h:mm a", new Date());
  const combinedDate = setHours(
    setMinutes(date, parsedTime.getMinutes()),
    parsedTime.getHours()
  );

  return combinedDate;
}
export const parseDateToTimeString = (date: Date) => {
  if (!date) {
    return format(new Date(), "h:mm a");
  }
  return format(date, "h:mm a");
};
export function getDuration(startTime: Date, endTime: Date): string {
  // Calculate the duration in milliseconds
  const durationMs = endTime.getTime() - startTime.getTime();

  // Convert the duration to minutes, hours, and days
  let minutes = Math.floor(durationMs / (1000 * 60));
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Compute the remaining hours and minutes after subtracting the days
  hours = hours % 24;
  minutes = minutes % 60;

  // Generate the output string
  let output = "";
  if (days === 1) output += `${days} day `;
  if (hours === 1) output += `${hours} hour `;
  if (minutes === 1) output += `${minutes} minute `;
  if (days > 1) output += `${days} days `;
  if (hours > 1) output += `${hours} hours `;
  if (minutes > 1) output += `${minutes} minutes`;

  // Remove trailing comma and space
  output = output.trim().endsWith(",") ? output.slice(0, -1).trim() : output;

  return output;
}
