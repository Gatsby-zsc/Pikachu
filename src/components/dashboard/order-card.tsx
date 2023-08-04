import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { enGB } from "date-fns/locale";
import { format } from "date-fns";

type RouterOutput = inferRouterOutputs<AppRouter>;
type OrderCardType = RouterOutput["orderRouter"]["getAllorders"];
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type OrderData = ArrayElement<OrderCardType>;

interface OrderCardProps {
  orderData: OrderData;
}

export function OrderCard({ orderData }: OrderCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const data = orderData;
  const eventStartDate = format(
    new Date(data.event.startTime),
    "EEEE d MMMM yyyy",
    {
      locale: enGB,
    }
  );

  function splitString(input: string): [string, string, string, string] {
    return input.split(" ") as [string, string, string, string];
  }
  const [week, month, day, year] = splitString(eventStartDate);

  const openOrderDetail = () => {
    if (status === "unauthenticated") {
      void router.replace("/login");
    }
    if (status == "authenticated") {
      void router.push(`/dashboard/tickets/${data.id}`);
    }
  };

  return (
    <div>
      <div
        className="group relative mb-3 flex cursor-pointer rounded-md py-4 pl-4 transition duration-200 hover:shadow-xl"
        onClick={data.bookStatus ? openOrderDetail : undefined}
      >
        <div className="ml-6 mr-6 w-20 font-heading text-lg font-semibold text-slate-500">
          <div>{week}</div>
          <p className="text-sm">
            {month} {day}
          </p>
          <div>{year}</div>
        </div>
        <div className="ml-2 mr-6 w-1/3">
          {/* Limit the length-width ratio */}
          <AspectRatio ratio={16 / 9}>
            <Image
              src={data.event.cover_image || "/test.jpg"}
              alt="event image"
              className="mr-3 rounded-xl object-cover pt-1"
              fill
              sizes="100%"
              priority={true}
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col justify-between">
          <div className="text-3xl font-semibold">{data.event.title}</div>
          <div>
            <div className="text-slate-600">{data.event.venue}</div>
            <div className="text-xs text-slate-400">Order No.{data.id}</div>
          </div>
        </div>
        {!data.bookStatus && (
          <div className="absolute right-0 flex h-full w-32 items-center">
            {/* Limit the length-width ratio */}
            <AspectRatio ratio={16 / 9}>
              <Image
                src={"/cancel.png"}
                alt="image"
                className="mr-3 rounded-xl object-cover pt-1"
                fill
                sizes="100%"
                priority={true}
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </div>
  );
}
