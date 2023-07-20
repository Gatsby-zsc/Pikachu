import React from "react";
import EventCard from "@/components/all-events/event-card";
import { api } from "@/utils/api";
import { SlidersHorizontal } from "lucide-react";
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

  return (
    <div className={className}>
      <div id="sort-by-button" className="mb-2 mt-5 pl-5">
        <span className="text-lg">
          <Select
            onValueChange={changeSortKey}
            defaultValue={value.sortKey}
            value={value.sortKey}
          >
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal />
              <p className="text-lg font-semibold">Sort by</p>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">none</SelectItem>
              <SelectItem value="1">Date</SelectItem>
              <SelectItem value="2">Location</SelectItem>
            </SelectContent>
          </Select>
        </span>
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
