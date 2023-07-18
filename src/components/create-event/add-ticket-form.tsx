import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ticketsAtom } from "@/components/create-event/create-event-form";
import { stopPropagate } from "@/utils/stop-propagate";

import { useAtom } from "jotai";
import { useState } from "react";
import { nanoid } from "nanoid";

const FormSchema = z.object({
  ticketName: z.string().min(2, {
    message: "Ticket name must be at least 2 characters.",
  }),
  ticketDescription: z.string().min(2, {
    message: "Ticket description must be at least 2 characters.",
  }),
  ticketPrice: z.coerce.number().min(0, {
    message: "Ticket price must be at least 0.",
  }),
  ticketQuantity: z.coerce.number().min(0, {
    message: "Ticket quantity must be at least 0.",
  }),
});

export const AddTicketForm = () => {
  const [tickets, setTickets] = useAtom(ticketsAtom);

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticketName: "",
      ticketDescription: "",
      ticketPrice: 0,
      ticketQuantity: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // generate a unique id for the ticket
    const newData = { ...data, idTemp: nanoid() };

    // add the ticket to the list of tickets
    setTickets((prev) => [...prev, newData]);

    // close the sheet
    setOpen(false);

    form.reset();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Ticket
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Ticket</SheetTitle>
          <SheetDescription>
            Tell event-goers the type and price of your event so they can make
            plans to attend.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(onSubmit))}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="ticketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. General Admission" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Seat in the back row: F 30-40"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add Ticket</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
