"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "~/components/nav-main"
import { NavSecondary } from "~/components/nav-secondary"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "/dashboard/features",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "/dashboard/features",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "/dashboard/features",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({  subscriptionStatus,username,email,avatar,...props }: React.ComponentProps<typeof Sidebar> & { subscriptionStatus:"none" | "active" | "canceled" | "expired" |  null,username:string,email:string,avatar:string }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                🚀
                <span className="text-base font-semibold">Starter Kit</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
         <NavUser user={{name:username ?? "",email:email ?? "",avatar:avatar ?? ""} } subscriptionStatus={subscriptionStatus}  />
      </SidebarFooter>
    </Sidebar>
  )
}
