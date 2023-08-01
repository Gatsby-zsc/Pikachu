import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { type Order } from "@prisma/client";

type EventCardType = {
  id: string;
  createdUser: string;
  description: string;
  endTime: Date;
  eventStatus: number;
  isDraft: boolean;
  isOnline: boolean;
  startTime: Date;
  title: string;
  type: string;
  venue: string;
  orders: Order[];
};

interface EventCardProps {
  props: EventCardType;
}

export const EventCard = ({ props }: EventCardProps) => {
  const router = useRouter();

  const eventId = props.id;
  const { data: eventData } = api.eventRouter.getEventDetail.useQuery(eventId);

  const startDate = new Date(props.startTime);
  const date = format(startDate, "EEEE 'at' hh:mm a");
  const ctx = api.useContext();
  const [isOpen, setIsOpen] = useState(false);

  const sendDeleteEmail =
    api.sendEventEmailRouter.sendDeleteRequest.useMutation();

  const deleteEvent = api.eventRouter.deleteEvent.useMutation({
    onSuccess: ({ count }) => {
      void ctx.eventRouter.invalidate();
      if (count) {
        setIsOpen(false);
        //todo send email to orders

        props.orders.forEach((ele) => {
          if (eventData)
            sendDeleteEmail.mutate({
              email: ele.email,
              ...eventData,
            });
        });

        toast({
          title: "delete success!",
        });
      }
    },
  });

  const publishEvent = api.eventRouter.publishEvent.useMutation({
    onSuccess: ({ isDraft }) => {
      void ctx.eventRouter.invalidate();
      if (!isDraft) {
        //todo send email to orders
        // props.orders.forEach((ele) => {
        //   if (eventData)
        //     sendPublishEmail.mutate({
        //       email: ele.email,
        //       ...eventData,
        //     });
        // });
        toast({
          title: "publish success!",
        });
      }
    },
  });

  const handleDeleteEvent = () => {
    deleteEvent.mutate(eventId);
  };

  const handlePublishEvent = () => {
    try {
      publishEvent.mutate(eventId);
    } catch (error) {
      console.error("Error while publishing event:", error);
    }
  };
  return (
    <div className="group mb-2 flex rounded-xl p-5 shadow-none shadow-slate-700 transition duration-200 hover:shadow-xl">
      <div className="">
        <Link href={`/all-events/${eventId}`}>
          <Image
            src="/test.jpg"
            alt="sample"
            width={200}
            height={200}
            className="mr-3 rounded-xl pt-1"
          />
        </Link>
      </div>
      <div className="mb-4 ml-5 flex-1">
        <div className="flex flex-row justify-between">
          <Link href={`/all-events/${eventId}`}>
            <p className="font-heading text-2xl font-bold">{props.title}</p>
          </Link>

          <Dialog
            open={isOpen}
            onOpenChange={(e) => {
              setIsOpen(e);
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <span className="cursor-pointer font-bold text-gray-500 transition-all hover:text-gray-950">
                  ...
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handlePublishEvent}>
                  <span>Publish</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {/* <Link href="/dashboard/event/create" > */}
                  <Link href={`/dashboard/event/create?eventId=${eventId}`}>
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DialogTrigger
                    className="w-full"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    Delete
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Confirm to delete this event?
              </DialogDescription>
              <DialogFooter>
                <Button type="submit" onClick={handleDeleteEvent}>
                  Yes, Delete it!
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-s2 pb-[3px] text-gray-600">{date}</p>
        <p className="text-s2 pb-[3px] text-gray-600">
          {props.isOnline ? "Online" : "In-place"}
        </p>
        <p className="text-s2 pb-[3px] text-gray-600">{props.venue}</p>
      </div>
      <div className="mb-3 flex items-end">
        <Button
          className="invisible group-hover:visible"
          variant="ghost"
        ></Button>
      </div>
    </div>
  );
};
