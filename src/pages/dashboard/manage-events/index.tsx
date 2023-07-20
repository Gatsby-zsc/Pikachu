import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { EventsList } from "@/components/manage-events/events-list";
import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { MoveLeft } from "lucide-react";
const Dashboard = () => {
  return (
    <div className="container mx-auto flex flex-col">
      <div className="flex w-full flex-col items-center">
        <EventsList></EventsList>
      </div>
    </div>
  );
};
Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout withSidebar={true}>{page}</DashboardLayout>;
};
export default Dashboard;
