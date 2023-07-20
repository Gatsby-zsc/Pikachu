import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { EventsList } from "@/components/manage-events/events-list";

const ManageEvents = () => {
  return (
    <div className="container mx-auto flex flex-col">
      <div className="flex w-full flex-col items-center">
        <EventsList />
      </div>
    </div>
  );
};

ManageEvents.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout withSidebar={true}>{page}</DashboardLayout>;
};

export default ManageEvents;
