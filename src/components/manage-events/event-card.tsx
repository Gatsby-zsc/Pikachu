import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
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

  const deleteEvent = api.eventRouter.deleteEvent.useMutation({
    onSuccess: () => {
      void ctx.eventRouter.invalidate();
    },
  });
  const publishEvent = api.eventRouter.publishEvent.useMutation({
    onSuccess: () => {
      void ctx.eventRouter.invalidate();
    },
  });
  const handleDeleteEvent = () => {
    deleteEvent.mutate(eventId);
  };
  const handlePublishEvent = () => {
    publishEvent.mutate(eventId);
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

          <Dialog>
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
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DialogTrigger className="w-full">Delete</DialogTrigger>
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
