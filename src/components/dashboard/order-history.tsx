import { api } from "@/utils/api";
import { OrderCard } from "@/components/dashboard/order-card";
import { useSession } from "next-auth/react";

export const OrderHistory = () => {
  const { data: session, status } = useSession();
  if (status === "loading" || !session) {
    return null;
  }

  const orders = api.orderRouter.getOrders.useQuery(session.user.id);
  console.log(orders);
  console.log(session);

  return (
    <div className="group mb-2 flex w-full flex-col rounded-xl p-5 shadow-none">
      {/* {orders.map((order, index) => (
        <div key={index}>
          <OrderCard orderInfo={order} />
        </div>
      ))} */}
    </div>
  );
};
