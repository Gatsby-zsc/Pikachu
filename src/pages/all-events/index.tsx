import Layout from "@/components/landing-page/layout";
import { type ReactElement } from "react";
import React from "react";
import SidebarFilter from "@/components/all-events/sidebar-filter";
import EventsLists from "@/components/all-events/event-list";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();
  // console.log(router);
  return (
    <div className="container mx-auto flex">
      {/* search bar to implement searching events by location */}
      <SidebarFilter className="flex-none" />
      <EventsLists className="flex-1" />
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
