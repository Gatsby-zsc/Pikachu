import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { MainNav } from "@/components/main-nav";
import { useRouter } from "next/router";

import { type LandingPageConfig } from "@/types";

export const landingPageConfig: LandingPageConfig = {
  mainNav: [
    {
      title: "Events",
      href: "/#events",
    },
    {
      title: "Blog",
      href: "/#blog",
    },
    {
      title: "Documentation",
      href: "/#docs",
    },
  ],
};

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: MarketingLayoutProps) => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={landingPageConfig.mainNav} />
          <nav>
            <Button
              variant="secondary"
              size="sm"
              className="px-4"
              onClick={
                sessionData
                  ? () => void signOut()
                  : () => void router.push("/login")
              }
            >
              {sessionData ? "Sign out" : "Sign in"}
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
