import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import React from "react";
import { OrderHistory } from "@/components/dashboard/order-history";
import { OrderCard } from "@/components/dashboard/order-card";

const Tickets = () => {
  return (
    <div className="container mx-auto p-6">
      <OrderHistory />
      {/* <OrderCard /> */}
    </div>
  );
};

Tickets.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Tickets;
