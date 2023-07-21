import { TicketCard } from "@/components/book-ticket-page/ticket-card";
import React, { useState } from "react";
import { api } from "@/utils/api";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { Receipt } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

type EventDetailProps = {
  eventId: string;
};

export function BookDetail({ eventId }: EventDetailProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [ticketCounts, setTicketCounts] = useState({});
  const [isTicketSelected, setIsTicketSelected] = useState(false);
  const submission = api.orderRouter.createOrderAndUpdateTicket.useMutation();

  const updateTicketCount = (ticketId: number, count: number) => {
    setTicketCounts({
      ...ticketCounts,
      [ticketId]: count,
    });
    if (count > 0) {
      setIsTicketSelected(true);
    } else {
      // Check if any other tickets are selected
      const otherTicketsSelected = Object.values(ticketCounts).some(
        (ticketCount) => (ticketCount as number) > 0
      );
      setIsTicketSelected(otherTicketsSelected);
    }
  };

  const { data, isLoading, isError, error } =
    api.eventRouter.getEventDetail.useQuery(eventId, {
      enabled: !!eventId,
    });

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
    cardNum: z.string().length(16, {
      message: "invalid card number length",
    }),
    expiryDate: z.string().length(5, {
      message: "invalid input",
    }),
    cardCVV: z.string().length(3, {
      message: "invalid CVV length",
    }),
  });

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (data === null) {
    return <div>No data available</div>;
  }

  const startDate = new Date(data.startTime);
  const endDate = new Date(data.endTime);

  const formattedStartDate = format(
    startDate,
    "eee, dd MMMM yyyy 'at' hh:mm a "
  );

  const formattedEndDate = format(
    endDate,
    "eee, dd MMMM yyyy 'at' hh:mm a 'AEST'"
  );

  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
      ticketInfo: ticketCounts,
    };

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(newData, null, 2)}</code>
        </pre>
      ),
    });

    submission.mutate(newData, {
      onSuccess: () => {
        void router.push("/all-events");
      },
    });
  }

  return (
    <div className="my-6 flex h-full w-full flex-wrap-reverse">
      <div className="relative w-full md:w-7/12">
        <div className="mx-auto mb-6 flex flex-row items-center">
          <Receipt className="mr-2 h-10 w-10" />
          <p className="text-3xl font-bold">Billing Information</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 space-y-8"
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
            <Button
              className="absolute bottom-0 right-5"
              type="submit"
              disabled={!isTicketSelected}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="h-3/4 w-full pl-4 md:w-5/12 md:border-l md:border-gray-300">
        <div className="max-w-7xl rounded-md bg-black bg-[url('/test.jpg')]">
          <Image
            src="/test.jpg"
            width={700}
            height={400}
            alt="Image"
            className="rounded-lg"
          />
        </div>
        <div className="my-2 flex justify-center text-2xl font-semibold">
          {data.title}
        </div>
        <div className="my-3 flex justify-center text-base text-slate-500">
          {dateRange}
        </div>
        <div className="h-96 overflow-y-auto">
          {data.tickets.map((ticket, index) => (
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
