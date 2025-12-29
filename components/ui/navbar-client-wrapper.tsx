"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "./searchbar";

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
      {/* Desktop: Centered Search Bar */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl">{searchBar}</div>
      </div>

      {/* Mobile: Push icons to the end */}
      <div className="flex lg:hidden flex-1 items-center justify-end">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile/Tablet Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-foreground" />
          </button>

          {children}
        </div>
      </div>

      {/* Desktop: Icons Section */}
      <div className="hidden lg:flex items-center gap-2 md:gap-3 shrink-0">
        {children}
      </div>

      {/* Search Overlay for Mobile/Tablet */}
      {isSearchOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-card border-b border-border p-4 shadow-lg animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 w-full">
              <SearchBar isMobile onClose={() => setIsSearchOpen(false)} />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors shrink-0"
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
