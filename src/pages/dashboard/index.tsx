import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";

const Dashboard = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-center text-lg text-muted-foreground">
        Welcome to your dashboard!
      </p>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
