import { useRouter } from "next/router";

import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserAccountNav } from "@/components/user-account-nav";

import { useSession } from "next-auth/react";
import { type DashboardConfig } from "@/types";
import { useEffect } from "react";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Events",
      href: "/all-events",
    },
    {
      title: "Documentation",
      href: "/",
    },
    {
      title: "Support",
      href: "/",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Tickets",
      href: "/dashboard/tickets",
      icon: "ticket",
    },
  ],
};

interface DashboardLayoutProps {
  children?: React.ReactNode;
  withSidebar?: boolean;
}

export default function DashboardLayout({
  children,
  withSidebar = true,
}: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.replace("/login");
    }
  }, [router, status]);

  // TODO: improve loading state
  if (status === "loading") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav
            user={{
              name: session?.user.name,
              image: session?.user.image,
              email: session?.user.email,
            }}
          />
        </div>
      </header>
      {withSidebar ? (
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={dashboardConfig.sidebarNav} />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      ) : (
        <main className="container mx-auto">{children}</main>
      )}
      {/* <SiteFooter className="border-t" /> */}
    </div>
  );
}
