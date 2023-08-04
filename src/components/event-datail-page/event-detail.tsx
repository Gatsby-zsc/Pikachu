import { CalendarIcon, MapPin, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { getDuration } from "@/utils/date";
import { formatPriceRange } from "@/utils/currency";
import { enGB } from "date-fns/locale";
import { format } from "date-fns";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { useFullPath } from "@/hooks/use-full-path";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect } from "react";

type EventDetailProps = {
  eventId: string;
};

export function EventDetail({ eventId }: EventDetailProps) {
  const router = useRouter();
  const fullPath = useFullPath();
  const [allowBook, setAllowBook] = React.useState(true);
  const { data: session, status } = useSession();
  const { data, isLoading, isError, error } =
    api.eventRouter.getEventDetail.useQuery(eventId, {
      enabled: !!eventId,
    });

  // check current time is before endTime
  useEffect(() => {
    if (data) {
      const endDate = new Date(data.endTime);
      const now = new Date();
      if (endDate <= now) {
        setAllowBook(false);
      }
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (data === null) {
    return <div>No data available</div>;
  }
  const startDate = new Date(data.startTime);
  const endDate = new Date(data.endTime);
  const eventStartDate = format(startDate, "EEEE, d MMMM", {
    locale: enGB,
  });

  const duration = getDuration(startDate, endDate);

  const formattedStartDate = format(
    startDate,
    "eee, dd MMMM yyyy 'at' hh:mm a "
  );

  const formattedEndDate = format(
    endDate,
    "eee, dd MMMM yyyy 'at' hh:mm a 'AEST'"
  );

  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;

  const prices = data.tickets.map((ticket) => ticket.price);

  const priceContent = formatPriceRange(prices);

  const handleBookButton = () => {
    if (status === "unauthenticated") {
      void router.replace("/login");
    }
    if (status == "authenticated") {
      void router.push(`${eventId}/bookInfo`);
    }
  };

  return (
    <div className="container mx-auto mb-10 flex flex-col">
      <div className="grid justify-items-center pt-2">
        <div className="w-[600px]">
          {/* Limit the length-width ratio */}
          <AspectRatio ratio={16 / 9}>
            <Image
              src={data.cover_image || "/test.jpg"}
              alt="event image"
              className="rounded-xl object-cover pt-1"
              fill
              sizes="100%"
              priority={true}
            />
          </AspectRatio>
        </div>
      </div>
      <div className="pt-12">
        <div className="mb-2 text-base font-semibold text-slate-700">
          {eventStartDate}
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-2/3">
          <div className="mb-4 text-5xl font-extrabold">{data.title}</div>
          <div className="mb-4 text-base text-slate-400">
            <p>
              By{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="font-semibold text-slate-600 hover:underline">
                    {data.user.name}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-center space-x-4">
                    <div className="mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.user.image || "/test.jpg"}
                        width={50}
                        height={50}
                        alt="User Image"
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-2 font-semibold">{data.user.name}</div>
                      <div className="mb-2 text-sm text-slate-500">
                        {data.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="px-auto mt-2 w-full text-center text-xs text-slate-400">
                    Joined on{" "}
                    {format(
                      new Date(data.user.registrationDate),
                      "dd MMMM yyyy"
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </p>
          </div>

          {/* Social media icons */}
          <div className="mb-4 flex space-x-2">
            <EmailShareButton url={fullPath || "/"}>
              <EmailIcon size={32} />
            </EmailShareButton>
            <FacebookShareButton url={fullPath || "/"}>
              <FacebookIcon size={32} />
            </FacebookShareButton>
            <LinkedinShareButton url={fullPath || "/"}>
              <LinkedinIcon size={32} />
            </LinkedinShareButton>
            <RedditShareButton url={fullPath || "/"}>
              <RedditIcon size={32} />
            </RedditShareButton>
            <TelegramShareButton url={fullPath || "/"}>
              <TelegramIcon size={32} />
            </TelegramShareButton>
            <TwitterShareButton url={fullPath || "/"}>
              <TwitterIcon size={32} />
            </TwitterShareButton>
          </div>

          <div className="mb-3 text-2xl font-bold">When and Whered</div>
          <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex w-full flex-row items-start p-4 md:w-1/2 md:border-r md:border-gray-300">
              <CalendarIcon className="mr-4 h-6 w-6 opacity-50" />
              <div>
                <p className="mb-2 text-base font-semibold">Date and Time</p>
                <p className="text-sm font-normal text-slate-400">
                  {dateRange}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-row items-start p-4 md:w-1/2">
              <MapPin className="mr-4 h-6 w-6 opacity-50" />
              <div>
                <p className="mb-2 text-base font-semibold">Location</p>
                <p className="text-sm font-normal text-slate-400">
                  {data.venue}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-3 text-2xl font-bold">About this event</div>
          <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
            <div className="flex w-full flex-row items-start p-4 md:w-1/2 md:border-r md:border-gray-300">
              <Clock className="mr-4 h-6 w-6 opacity-50" />
              <div>
                <p className="mb-2 text-base font-semibold">Duration</p>
                <p className="text-sm font-normal text-slate-400">{duration}</p>
              </div>
            </div>
            <div className="flex w-full flex-row items-start p-4 md:w-1/2">
              <Ticket className="mr-4 h-6 w-6 opacity-50" />
              <div>
                <p className="mb-2 text-base font-semibold">Type</p>
                <p className="text-sm font-normal text-slate-400">
                  {data.type}
                </p>
              </div>
            </div>
          </div>
          <div className="text-base text-slate-500">{data.description}</div>
          <div>
            {data.images.slice(1).map((img, index) => (
              <div key={index} className="mx-auto my-2 w-3/4">
                {/* Limit the length-width ratio */}
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={img || "/test.jpg"}
                    alt="event last images"
                    className="rounded-xl object-cover pt-1"
                    fill
                    sizes="100%"
                    priority={true}
                  />
                </AspectRatio>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="ml-4 mr-4 w-full rounded-lg border-2 border-slate-100 p-6">
            <div className="text-center text-xl font-semibold">
              {priceContent}
            </div>
            <Button
              className="mt-4 w-full text-base"
              onClick={handleBookButton}
              disabled={!allowBook}
            >
              {allowBook ? "Get tickets" : "Tickets unavailable"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
