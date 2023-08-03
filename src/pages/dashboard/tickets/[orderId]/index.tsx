import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { OrderDetail } from "@/components/order-detail-page/order-detail";
import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/router";

const OrderDetailPage = () => {
  const router = useRouter();
  let orderId = router.query.orderId;
  if (Array.isArray(orderId)) {
    orderId = orderId[0];
  }
  if (!orderId) {
    return <div>WRONG ORDER!</div>;
  }
  console.log(orderId);
  return (
    <div className="container mx-auto flex flex-col">
      <Link
        href="/dashboard/tickets"
        className={cn(buttonVariants({ variant: "ghost" }), "mb-8 mr-auto")}
      >
        <>
          <MoveLeft className="mr-2 h-4 w-4" />
          dashboard
        </>
      </Link>
      <div className="flex w-full flex-col items-center">
        <OrderDetail orderId={orderId} />
      </div>
    </div>
  );
};

OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout withSidebar={false}>{page}</DashboardLayout>;
};

export default OrderDetailPage;
