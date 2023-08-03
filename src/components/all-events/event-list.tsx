import React from "react";
import EventCard from "@/components/all-events/event-card";
import { api } from "@/utils/api";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

type FilterListType = {
  Date: string;
  Category: string;
  Type: string;
  isOnline: boolean;
  onlyEventsFollowed: boolean;
  sortKey: string;
  userKey: string;
  sortDirection: string;
};

interface EventListsProps {
  className: string;
  value: FilterListType;
  func: React.Dispatch<React.SetStateAction<FilterListType>>;
}

function EventsLists({ className, value, func }: EventListsProps) {
  const { status } = useSession();

  const { data: eventData } =
    status === "authenticated"
      ? api.eventRouter.protectedFilterEvents.useQuery(value)
      : api.eventRouter.publicFilterEvents.useQuery(value);

  function changeSortKey(key: string) {
    func((data) => ({ ...data, sortKey: key }));
  }

  function changeDirection(key: string) {
    func((data) => ({ ...data, sortDirection: key }));
  }

  return (
    <div className={className}>
      <div className="mb-2 mt-5 flex space-x-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-semibold">Sort by:</div>
          <Select
            onValueChange={changeSortKey}
            defaultValue={value.sortKey}
            value={value.sortKey}
          >
            <SelectTrigger className="h-8 w-36">
              <SlidersHorizontal className="h-5 w-5" />
              <p className="font-semibold">
                {value.sortKey === "0"
                  ? "None"
                  : value.sortKey === "1"
                  ? "Date"
                  : "Location"}
              </p>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">none</SelectItem>
              <SelectItem value="1">Date</SelectItem>
              <SelectItem value="2">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            onValueChange={changeDirection}
            defaultValue={value.sortDirection}
            value={value.sortDirection}
          >
            <SelectTrigger className="h-8 w-40">
              <ArrowUpDown className="h-5 w-5" />
              <p className="font-semibold">
                {value.sortDirection === "asc" ? "Ascending" : "Descending"}
              </p>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="des">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {eventData &&
        eventData.map((event, index) => (
          <div key={index}>
            <EventCard props={event} />
          </div>
        ))}
    </div>
  );
}

export default EventsLists;
