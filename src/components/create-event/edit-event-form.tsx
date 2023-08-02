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
import { UploadImage } from "@/components/create-event/upload-image";
import { useRouter } from "next/router";
import { imagesAtom } from "@/components/create-event/create-event-form";

import { useAtom } from "jotai";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { useEffect } from "react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type EventDetail = RouterOutput["eventRouter"]["getEventDetail"];

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

// type Ticket = {
//   idTemp: string;
//   ticketName: string;
//   ticketDescription: string;
//   ticketPrice: number;
//   ticketQuantity: number;
// };

// export const ticketsAtom = atom<Ticket[]>([]);
// export const imagesAtom = atom<string[]>([]);

interface EditEventFormProps {
  eventData: EventDetail;
  eventId: string;
}

export const EditEventForm = ({ eventData, eventId }: EditEventFormProps) => {
  const router = useRouter();
  const sendEditEmail = api.sendEventEmailRouter.sendEditRequest.useMutation();

  const editEvent = api.eventRouter.editEvent.useMutation({
    onSuccess: () => {
      toast({
        description: "Event edited successfully.",
      });
      eventData?.orders.forEach((ele) => {
        sendEditEmail.mutate({
          email: ele.email,
          ...eventData,
        });
      });
      void router.push(`/all-events/${eventId}`);
    },
  });

  const [images, setImages] = useAtom(imagesAtom);

  useEffect(() => {
    if (eventData?.images) {
      setImages(eventData.images);
    }
  }, [eventData?.images, setImages]);

  useEffect(() => {
    console.log(eventData);
  }, [eventData]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      eventTitle: eventData?.title,
      eventBrief: eventData?.description,
      eventType: eventData?.type,
      eventCategory: eventData?.category,
      eventStartDate: new Date(eventData?.startTime || ""),
      eventStartTime: format(
        new Date(eventData?.startTime || "12:00 AM"),
        "h:mm a"
      ),
      eventEndDate: new Date(eventData?.startTime || ""),
      eventEndTime: format(
        new Date(eventData?.endTime || "12:00 AM"),
        "h:mm a"
      ),
      venue: eventData?.venue,
      seatRows: eventData?.seatRow || 1,
      seatColumns: eventData?.seatColumn || 1,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
      id: eventId,
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
    };

    editEvent.mutate(newData);
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
            Update
          </Button>
        </div>
        <div className="my-12" />
      </form>
    </Form>
  );
};
