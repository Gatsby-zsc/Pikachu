import Link from "next/link";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

type OrderIdProps = {
  orderId: string;
};

export function OrderDetail({ orderId }: OrderIdProps) {
  const router = useRouter();
  const ctx = api.useContext();
  const { data: orderInfo } = api.orderRouter.getUniqueOrder.useQuery(orderId);
  const cancelOrderMutation =
    api.orderRouter.cancelOrderAndUpdateTicket.useMutation({
      onSuccess: () => {
        toast({
          title: "Order Cancelled",
        });
        // void ctx.orderRouter.invalidate();
        void router.replace("/dashboard/tickets");
      },
    });
  console.log(orderInfo);
  if (!orderInfo) {
    return null;
  }

  function cancelOrder(orderId: string) {
    if (!orderId) {
      return null;
    } else {
      cancelOrderMutation.mutate(orderId);
    }
  }

  return (
    <>
      <div className="mb-4 w-5/6">
        <h1 className="text-3xl font-semibold">
          Order for{" "}
          <Link
            href={`/all-events/${orderInfo.event.id}`}
            className="hover:underline"
          >
            {orderInfo.event.title}
          </Link>
        </h1>
        <div className="text-sm text-slate-400">Order No.{orderId}</div>
        <div className="text-xl">{orderInfo.event.venue}</div>
        <div className="text-lg">{orderInfo.event.description}</div>
      </div>
      <div className="flex w-5/6 flex-row">
        <div className="mr-10 flex w-1/3 flex-col">
          <Button onClick={() => cancelOrder(orderId)}>Cancel Order</Button>
        </div>
        <div className="flex w-2/3 flex-col">Ticket Info</div>
      </div>
    </>
  );
}
