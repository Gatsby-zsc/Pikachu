import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { EventCard } from "./event-card";

export const EventsList = () => {
  const { data: eventData } = api.eventRouter.filterEvents.useQuery();
  return (
    <div className="group mb-2 flex flex-col rounded-xl  p-5 shadow-none   ">
      {eventData &&
        eventData.map((event, index) => (
          <div key={index}>
            <EventCard props={event} />
          </div>
        ))}
    </div>
  );
};
