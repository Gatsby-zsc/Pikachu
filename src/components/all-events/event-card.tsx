import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HeartOff, Heart } from "lucide-react";
import { useRouter } from "next/router";
// import { enGb } from "data-fns/locale";
import { format } from "date-fns";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { formatPriceRange } from "@/utils/currency";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type EventDetail = RouterOutput["eventRouter"]["publicFilterEvents"][0];

interface EventCardProps {
  props: EventDetail;
}

function EventCard({ props }: EventCardProps) {
  const router = useRouter();

  // get event prices
  const pricesRange: number[] = props.tickets.map((ticket) => {
    return ticket.price;
  });

  const prices = formatPriceRange(pricesRange);

  const eventId = props.id;

  const { status } = useSession();

  let favourite = false;
  if (status === "authenticated") {
    const { data: check } = api.favouriteRouter.check.useQuery({
      eventId: eventId,
    });
    if (check !== null) {
      favourite = true;
    }
  }

  const startDate = new Date(props.startTime);
  const date = format(startDate, "EEEE 'at' hh:mm a");

  // ticket availability
  const ticketsRemaining: number[] = props.tickets.map((ticket) => {
    return ticket.remaining;
  });

  const sumTicketsRemained = ticketsRemaining.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  // event favourite functionality
  const ctx = api.useContext();

  const addFavourite = api.favouriteRouter.add.useMutation({
    onSuccess: () => {
      void ctx.favouriteRouter.invalidate();
    },
  });
  const deleteFavourite = api.favouriteRouter.delete.useMutation({
    onSuccess: () => {
      void ctx.favouriteRouter.invalidate();
    },
  });
  function addFavorite() {
    if (status !== "authenticated") {
      // ask user to login before favourite events
      void router.replace("/login");
    }
    if (!favourite) {
      addFavourite.mutate({ eventId: eventId });
    } else {
      deleteFavourite.mutate({ eventId: eventId });
    }
  }

  return (
    <div className="group mb-2 flex rounded-xl p-5 shadow-none shadow-slate-700 transition duration-200 hover:shadow-xl">
      <div className="">
        <Link href={`/all-events/${eventId}`}>
          <div className="w-[200px]">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={`${props.cover_image || "/test.jpg"}`}
                alt="image"
                className="mr-3 rounded-xl object-cover pt-1"
                fill
                sizes="100%"
                priority={true}
              />
            </AspectRatio>
          </div>
        </Link>
      </div>
      <div className="mb-4 ml-5 flex-1">
        <div className="flex">
          <Link href={`/all-events/${eventId}`}>
            <p className="font-heading text-2xl font-bold">{props.title}</p>
          </Link>
        </div>
        <p className="text-s2 pb-[3px] text-gray-600">{date}</p>
        <p className="text-s2 pb-[3px] text-gray-600">
          {props.isOnline ? "Online" : "In-place"}
        </p>
        <p className="text-s2 pb-[3px] text-gray-600">{props.venue}</p>
        <p className="inline pb-[3px] text-lg font-bold">{prices}</p>
        <span className="pb-[3px] font-bold">
          &nbsp;&nbsp;&nbsp;{sumTicketsRemained} tickets left
        </span>
      </div>
      <div className="mb-3 flex items-end">
        {favourite ? (
          <Button variant="ghost" onClick={addFavorite}>
            <Heart className="text-red-500" />
          </Button>
        ) : (
          <Button
            className="invisible group-hover:visible"
            variant="ghost"
            onClick={addFavorite}
          >
            <Heart />
          </Button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
