import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import type { ReactElement } from "react";
import Layout from "@/components/landing-page/layout";
// import { api } from "@/utils/api";

const Home = () => {
  // const { data: eventData } = api.eventRouter.publicFilterEvents.useQuery({
  //   Date: "1",
  //   Category: "none",
  //   Type: "none",
  //   isOnline: false,
  //   onlyEventsFollowed: false,
  //   sortKey: "0",
  //   userKey: "none",
  //   sortDirection: "asc",
  // });

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
            Discover Great Events or Create Your Own
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            PikaPika brings people together through live experiences. Discover
            events that match your passions, or create your own with online
            ticketing tools.
          </p>
          <div className="space-x-4">
            <Link
              href="/all-events"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Find your next Event
            </Link>
          </div>
        </div>
      </section>
      <div className="container flex justify-center">
        <div className="relative mr-5 basis-1/4 ">
          <div className="absolute rounded-xl  bg-zinc-300 p-8 text-black shadow-none shadow-slate-900 transition-transform duration-200 hover:translate-y-[-10%] hover:shadow-xl">
            <p className="text-3xl font-bold">
              Create your event with the best online ticketing system
            </p>
            <p className="pt-5 font-semibold">
              Easily create, manage, and deliver a memorable in-person or
              virtual event experience on a trusted platform.
            </p>
            <Link
              href="/all-events"
              className={cn(buttonVariants({ size: "lg" }), "mt-5")}
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="relative mr-5 basis-1/4">
          <div className="absolute rounded-xl  bg-zinc-300 p-8 text-black shadow-none shadow-slate-900 transition-transform duration-200 hover:translate-y-[-10%] hover:shadow-xl">
            <p className="text-3xl font-bold">
              An event ticketing platform built for growth
            </p>
            <p className="pt-10 font-semibold">
              Tap into the world’s largest events marketplace and expand your
              reach with social marketing tools powered by our exclusive data,
              all at a cheap price point.
            </p>
            <Link
              href="/all-events"
              className={cn(buttonVariants({ size: "lg" }), "mt-5")}
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="relative  mr-5 basis-1/4">
          <div className="absolute rounded-xl  bg-zinc-300 p-8 text-black shadow-none shadow-slate-900 transition-transform duration-200 hover:translate-y-[-10%] hover:shadow-xl">
            <p className="text-3xl font-bold">
              Build and engage your community
            </p>
            <p className="pt-12 font-semibold">
              Stay connected to your attendees and drive online ticket sales
              with advanced email marketing tools, targeted notifications, and
              real-time insights that get results.
            </p>
            <Link
              href="/all-events"
              className={cn(buttonVariants({ size: "lg" }), "mt-5")}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
      {/* <div>
        <p>Grow eventfully</p>
        <p>
          Explore all the built-in tools you need to start, run, and grow your
          business with events
        </p>
      </div> */}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
