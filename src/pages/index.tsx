import Link from "next/link";
import { cn } from "@/utils/style-utils";
import { buttonVariants } from "@/components/ui/button";
import type { ReactElement } from "react";
import Layout from "@/components/landing-page/layout";

const Home = () => {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
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
            <Link href="/#login" className={cn(buttonVariants({ size: "lg" }))}>
              Find your next Event
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
