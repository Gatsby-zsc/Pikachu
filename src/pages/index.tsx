import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import type { ReactElement } from "react";
import Layout from "@/components/landing-page/layout";
import { ArrowUpRight } from "lucide-react";

const Home = () => {
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

      <section className="container flex justify-center">
        <div className="mr-5 basis-1/4 ">
          <div className="group flex h-full flex-col rounded-xl bg-zinc-200 p-8 text-black shadow-none shadow-slate-900 transition-all duration-300 hover:translate-y-[-5%] hover:shadow-md">
            <p className="text-3xl font-bold">
              Create your event with the best online ticketing system
            </p>
            <p className="pb-8 pt-5 font-semibold">
              Easily create, manage, and deliver a memorable in-person or
              virtual event experience on a trusted platform.
            </p>
            <Link
              href="/all-events"
              className={cn(
                buttonVariants({ size: "lg", variant: "link" }),
                "mt-auto self-start p-0 text-lg underline group-hover:animate-shake"
              )}
            >
              Learn more <ArrowUpRight className="ml-2 inline-block" />
            </Link>
          </div>
        </div>
        <div className="mr-5 basis-1/4">
          <div className="group flex h-full flex-col rounded-xl bg-zinc-200 p-8 text-black shadow-none shadow-slate-900 transition-all duration-300 hover:translate-y-[-5%] hover:shadow-md">
            <p className="text-3xl font-bold">
              An event ticketing platform built for growth
            </p>
            <p className="pb-8 pt-5 font-semibold">
              Tap into the world&apos;s largest events marketplace and expand
              your reach with social marketing tools powered by our exclusive
              data, all at a cheap price point.
            </p>
            <Link
              href="/all-events"
              className={cn(
                buttonVariants({ size: "lg", variant: "link" }),
                "mt-auto self-start p-0 text-lg underline group-hover:animate-shake"
              )}
            >
              Learn more <ArrowUpRight className="ml-2 inline-block" />
            </Link>
          </div>
        </div>
        <div className="mr-5 basis-1/4">
          <div className="group flex h-full flex-col rounded-xl bg-zinc-200 p-8 text-black shadow-none shadow-slate-900 transition-all duration-300 hover:translate-y-[-5%] hover:shadow-md">
            <p className="text-3xl font-bold">
              Build and engage your community
            </p>
            <p className="pb-8 pt-5 font-semibold">
              Stay connected to your attendees and drive online ticket sales
              with advanced email marketing tools, targeted notifications, and
              real-time insights that get results.
            </p>
            <Link
              href="/all-events"
              className={cn(
                buttonVariants({ size: "lg", variant: "link" }),
                "mt-auto self-start p-0 text-lg underline group-hover:animate-shake"
              )}
            >
              Learn more <ArrowUpRight className="ml-2 inline-block" />
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl font-semibold leading-[1.1] sm:text-3xl md:text-6xl">
            Grow eventfully
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            We empower event organizers with industry-leading tools and
            technology to create, manage, and promote unforgettable live
            experiences around the world.
          </p>

          <Link href={"/"} target="_blank" rel="noreferrer" className="flex">
            <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border border-muted bg-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
              >
                <path d="M256 64A64 64 0 1 0 128 64a64 64 0 1 0 128 0zM152.9 169.3c-23.7-8.4-44.5-24.3-58.8-45.8L74.6 94.2C64.8 79.5 45 75.6 30.2 85.4s-18.7 29.7-8.9 44.4L40.9 159c18.1 27.1 42.8 48.4 71.1 62.4V480c0 17.7 14.3 32 32 32s32-14.3 32-32V384h32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V221.6c29.1-14.2 54.4-36.2 72.7-64.2l18.2-27.9c9.6-14.8 5.4-34.6-9.4-44.3s-34.6-5.5-44.3 9.4L291 122.4c-21.8 33.4-58.9 53.6-98.8 53.6c-12.6 0-24.9-2-36.6-5.8c-.9-.3-1.8-.7-2.7-.9z" />
              </svg>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-muted border-y-transparent"></div>
              <div className="flex h-10 items-center rounded-md border border-muted bg-muted px-4 font-medium">
                800K EVENT CREATORS
              </div>
            </div>
          </Link>
        </div>
      </section>
      <footer>
        <div className="my-10 text-center">© 2023 PikaPika</div>
      </footer>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
