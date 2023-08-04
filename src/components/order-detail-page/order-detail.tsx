import Link from "next/link";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { Ticket } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type OrderIdProps = {
  orderId: string;
};

export function OrderDetail({ orderId }: OrderIdProps) {
  const router = useRouter();
  const ctx = api.useContext();
  const [duration, setDuration] = useState(false);
  const { data: orderInfo } = api.orderRouter.getUniqueOrder.useQuery(orderId);
  const sendCancellationEmail =
    api.sendEventEmailRouter.sendCancelRequest.useMutation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nowDate = new Date();
  console.log(orderInfo);

  const durationInDays = orderInfo
    ? differenceInDays(new Date(orderInfo.event.startTime), nowDate)
    : undefined;

  useEffect(() => {
    if (
      orderInfo &&
      durationInDays &&
      durationInDays > 7 &&
      nowDate < new Date(orderInfo.event.startTime)
    ) {
      setDuration(true);
    }
  }, [durationInDays, nowDate, orderInfo]);

  const cancelOrderMutation =
    api.orderRouter.cancelOrderAndUpdateTicket.useMutation({
      onSuccess: () => {
        orderInfo && sendCancellationEmail.mutate(orderInfo.event.id);
        toast({
          title: "Order Cancelled",
        });
        void router.replace("/dashboard/tickets");
      },
    });
  if (!orderInfo) {
    return <div>Loading...</div>;
  }

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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mx-auto mb-2 w-4/5" disabled={!duration}>
                Cancel Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your order and return your fund.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancelOrder(orderId)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {!duration ? (
            <div className="text-center font-semibold text-slate-500">
              <div>Event will be hosted in {durationInDays} days</div>
              <div>You can not cancel now.</div>
            </div>
          ) : (
            <div className="text-center font-semibold text-slate-500">
              <div>Event will be hosted in {durationInDays} days</div>
              <div>You can cancel now and get your fund back.</div>
            </div>
          )}
        </div>
        <div className="flex w-2/3 flex-col">
          <div className="mb-3 flex flex-row items-center text-2xl font-semibold">
            <Ticket className="mr-2 h-7 w-7" />
            <div>Ticket Info</div>
          </div>
          <div>
            {orderInfo.orderTickets.map((orderTicket, index) => {
              return (
                <div key={index}>
                  <div className="text-2xl font-semibold">
                    {orderTicket.ticketNumber} x {orderTicket.ticket.ticketName}
                  </div>
                </div>
              );
            })}
            {orderInfo.seats.map((seat, index2) => {
              return (
                <div key={index2} className="my-1 text-lg font-semibold">
                  Your {index2 + 1} seat is at R{seat.row}:C{seat.col}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
