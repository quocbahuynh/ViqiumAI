"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { Search, Menu, X } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const MainAppHeader: React.FC = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full h-[64px] bg-white border-b border-gray-200 z-50  dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">






        <div className="flex items-center justify-between w-full gap-4 px-3 py-3 lg:px-0">

          <div className="flex items-start">
            <div className="block">
            <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-purple-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ShopBot</span>
            </Link>
          </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <NotificationDropdown />
            <ThemeToggleButton /> */}
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainAppHeader;
