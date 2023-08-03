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
    sortDirection: "asc",
  });

  return (
    <div className="group mb-2 flex w-full flex-col rounded-xl shadow-none">
      {eventData?.length ? (
        eventData.map((event, index) => (
          <div key={index}>
            <EventCard props={event} />
          </div>
        ))
      ) : (
        <div className="flex w-full items-center justify-center">
          <div className="text-2xl text-gray-400">No events found</div>
        </div>
      )}
    </div>
  );
};
