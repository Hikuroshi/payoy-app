"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, CommandIcon, DashboardSquare01Icon, DiningTableIcon, LeftToRightListBulletIcon, MenuRestaurantIcon, Settings05Icon, UserArrowLeftRightIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { CurrentUserProfile } from "@/lib/auth/profile";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: CurrentUserProfile;
}) {
  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "Pengguna",
            url: "/dashboard/users",
            icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
          },
        ]
      : []),
    ...(user?.role === "owner" || user?.role === "cashier"
      ? [
          {
            title: "Pesanan",
            url: "/dashboard/orders",
            icon: <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} />,
          },
          {
            title: "History Pesanan",
            url: "/dashboard/orders/history",
            icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />,
          },
        ]
      : []),
    ...(user?.role === "owner"
      ? [
          {
            title: "Meja",
            url: "/dashboard/tables",
            icon: <HugeiconsIcon icon={DiningTableIcon} strokeWidth={2} />,
          },
          {
            title: "Makanan",
            url: "/dashboard/foods",
            icon: <HugeiconsIcon icon={MenuRestaurantIcon} strokeWidth={2} />,
          },
          {
            title: "Demo sebagai pelanggan",
            url: "/demo-customer",
            icon: <HugeiconsIcon icon={UserArrowLeftRightIcon} strokeWidth={2} />,
          },
        ]
      : []),
  ];
  const sidebarUser = {
    name: user?.fullName ?? data.user.name,
    email: user?.email ?? data.user.email,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard">
                <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />
                <span className="text-base font-semibold">Payoy!</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
