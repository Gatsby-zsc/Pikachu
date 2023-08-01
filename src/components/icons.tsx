import { type LucideProps, type Icon as LucideIcon } from "lucide-react";
import {
  Ticket,
  ArrowRight,
  CalendarCheck,
  Settings,
  ClipboardList,
  CalendarClock,
  MapPin,
  Tags,
  Image,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 384 512"
      {...props}
    >
      <path d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z" />
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 488 512"
      {...props}
    >
      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
    </svg>
  ),
  ticket: Ticket,
  arrowRight: ArrowRight,
  clipboardList: ClipboardList,
  calendarClock: CalendarClock,
  mapPin: MapPin,
  tags: Tags,
  calendarCheck: CalendarCheck,
  settings: Settings,
  image: Image,
};
