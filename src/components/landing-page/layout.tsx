import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { MainNav } from "@/components/main-nav";
import { useRouter } from "next/router";
import { UserAccountNav } from "../user-account-nav";

import { type LandingPageConfig } from "@/types";

export const landingPageConfig: LandingPageConfig = {
  mainNav: [
    {
      title: "Events",
      href: "/all-events",
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
            {!sessionData ? (
              <Button
                variant="secondary"
                size="sm"
                className="px-4"
                onClick={() => void router.push("/login")}
              >
                {"Sign in"}
              </Button>
            ) : (
              <UserAccountNav
                user={{
                  name: sessionData.user.name,
                  image: sessionData.user.image,
                  email: sessionData.user.email,
                }}
              />
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
