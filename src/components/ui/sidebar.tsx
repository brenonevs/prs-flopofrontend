"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  isMobile: boolean
}>({
  isMobile: false
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export function Sidebar({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarHeader({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarGroup({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({ children, ...props }: React.ComponentProps<"li">) {
  return (
    <li {...props}>
      {children}
    </li>
  )
}

export function SidebarMenuButton({ 
  children, 
  className,
  ...props 
}: React.ComponentProps<"button">) {
  return (
    <button 
      className={cn("flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent", className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarMenuAction({ 
  children, 
  className,
  showOnHover = false,
  ...props 
}: React.ComponentProps<"button"> & { showOnHover?: boolean }) {
  return (
    <button 
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent",
        showOnHover && "opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button 
      className={cn("flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent", className)}
      {...props}
    >
      Menu
    </button>
  )
}
