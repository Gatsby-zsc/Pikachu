import { TicketCard } from "@/components/book-ticket-page/ticket-card";
import React, { useContext, useEffect, useState } from "react";
import { api } from "@/utils/api";
import { format, set } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import EmailProvider from "next-auth/providers/email";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Receipt, Armchair } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRouter } from "next/router";
import {
  SeatGraph,
  maxPickedSeatsAtom,
} from "@/components/book-ticket-page/seat-pick";
import { atom, useAtom } from "jotai";
import type { SeatStatus } from "@/components/seat-picker";

type EventDetailProps = {
  eventId: string;
};

type Ticket = {
  id: number;
  ticketName: string;
  ticketDescription: string;
  price: number;
  capacity: number;
  remaining: number;
};

type SelectedTickets = {
  [ticketId: number]: number;
};

export const seatMapInfoAtom = atom<SeatStatus[][]>([]);
export const maxSeatNumAtom = atom<number>(0);

export function BookDetail({ eventId }: EventDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [ticketCounts, setTicketCounts] = useState<SelectedTickets>({});
  const [isTicketSelected, setIsTicketSelected] = useState(false);
  const { data, status } = api.orderRouter.getAllSeats.useQuery(eventId);
  const submission = api.orderRouter.createOrderAndUpdateTicket.useMutation();
  const ctx = api.useContext();

  const [seatMapInfo = []] = useAtom(seatMapInfoAtom);

  const [maxPickedSeats, setMaxPickedSeats] = useAtom(maxPickedSeatsAtom);

  useEffect(() => {
    let totalQuantity = 0;
    for (const ticketId in ticketCounts) {
      const ticketQuantity = ticketCounts[parseInt(ticketId)];
      if (typeof ticketQuantity === "undefined") {
        continue;
      }
      totalQuantity += ticketQuantity;
    }
    setMaxPickedSeats(totalQuantity);
  }, [ticketCounts, setMaxPickedSeats]);

  const updateTicketCount = (ticketId: number, count: number) => {
    const updatedTicketCounts = {
      ...ticketCounts,
      [ticketId]: count,
    };
    setTicketCounts(updatedTicketCounts);

    const otherTicketsSelected = Object.values(updatedTicketCounts).some(
      (ticketCount) => ticketCount > 0
    );

    setIsTicketSelected(otherTicketsSelected);
  };

  const {
    data: eventData,
    isLoading,
    isError,
    error,
  } = api.eventRouter.getEventDetail.useQuery(eventId, {
    enabled: !!eventId,
  });

  const sendBookedEmail =
    api.sendEventEmailRouter.sendBookedRequest.useMutation();

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: "name is at least 1 characters",
    }),
    phone: z.string(),
    emailAddress: z.string().email({
      message: "email address is invalid",
    }),
    billingAddress: z.string(),
    shippingAddress: z.string(),
    cardNum: z.string().min(1, {
      message: "invalid card number length",
    }),
    expiryDate: z.string().length(5, {
      message: "invalid input",
    }),
    cardCVV: z.string().length(3, {
      message: "invalid CVV length",
    }),
  });

  const calculateTotalPrice = (
    tickets: Ticket[],
    ticketCounts: SelectedTickets
  ): number => {
    let totalPrice = 0;

    for (const ticketId in ticketCounts) {
      const ticketQuantity = ticketCounts[parseInt(ticketId)];
      if (typeof ticketQuantity === "undefined") {
        continue;
      }
      const ticket = tickets.find((t) => t.id === parseInt(ticketId));

      if (ticket) {
        totalPrice += ticket.price * ticketQuantity;
      }
    }
    return totalPrice;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: session?.user.name || "",
      emailAddress: session?.user.email || "",
      phone: "",
      shippingAddress: "",
      billingAddress: "",
      cardNum: "",
      expiryDate: "",
      cardCVV: "",
    },
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (eventData === null) {
    return <div>No data available</div>;
  }

  const startDate = new Date(eventData.startTime);
  const endDate = new Date(eventData.endTime);

  const formattedStartDate = format(
    startDate,
    "eee, dd MMMM yyyy 'at' hh:mm a "
  );

  const formattedEndDate = format(
    endDate,
    "eee, dd MMMM yyyy 'at' hh:mm a 'AEST'"
  );

  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;
  const bill = calculateTotalPrice(eventData.tickets, ticketCounts);

  // analyse seatMapInfo
  type PickedSeatsInfo = {
    count: number;
    positions: Array<{ row: number; col: number }>;
  };

  function getPickedSeatsInfo(seatMapInfo: SeatStatus[][]): PickedSeatsInfo {
    let pickedSeatsCount = 0;
    const pickedSeatsPositions: Array<{ row: number; col: number }> = [];

    for (let row = 0; row < seatMapInfo.length; row++) {
      const seatRow = seatMapInfo[row];
      if (!seatRow) continue;
      for (let col = 0; col < seatRow.length; col++) {
        if (seatRow[col] === "picked") {
          pickedSeatsCount++;
          pickedSeatsPositions.push({ row, col });
        }
      }
    }

    return {
      count: pickedSeatsCount,
      positions: pickedSeatsPositions,
    };
  }
  const pickedSeatsInfo = getPickedSeatsInfo(seatMapInfo);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (pickedSeatsInfo.count !== maxPickedSeats) {
      toast({
        variant: "destructive",
        title: "You haven't picked enough seats",
      });
    } else {
      const newData = {
        name: data.name,
        phone: data.phone,
        emailAddress: data.emailAddress,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        cardNum: data.cardNum,
        expiryDate: data.expiryDate,
        cardCVV: data.cardCVV,
        eventId: eventId,
        bills: bill,
        ticketInfo: ticketCounts,
        seatsInfo: pickedSeatsInfo.positions,
      };

      submission.mutate(newData, {
        onSuccess: () => {
          sendBookedEmail.mutate(eventId);
          void ctx.orderRouter.getAllSeats.invalidate();
          void router.push(`/all-events/${eventId}`);
          toast({
            title: "You have successfully booked!",
          });
        },
      });
    }
  }

  return (
    <div className="my-6 flex h-full w-full flex-wrap-reverse">
      <div className="h-screen w-full overflow-y-scroll md:w-7/12">
        <div className="mx-auto mb-6 flex flex-row items-center">
          <Receipt className="mr-2 h-10 w-10" />
          <p className="text-3xl font-bold">Billing Information</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 pr-6"
          >
            <div className="flex flex-row gap-x-10">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0400000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="pikachu@pika.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please input your billing address."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please input your shipping address."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between gap-x-5">
              <div className="w-3/5">
                <FormField
                  control={form.control}
                  name="cardNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="xxxx-xxxx-xxxx-xxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row justify-end gap-x-2">
                <div className="w-4/12">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-4/12">
                  <FormField
                    control={form.control}
                    name="cardCVV"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mx-auto mb-6 flex flex-row items-center">
              <Armchair className="mr-2 h-10 w-10" />
              <p className="text-3xl font-bold">Pick your seats</p>
            </div>
            <SeatGraph props={data} />
            <div className="grid justify-items-end">
              <Button
                type="submit"
                className={!isTicketSelected ? "cursor-not-allow" : ""}
                disabled={!isTicketSelected}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="h-screen w-full pl-6 md:w-5/12 md:border-l md:border-gray-300">
        <div className="max-w-7xl rounded-md bg-black bg-[url('/test.jpg')]">
          <div className="mx-auto my-2 w-full">
            {/* Limit the length-width ratio */}
            <AspectRatio ratio={16 / 9}>
              <Image
                src={eventData.cover_image || "/test.jpg"}
                alt="event last images"
                className="rounded-xl object-cover pt-1"
                fill
                sizes="100%"
                priority={true}
              />
            </AspectRatio>
          </div>
        </div>
        <div className="my-2 flex justify-center text-2xl font-semibold">
          {eventData.title}
        </div>
        <div className="my-3 flex justify-center text-base text-slate-500">
          {dateRange}
        </div>
        <div className="h-96 overflow-y-auto">
          {eventData.tickets.map((ticket, index) => (
            <TicketCard
              key={index}
              ticketData={ticket}
              updateTicketCount={updateTicketCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
