import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { CreateEventForm } from "@/components/create-event/create-event-form";
import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { MoveLeft } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container mx-auto flex flex-col">
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "ghost" }), "mb-5 mr-auto")}
      >
        <>
          <MoveLeft className="mr-2 h-4 w-4" />
          dashboard
        </>
      </Link>
      <div className="flex w-full flex-col items-center">
        <CreateEventForm />
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout withSidebar={false}>{page}</DashboardLayout>;
};

export default Dashboard;
