import React from "react";
import EventCard from "@/components/all-events/event-card";
import { api } from "@/utils/api";
import { SlidersHorizontal } from "lucide-react";

type EventListsType = React.HTMLAttributes<HTMLDivElement>;

function EventsLists({ className }: EventListsType) {
  const { data: eventData } = api.eventRouter.filterEvents.useQuery({});
  return (
    <div className={className}>
      <div id="sort-by-button" className="mb-5">
        <span className="text-lg">
          <SlidersHorizontal className="inline-block pr-1" />
          Sort by
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
