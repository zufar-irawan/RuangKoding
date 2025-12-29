"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./input";

interface NavbarClientWrapperProps {
  children: React.ReactNode;
  searchBar: React.ReactNode;
}

export function NavbarClientWrapper({
  children,
  searchBar,
}: NavbarClientWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden lg:flex flex-1 items-center justify-center max-w-2xl">
        {searchBar}
      </div>

      {/* Actions Container */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="lg:hidden p-2 hover:bg-tertiary/30 rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {children}
      </div>

      {/* Search Overlay for Mobile/Tablet */}
      {isSearchOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-card border-b border-border p-4 animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  className="flex-1 bg-background pl-10"
                  placeholder="Cari disini..."
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-tertiary/30 rounded-lg transition-colors"
                aria-label="Close Search"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
