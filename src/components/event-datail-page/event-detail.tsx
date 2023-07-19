import { CalendarIcon, MapPin, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { getDuration } from "@/utils/date";
import { formatPriceRange } from "@/utils/currency";
import { enGB } from "date-fns/locale";
import { format } from "date-fns";

export type EventDetailProps = {
  eventId: string;
};

export function EventDetail({ eventId }: EventDetailProps) {
  const { data, isLoading, isError, error } =
    api.eventRouter.getEventDetail.useQuery(eventId, {
      enabled: !!eventId,
    });

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
  // const date = formatDate(startDate);
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

  return (
    <div className="container mx-auto flex flex-col">
      <div className="grid justify-items-center pt-2">
        {/* <div className="max-w-7xl rounded-md bg-black bg-[url('/test.jpg')]">
          <Image src={data.img} width={600} height={300} alt="Image" />
        </div> */}
      </div>
      <div className="pt-12">
        <div className="mb-2 text-base font-semibold text-slate-700">
          {eventStartDate}
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-2/3">
          <div className="mb-4 text-5xl font-extrabold">{data.title}</div>
          <div className="mb-6 text-base text-slate-400">
            <p>
              By{" "}
              <span className="font-semibold text-slate-600">
                {data.createdUser}
              </span>
            </p>
          </div>
          <div className="mb-3 text-2xl font-bold">When and Where</div>
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
        </div>
        <div className="w-full md:w-1/3">
          <div className="ml-4 mr-4 w-full rounded-lg border-2 border-slate-100 p-6">
            <div className="semibold text-center">{priceContent}</div>
            <Button className="mt-6 w-full">Get tickets</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
