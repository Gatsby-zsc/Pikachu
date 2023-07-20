import Layout from "@/components/landing-page/layout";
import { type ReactElement } from "react";
import { EventDetail } from "@/components/event-datail-page/event-detail";
import React from "react";
import { useRouter } from "next/router";

const EventDetailPage = () => {
  const router = useRouter();
  let eventId = router.query.eventid;
  // console.log(eventId);
  if (Array.isArray(eventId)) {
    eventId = eventId[0];
  }
  if (!eventId) {
    return <div>WRONG EVENT!</div>;
  }
  return (
    <div className="container mx-auto flex flex-col">
      <div className="flex w-full flex-col items-center">
        <EventDetail eventId={eventId} />
      </div>
    </div>
  );
};

EventDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EventDetailPage;
