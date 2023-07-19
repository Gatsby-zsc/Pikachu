import React, { useEffect, useState } from "react";
import EventCard from "@/components/all-events/event-card";
import { api } from "@/utils/api";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type EventListsType = React.HTMLAttributes<HTMLDivElement>;

function EventsLists({ className }: EventListsType) {
  const { data: eventData } = api.eventRouter.filterEvents.useQuery();
  const [sortField, setSortField] = useState("startTime");

  // type eventDataType = (typeof eventData)[0];

  // function compareVenue(a: eventDataType, b: eventDataType) {
  //   if (a.venue > b.venue) {
  //     return -1;
  //   }
  //   if (a.venue < b.venue) {
  //     return 1;
  //   }
  //   return 0;
  // }

  // function compareDate(a: eventDataType, b: eventDataType) {
  //   const firstSeconds = a.startTime.getTime();
  //   const secondSeconds = b.startTime.getTime();
  //   if (firstSeconds > secondSeconds) {
  //     return -1;
  //   }
  //   if (firstSeconds < secondSeconds) {
  //     return 1;
  //   }
  //   return 0;
  // }

  // useEffect(() => {
  //   if (eventData) {
  //     if (sortField === "venue") {
  //       eventData.sort(compareVenue);
  //     } else if (sortField === "startTime") {
  //       eventData.sort(compareDate);
  //     }
  //   }
  // }, [sortField, eventData]);

  return (
    <div className={className}>
      <div id="sort-by-button" className="mb-5 mt-5">
        <span className="text-lg">
          <Select
            onValueChange={setSortField}
            defaultValue={sortField}
            value={sortField}
          >
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal />
              <p className="text-lg font-semibold">Sort by</p>
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="Price">Price</SelectItem> */}
              <SelectItem value="startTime">Date</SelectItem>
              <SelectItem value="venue">Location</SelectItem>
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
