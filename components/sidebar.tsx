"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Link2,
  Menu,
  User,
  X,
  Youtube
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Set collapsed state and mobile state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCollapsed(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Chat with Site",
      icon: MessageSquare,
      href: "/chat-with-site",
    },
    {
      label: "Chat with PDF",
      icon: FileText,
      href: "/chat-with-pdf",
    },
    {
      label: "Chat with YouTube",
      icon: Youtube,
      href: "/chat-with-yt",
    },
  ];

  const SidebarContent = () => (
    <>
      <div className={cn(
        "border-b border-b-cyan-100 dark:border-b-cyan-900/30 h-14"
      )}>
        <div className="h-14 flex items-center px-4">
          <h1 className="text-xl font-semibold tracking-tight">
            ByteAI
          </h1>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-2 py-2">
          {routes.map((route) => (
            <Link 
              key={route.href} 
              href={route.href}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  pathname === route.href 
                    ? "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-800/20 dark:hover:bg-cyan-800/30" 
                    : "hover:bg-cyan-100 dark:hover:bg-cyan-800/20"
                )}
              >
                <route.icon className="h-4 w-4" />
                <span className="ml-2 text-sm">{route.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2 p-2 border-t border-t-cyan-100 dark:border-t-cyan-900/30">
        <ThemeToggle isCollapsed={false} />
        <Button
          variant="ghost"
          className="w-full justify-start h-10 hover:bg-cyan-100 dark:hover:bg-cyan-800/20"
        >
          <User className="h-4 w-4" />
          <span className="ml-2 text-sm">debsourya</span>
        </Button>
      </div>
    </>
  );

  // Mobile view
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 right-4 z-40 hover:bg-cyan-100 dark:hover:bg-cyan-800/20"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="p-0 w-[240px] bg-cyan-50 dark:bg-[#050A09]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop view
  return (
    <div className={cn(
      "relative hidden md:flex flex-col h-screen border-r transition-all duration-300 bg-cyan-50 dark:bg-[#050A09] border-r-cyan-100 dark:border-r-cyan-900/30",
      isCollapsed ? "w-[80px]" : "w-[240px]",
      className
    )}>
      <div className={cn(
        "border-b border-b-cyan-100 dark:border-b-cyan-900/30 transition-all duration-300",
        isCollapsed ? "h-[88px]" : "h-14"
      )}>
        <div className="h-14 flex items-center justify-end px-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-cyan-100 dark:hover:bg-cyan-800/20"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        {isCollapsed && (
          <div className="h-11 flex items-center justify-center">
            <h1 className="text-lg font-semibold tracking-tight">
              B
            </h1>
          </div>
        )}
        {!isCollapsed && (
          <div className="absolute top-0 left-0 h-14 flex items-center px-4">
            <h1 className="text-xl font-semibold tracking-tight">
              ByteAI            </h1>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                isCollapsed && "justify-center px-2",
                pathname === route.href 
                  ? "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-800/20 dark:hover:bg-cyan-800/30" 
                  : "hover:bg-cyan-100 dark:hover:bg-cyan-800/20"
              )}
            >
              <route.icon className="h-4 w-4" />
              {!isCollapsed && (
                <span className="ml-2 text-sm">{route.label}</span>
              )}
            </Button>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-2 border-t border-t-cyan-100 dark:border-t-cyan-900/30">
        <ThemeToggle isCollapsed={isCollapsed} />
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10 hover:bg-cyan-100 dark:hover:bg-cyan-800/20",
            isCollapsed && "justify-center px-2"
          )}
        >
          <User className="h-4 w-4" />
          {!isCollapsed && (
            <span className="ml-2 text-sm">debsourya</span>
          )}
        </Button>
      </div>
    </div>
  );
}
