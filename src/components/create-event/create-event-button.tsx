import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/style-utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ButtonGroup from "@/components/button-group";

interface CreateEventButtonProps {
  onCreate: () => void;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventTitle: "",
      organiser: "",
      eventType: "",
      eventCategory: "",
      eventTags: "",
      eventVenue: "",
      eventLocation: "",
      startDate: "",
      eventStartTime: "",
      endDate: "",
      eventEndTime: "",
      eventTimeZone: "",
      ticketName: "",
      ticketNumber: "",
      eventLanguage: "",
    },
  });

  const [startDate, setStartDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-center text-lg text-gray-500">
        Welcome to your dashboard!
      </p>

      <h1 className="mb-2 text-left text-4xl font-bold">Basic information</h1>
      <p className="mb-8 text-2xl">
        Name your event and tell event-goers why they should come. Add details
        that highlight what makes it unique.
      </p>
      <div className="mb-6">
        <label htmlFor="eventTitle" className="mb-2 block font-medium">
          Event Title <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="eventTitle"
          {...register("eventTitle", { required: true })}
          className="w-full rounded-md border p-2"
          placeholder="Be clear and descriptive"
        />
        {errors.eventTitle && (
          <p className="text-red-500">This field is required</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="eventBrief" className="mb-2 block font-medium">
          Event Brief <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="event"
          {...register("organiser", { required: true })}
          className="w-full rounded-md border p-2"
          placeholder="Description for the event"
        />
        {errors.organiser && (
          <p className="text-red-500">This field is required</p>
        )}
      </div>

      <div className="mb-6 flex">
        <div className="mr-2 w-1/2">
          <Select>
            <SelectTrigger className="rounded-md border p-2">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent className="absolute mt-1 w-60 rounded-md bg-white shadow-lg">
              <SelectGroup>
                <SelectItem value="Appearance">
                  Appearance and Signing
                </SelectItem>
                <SelectItem value="Attraction">Attraction</SelectItem>
                <SelectItem value="Camp and Trip">Camp and Trip</SelectItem>
                <SelectItem value="Training or Workshop">
                  Training or Workshop
                </SelectItem>
                <SelectItem value="Concert or performance">
                  Concert or performance
                </SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Dinner or Gala">Dinner or Gala</SelectItem>
                <SelectItem value="Festival or Fair">
                  Festival or Fail
                </SelectItem>
                <SelectItem value="Game or Competition">
                  Game or Competition
                </SelectItem>
                <SelectItem value="Networking Event">
                  Networking Event
                </SelectItem>
                <SelectItem value="Party or Social Gathering">
                  Party or Social Gathering
                </SelectItem>
                <SelectItem value="Seminar or Talk">Seminar or Talk</SelectItem>
                <SelectItem value="Tour">Tour</SelectItem>
                <SelectItem value="Tournament">Tournament</SelectItem>
                <SelectItem value="TraderShow">TraderShow</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="mr-2 w-1/2">
          <Select>
            <SelectTrigger className="rounded-md border p-2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="absolute mt-1 w-60 rounded-md bg-white shadow-lg">
              <SelectGroup>
                <SelectItem value="Business & Profession">
                  Business & Profession
                </SelectItem>
                <SelectItem value="Charity & Causes">
                  Charity & Causes
                </SelectItem>
                <SelectItem value="Community & Culture">
                  Community & Culture
                </SelectItem>
                <SelectItem value="Family & Education">
                  Family & Education
                </SelectItem>
                <SelectItem value="Fashion & Beauty">
                  Fashion & Beauty
                </SelectItem>
                <SelectItem value="Firm & Media">Firm & Media</SelectItem>
                <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                <SelectItem value="Government & Politics">
                  Government & Politics
                </SelectItem>
                <SelectItem value="Health & Wellness">
                  Health & Wellness
                </SelectItem>
                <SelectItem value="Hobbies">Hobbies</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Performing & Visual Arts">
                  Performing & Visual Arts
                </SelectItem>
                <SelectItem value="Religion & Spirituality">
                  Religion & Spirituality
                </SelectItem>
                <SelectItem value="School Activities">
                  School Activities
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="my-12" />
      <h1 className="mb-2 text-left text-4xl font-bold">Location</h1>
      <p className="mb-8 text-2xl">
        Help people in the area discover your event and let attendees know where
        to show up.
      </p>
      <div>
        <ButtonGroup />
      </div>
      <hr className="my-12" />
      <h1 className="mb-2 text-left text-4xl font-bold">Date and Time</h1>
      <p className="mb-8 text-2xl">
        Tell event-goers when your event starts and ends so they can make plans
        to attend.
      </p>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h2>
              Start Date<span className="text-red-500">*</span>
            </h2>
          </div>
          <div className="ml-8">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors.startDate && (
            <p className="text-red-500">Start date is required</p>
          )}
          <div className="ml-8">
            <h2>Start Time</h2>
          </div>
          <div className="ml-8 w-60">
            <Select>
              <SelectTrigger className="rounded-md border p-2">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="absolute mt-1 w-60 rounded-md bg-white shadow-lg">
                <SelectGroup>
                  <SelectItem value="0">12:00 AM</SelectItem>
                  <SelectItem value="1">1:00 AM</SelectItem>
                  <SelectItem value="2">2:00 AM</SelectItem>
                  <SelectItem value="3">3:00 AM</SelectItem>
                  <SelectItem value="4">4:00 AM</SelectItem>
                  <SelectItem value="5">5:00 AM</SelectItem>
                  <SelectItem value="6">6:00 AM</SelectItem>
                  <SelectItem value="7">7:00 AM</SelectItem>
                  <SelectItem value="8">8:00 AM</SelectItem>
                  <SelectItem value="9">9:00 AM</SelectItem>
                  <SelectItem value="10">10:00 AM</SelectItem>
                  <SelectItem value="11">11:00 AM</SelectItem>
                  <SelectItem value="12">12:00 PM</SelectItem>
                  <SelectItem value="13">1:00 PM</SelectItem>
                  <SelectItem value="14">2:00 PM</SelectItem>
                  <SelectItem value="15">3:00 PM</SelectItem>
                  <SelectItem value="16">4:00 PM</SelectItem>
                  <SelectItem value="17">5:00 PM</SelectItem>
                  <SelectItem value="18">6:00 PM</SelectItem>
                  <SelectItem value="19">7:00 PM</SelectItem>
                  <SelectItem value="20">8:00 PM</SelectItem>
                  <SelectItem value="21">9:00 PM</SelectItem>
                  <SelectItem value="22">10:00 PM</SelectItem>
                  <SelectItem value="23">11:00 PM</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h2>
              End Date<span className="text-red-500">*</span>
            </h2>
          </div>
          <div className="ml-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors.endDate && (
            <p className="text-red-500">End date is required</p>
          )}
          <div className="ml-8">
            <h2>End Time</h2>
          </div>
          <div className="ml-10 w-60">
            <Select>
              <SelectTrigger className="rounded-md border p-2">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="absolute mt-1 w-60 rounded-md bg-white shadow-lg">
                <SelectGroup>
                  <SelectItem value="0">12:00 AM</SelectItem>
                  <SelectItem value="1">1:00 AM</SelectItem>
                  <SelectItem value="2">2:00 AM</SelectItem>
                  <SelectItem value="3">3:00 AM</SelectItem>
                  <SelectItem value="4">4:00 AM</SelectItem>
                  <SelectItem value="5">5:00 AM</SelectItem>
                  <SelectItem value="6">6:00 AM</SelectItem>
                  <SelectItem value="7">7:00 AM</SelectItem>
                  <SelectItem value="8">8:00 AM</SelectItem>
                  <SelectItem value="9">9:00 AM</SelectItem>
                  <SelectItem value="10">10:00 AM</SelectItem>
                  <SelectItem value="11">11:00 AM</SelectItem>
                  <SelectItem value="12">12:00 PM</SelectItem>
                  <SelectItem value="13">1:00 PM</SelectItem>
                  <SelectItem value="14">2:00 PM</SelectItem>
                  <SelectItem value="15">3:00 PM</SelectItem>
                  <SelectItem value="16">4:00 PM</SelectItem>
                  <SelectItem value="17">5:00 PM</SelectItem>
                  <SelectItem value="18">6:00 PM</SelectItem>
                  <SelectItem value="19">7:00 PM</SelectItem>
                  <SelectItem value="20">8:00 PM</SelectItem>
                  <SelectItem value="21">9:00 PM</SelectItem>
                  <SelectItem value="22">10:00 PM</SelectItem>
                  <SelectItem value="23">11:00 PM</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <hr className="my-12" />
      <h1 className="mb-2 text-left text-4xl font-bold">
        Tickets Type and Price
      </h1>
      <p className="mb-8 text-2xl">
        Tell event-goers the type and price of your event so they can make plans
        to attend.
      </p>
      <div className="mb-4 flex items-center">
        <div>
          <h2>
            Tickets Description<span className="text-red-500">*</span>
          </h2>
        </div>
        <div className="ml-40">
          <h2>
            Number of Tickets<span className="text-red-500">*</span>
          </h2>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <Input
            type="text"
            placeholder="Tickets 1"
            {...register("ticketName", { required: true })}
            className="rounded-md border p-2"
          />
          {errors.ticketName && (
            <p className="text-red-500">Ticket name is required</p>
          )}
        </div>
        <div className="ml-40">
          <Input
            type="number"
            placeholder="Tickets Number"
            {...register("ticketNumber", { required: true })}
            className="rounded-md border p-2"
          />
          {errors.ticketNumber && (
            <p className="text-red-500">Ticket number is required</p>
          )}
        </div>
        <div className="ml-20">
          <Button>Add Ticket</Button>
        </div>
      </div>
      <div className="mt-8 text-right">
        <Button>Create Now</Button>
      </div>
    </div>
  );
};

export default CreateEventButton;
