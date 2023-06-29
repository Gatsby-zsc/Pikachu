import { parse, setHours, setMinutes } from "date-fns";

export function combineDateAndTimeString(date: Date, timeString: string): Date {
  const parsedTime = parse(timeString, "h:mm a", new Date());
  const combinedDate = setHours(
    setMinutes(date, parsedTime.getMinutes()),
    parsedTime.getHours()
  );

  return combinedDate;
}
