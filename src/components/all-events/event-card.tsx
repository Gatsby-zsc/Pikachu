import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HeartOff, Heart } from "lucide-react";
import { useRouter } from "next/router";
// import { enGb } from "data-fns/locale";
import { format } from "date-fns";

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

function EventCard({ props }: EventCardProps) {
  const router = useRouter();

  const eventId = props.id;
  const { data: prices } = api.ticketRouter.prices.useQuery({ eventId });

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

  const priceRange = [];
  if (prices) {
    for (const eachPrice of prices) {
      priceRange.push(eachPrice.price);
    }
  }

  const lowest = Math.min(...priceRange);
  const highest = Math.max(...priceRange);

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
          <Image
            src="/sample.jpg"
            alt="sample"
            width={200}
            height={200}
            className="mr-3 rounded-xl pt-1"
          />
        </Link>
      </div>
      <div className="mb-4 ml-5 flex-1">
        <Link href={`/all-events/${eventId}`}>
          <p className="font-heading text-2xl font-bold">{props.title}</p>
        </Link>
        <p className="text-s2 pb-[3px] text-gray-600">{date}</p>
        <p className="text-s2 pb-[3px] text-gray-600">
          {props.isOnline ? "Online" : "In-place"}
        </p>
        <p className="text-s2 pb-[3px] text-gray-600">{props.venue}</p>

        {lowest === 0 && lowest === highest ? (
          <p className="pb-[3px] font-bold">Free</p>
        ) : lowest === highest ? (
          <p className="pb-[3px] font-bold">${lowest}</p>
        ) : (
          <p className="pb-[3px] font-bold">
            ${lowest} - ${highest}
          </p>
        )}
      </div>
      <div className="mb-3 flex items-end">
        <Button
          className="invisible group-hover:visible"
          variant="ghost"
          onClick={addFavorite}
        >
          {favourite ? <HeartOff /> : <Heart />}
        </Button>
      </div>
    </div>
  );
}

export default EventCard;
