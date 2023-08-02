import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/style-utils";
import { toast } from "@/components/ui/use-toast";
import { eventTypes, eventTime, eventCategories } from "@/config/create-event";
import { combineDateAndTimeString } from "@/utils/date";
import { api } from "@/utils/api";
import { LocationField } from "@/components/create-event/location-field";
import { SectionLayout } from "@/components/create-event/section-layout";
import { AddTicketForm } from "@/components/create-event/add-ticket-form";
import { TicketList } from "@/components/create-event/ticket-list";
import { UploadImage } from "@/components/create-event/upload-image";
import { useRouter } from "next/router";

import { atom, useAtom } from "jotai";

export const FormSchema = z.object({
  eventTitle: z.string().min(2, {
    message: "event title is at least 2 characters",
  }),
  eventBrief: z.string().min(2, {
    message: "event brief is at least 2 characters",
  }),
  eventType: z.string(),
  eventCategory: z.string(),
  eventStartDate: z.date(),
  eventStartTime: z.string(),
  eventEndDate: z.date(),
  eventEndTime: z.string(),
  venue: z.string(),
  seatRows: z.coerce.number().min(1, {
    message: "Seat rows must be at least 1.",
  }),
  seatColumns: z.coerce.number().min(1, {
    message: "Seat columns must be at least 1.",
  }),
});

type Ticket = {
  idTemp: string;
  ticketName: string;
  ticketDescription: string;
  ticketPrice: number;
  ticketQuantity: number;
};

export const ticketsAtom = atom<Ticket[]>([]);
export const imagesAtom = atom<string[]>([]);

export const CreateEventForm = () => {
  const router = useRouter();

  const createEvent = api.eventRouter.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Event created.",
      });

      void router.push("/dashboard/manage-events");
    },
  });

  const [tickets] = useAtom(ticketsAtom);
  const [images] = useAtom(imagesAtom);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      eventTitle: "",
      eventBrief: "",
      eventType: "Appearance and Signing",
      eventCategory: "Business & Profession",
      eventStartDate: new Date(),
      eventStartTime: "12:00 AM",
      eventEndDate: new Date(),
      eventEndTime: "12:00 AM",
      venue: "",
      seatRows: 1,
      seatColumns: 1,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Check seat quantity is not more than sum of all tickets
    const totalTicketQuantity = tickets.reduce(
      (acc, ticket) => acc + ticket.ticketQuantity,
      0
    );

    if (data.seatRows * data.seatColumns < totalTicketQuantity) {
      toast({
        title: "Seat quantity is not enough.",
        description: `Seat quantity is not enough for ${totalTicketQuantity} tickets.`,
        variant: "destructive",
      });
      return;
    }

    // Check the event end time is not before the start time
    if (data.eventEndDate < data.eventStartDate) {
      toast({
        title: "Event end date invalid.",
        description: "Event end date is before the start date.",
        variant: "destructive",
      });
      return;
    }

    const eventStartComb = combineDateAndTimeString(
      data.eventStartDate,
      data.eventStartTime
    );
    const eventEndComb = combineDateAndTimeString(
      data.eventEndDate,
      data.eventEndTime
    );

    const newData = {
      title: data.eventTitle,
      description: data.eventBrief,
      type: data.eventType,
      category: data.eventCategory,
      cover_image: images[0] || "/test.jpg",
      images: images,
      venue: data.venue,
      startTime: eventStartComb,
      endTime: eventEndComb,
      eventStatus: 0,
      tickets: tickets.map((ticket) => ({
        ticketName: ticket.ticketName,
        ticketDescription: ticket.ticketDescription,
        price: ticket.ticketPrice,
        quantity: ticket.ticketQuantity,
      })),
      seatRows: data.seatRows,
      seatColumns: data.seatColumns,
    };

    createEvent.mutate(newData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4">
        {/* Basic Information */}
        <SectionLayout
          name="Basic Information"
          description="Name your event and tell event-goers why they should come. Add
                  details that highlight what makes it unique."
          icon="clipboardList"
        >
          <FormField
            control={form.control}
            name="eventTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="event title" {...field} />
                </FormControl>
                <FormDescription>
                  Be descriptive, but keep it short and sweet
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Event Brief */}
          <FormField
            control={form.control}
            name="eventBrief"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Brief</FormLabel>
                <FormControl>
                  <Input placeholder="event brief" {...field} />
                </FormControl>
                <FormDescription>
                  Tell us a little bit about your event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Event Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type, index) => (
                        <SelectItem key={index} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventCategories.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionLayout>
        <Separator className="my-12" />

        {/* Event Images */}
        <SectionLayout
          name="Upload Images"
          description="Add photos for your event's seats layout and best moments!"
          icon="image"
          is_optional={true}
        >
          <UploadImage />
        </SectionLayout>
        <Separator className="my-12" />

        {/* Event Start Date & Time */}
        <SectionLayout
          name="Date and Time"
          description="Tell event-goers when your event starts and ends so they can make plans to attend."
          icon="calendarClock"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventStartDate"
              render={({ field }) => (
                <FormItem className="mt-[5px] flex flex-col gap-1">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onDayClick={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTime.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Event End Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventEndDate"
              render={({ field }) => (
                <FormItem className="mt-[5px] flex flex-col gap-1">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onDayClick={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTime.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionLayout>
        <Separator className="my-12" />

        {/* Event Tickets */}
        <SectionLayout
          name="Tickets Type and Price"
          description="Tell event-goers the type and price of your event so they can make plans to attend."
          icon="tags"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="seatRows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rows</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The number of rows in the seat map.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seatColumns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Columns</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The number of columns in the seat map.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <TicketList />
          <AddTicketForm />
        </SectionLayout>
        <Separator className="my-12" />

        {/* Event Location */}
        <SectionLayout
          name="Location"
          description="Help people in the area discover your event and let attendees know where to show up."
          icon="mapPin"
        >
          <LocationField form={form} />
        </SectionLayout>
        <Separator className="my-12" />

        <div className="w-full">
          <Button type="submit" className="ml-auto block">
            Submit
          </Button>
        </div>
        <div className="my-12" />
      </form>
    </Form>
  );
};
