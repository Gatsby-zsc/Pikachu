import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/style-utils";
import { toast } from "@/components/ui/use-toast";
import { eventTypes, eventTime, eventCategories } from "@/config/create-event";
import { combineDateAndTimeString } from "@/utils/date";
import { api } from "@/utils/api";

const FormSchema = z.object({
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
  ticketType: z.string(),
  ticketPrice: z.number({
    invalid_type_error: "ticket price must be a number",
  }),
});

export const CreateEventForm = () => {
  const createEvent = api.eventRouter.create.useMutation();

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
      ticketType: "Free",
      ticketPrice: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
      venue: "default location",
      startTime: eventStartComb,
      endTime: eventEndComb,
      capacity: 10,
      price: data.ticketPrice,
      eventStatus: false,
      seatType: data.ticketType,
    };

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(newData, null, 2)}</code>
        </pre>
      ),
    });
    console.log(newData);

    createEvent.mutate(newData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* Event Title */}
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
        <div className="grid grid-flow-col justify-stretch gap-4">
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

        {/* Event Start Date & Time */}
        <div className="grid grid-flow-col justify-stretch gap-4">
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
        <div className="grid grid-flow-col justify-stretch gap-4">
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

        {/* Event Tickets */}
        <div className="grid grid-flow-col justify-stretch gap-4">
          <FormField
            control={form.control}
            name="ticketType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Type</FormLabel>
                <FormControl>
                  <Input placeholder="ticket type" {...field} />
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
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
