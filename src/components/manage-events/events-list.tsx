import { api } from "@/utils/api";
import { EventCard } from "@/components/manage-events/event-card";

export const EventsList = () => {
  const { data: eventData } = api.eventRouter.protectedFilterEvents.useQuery({
    Date: "none",
    Category: "none",
    Type: "none",
    isOnline: false,
    onlyEventsFollowed: false,
    sortKey: "0",
    userKey: "none",
  });

  return (
    <div className="group mb-2 flex w-full flex-col rounded-xl p-5 shadow-none">
      {eventData &&
        eventData.map((event, index) => (
          <div key={index}>
            <EventCard props={event} />
          </div>
        ))}
    </div>
  );
};
