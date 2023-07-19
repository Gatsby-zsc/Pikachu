import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { api } from "@/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HeartOff, Heart } from "lucide-react";
import { useRouter } from "next/router";
import { check } from "prettier";

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
// Wed Jul 19 2023 00:00:51
function EventCard({ props }: EventCardProps) {
  const router = useRouter();

  const eventId = props.id;
  const { data: prices } = api.ticketRouter.prices.useQuery({ eventId });

  const { data, status } = useSession();
  // console.log(data);
  let favourite = false;
  if (status === "authenticated") {
    const { data: check } = api.favouriteRouter.check.useQuery({
      eventId: eventId,
    });
    if (check !== null) {
      favourite = true;
    }
  }

  // const eventDate = new Date(props.startTime);
  // console.log(eventDate.getMonth());
  // console.log(eventDate.getDay());
  // console.log(eventDate.getDate());

  const priceRange = [];
  if (prices) {
    for (const eachPrice of prices) {
      priceRange.push(eachPrice.price);
    }
  }
  const lowest = Math.min(...priceRange);
  const highest = Math.max(...priceRange);

  const addFavourite = api.favouriteRouter.add.useMutation();
  const deleteFavourite = api.favouriteRouter.delete.useMutation();
  function addFavorite() {
    if (status !== "authenticated") {
      // ask user to login before favourite events
      void router.replace("/login");
    }
    // console.log(check);
    if (favourite) {
      addFavourite.mutate({ eventId: eventId });
      console.log("added to favirote");
    } else {
      deleteFavourite.mutate({ eventId: eventId });
      console.log("deleted from favirote");
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
