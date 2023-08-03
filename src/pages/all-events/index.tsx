import Layout from "@/components/landing-page/layout";
import { type ReactElement } from "react";
import React from "react";
import SidebarFilter from "@/components/all-events/sidebar-filter";
import EventsLists from "@/components/all-events/event-list";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data, status } = useSession();

  const [filterList, setFilterList] = useState({
    Date: "none",
    Category: "none",
    Type: "none",
    isOnline: false,
    onlyEventsFollowed: false,
    sortKey: "0",
    userKey: "none",
    sortDirection: "asc",
  });

  useEffect(() => {
    if (status === "authenticated") {
      setFilterList((prevFilterList) => ({
        ...prevFilterList,
        userKey: data.user.id,
      }));
    }
  }, [data, status]);

  return (
    <div className="container mx-auto flex">
      {/* search bar to implement searching events by location */}
      <SidebarFilter
        className="flex-none"
        value={filterList}
        func={setFilterList}
      />
      <EventsLists className="flex-1" value={filterList} func={setFilterList} />
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
