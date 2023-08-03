import { api } from "@/utils/api";
import { OrderCard } from "@/components/dashboard/order-card";
import { useSession } from "next-auth/react";

export const OrderHistory = () => {
  const { data: session, status } = useSession();
  if (status === "loading" || !session) {
    return null;
  }
  const { data: orders } = api.orderRouter.getAllorders.useQuery();
  console.log(orders);
  if (!orders) {
    return null;
  }

  return (
    <div className="group mb-2 flex w-full flex-col rounded-xl shadow-none">
      {orders.map((order, index) => (
        <div key={index}>
          <OrderCard orderData={order} />
        </div>
      ))}
    </div>
  );
};
