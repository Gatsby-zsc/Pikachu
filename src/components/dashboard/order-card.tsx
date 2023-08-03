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
  console.log(data);
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
        className="group mb-3 flex cursor-pointer rounded-md p-4 transition duration-200 hover:shadow-xl"
        onClick={openOrderDetail}
      >
        <div className="ml-2 mr-6 w-16 text-lg font-semibold text-slate-500">
          <div>{week}</div>
          <p className="text-sm">
            {month} {day}
          </p>
          <div>{year}</div>
        </div>
        <div className="mr-6 w-1/3">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="/test.jpg"
              width={450}
              height={400}
              alt="Image"
              className="rounded-xl"
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
      </div>
    </div>
  );
}
