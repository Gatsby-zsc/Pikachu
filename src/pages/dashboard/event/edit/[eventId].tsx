import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { EditEventForm } from "@/components/create-event/edit-event-form";
import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { MoveLeft } from "lucide-react";
import { Provider } from "jotai";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const EditEvent = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const {
    data: eventDetails,
    isError,
    isLoading,
  } = api.eventRouter.getEventDetail.useQuery(eventId as string, {
    enabled: !!eventId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!eventId || !eventDetails || isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>error...</div>;
  }

  const formattedEventId = eventId as string;

  return (
    <Provider>
      <div className="container mx-auto flex flex-col">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost" }), "mb-8 mr-auto")}
        >
          <>
            <MoveLeft className="mr-2 h-4 w-4" />
            dashboard
          </>
        </Link>
        <div className="flex w-full flex-col items-center">
          <EditEventForm eventData={eventDetails} eventId={formattedEventId} />
        </div>
      </div>
    </Provider>
  );
};

EditEvent.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout withSidebar={false}>{page}</DashboardLayout>;
};

export default EditEvent;
