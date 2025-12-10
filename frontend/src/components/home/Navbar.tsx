// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Church, Menu, ChevronDown, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownHover = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 lg:px-16 py-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
            <Church className="w-6 h-6 text-white" />
          </div>

          <div>
            <div className="text-white font-bold text-lg">APOSTOLIC ARMY</div>
            <div className="text-white/70 text-xs">GLOBAL CHURCH (AAGC)</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-green-500 font-medium">
            Home
          </Link>

          {/* About Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleDropdownHover("about")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              className="flex items-center gap-1 text-white hover:text-green-500 transition"
              aria-expanded={activeDropdown === "about"}
            >
              About Us
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            {/* Glassmorphism Dropdown */}
            <div
              className={`absolute top-full left-0 mt-3 w-48 rounded-lg
                bg-white/10 backdrop-blur-md border border-white/20
                shadow-lg transition-all duration-200 ${
                  activeDropdown === "about"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none"
                }`}
            >
              <Link
                href="/about/vision"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 rounded-t-lg transition"
                onClick={() => setActiveDropdown(null)}
              >
                Our Vision
              </Link>
              <Link
                href="/about/leadership"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 transition"
                onClick={() => setActiveDropdown(null)}
              >
                Leadership
              </Link>
              <Link
                href="/about/beliefs"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 rounded-b-lg transition"
                onClick={() => setActiveDropdown(null)}
              >
                Our Beliefs
              </Link>
            </div>
          </div>

          {/* Events Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleDropdownHover("events")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="flex items-center gap-1 text-white hover:text-green-500 transition">
              Events
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            <div
              className={`absolute top-full left-0 mt-3 w-48 rounded-lg
                bg-white/10 backdrop-blur-md border border-white/20
                shadow-lg transition-all duration-200 ${
                  activeDropdown === "events"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none"
                }`}
            >
              <Link
                href="/events/services"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 rounded-t-lg transition"
                onClick={() => setActiveDropdown(null)}
              >
                Church Services
              </Link>
              <Link
                href="/events/programs"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 transition"
                onClick={() => setActiveDropdown(null)}
              >
                Special Programs
              </Link>
              <Link
                href="/events/outreach"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 rounded-b-lg transition"
                onClick={() => setActiveDropdown(null)}
              >
                Outreach
              </Link>
            </div>
          </div>

          {/* Resources Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleDropdownHover("resources")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="flex items-center gap-1 text-white hover:text-green-500 transition">
              Resources
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            <div
              className={`absolute top-full left-0 mt-3 w-48 rounded-lg
                bg-white/10 backdrop-blur-md border border-white/20
                shadow-lg transition-all duration-200 ${
                  activeDropdown === "resources"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none"
                }`}
            >
              <Link
                href="/resources/sermons"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 rounded-t-lg transition"
                onClick={() => setActiveDropdown(null)}
              >
                Sermons
              </Link>
              <Link
                href="/resources/devotionals"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 transition"
                onClick={() => setActiveDropdown(null)}
              >
                Devotionals
              </Link>
              <Link
                href="/resources/media"
                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/20 rounded-b-lg transition"
                onClick={() => setActiveDropdown(null)}
              >
                Media Gallery
              </Link>
            </div>
          </div>

          <Link
            href="/join"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition"
          >
            Join AAGC
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden text-white p-2"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-6 bg-black/90 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="space-y-4">
            <Link
              href="/"
              className="block text-green-500 font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Dropdown: About */}
            <div className="space-y-2">
              <div className="text-white font-medium py-3 px-4">About Us</div>
              <div className="ml-4 space-y-2 border-l border-white/10 pl-4">
                <Link
                  href="/about/vision"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Vision
                </Link>
                <Link
                  href="/about/leadership"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leadership
                </Link>
                <Link
                  href="/about/beliefs"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Beliefs
                </Link>
              </div>
            </div>

            {/* Mobile Dropdown: Events */}
            <div className="space-y-2">
              <div className="text-white font-medium py-3 px-4">Events</div>
              <div className="ml-4 space-y-2 border-l border-white/10 pl-4">
                <Link
                  href="/events/services"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Church Services
                </Link>
                <Link
                  href="/events/programs"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Special Programs
                </Link>
                <Link
                  href="/events/outreach"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Outreach
                </Link>
              </div>
            </div>

            {/* Mobile Dropdown: Resources */}
            <div className="space-y-2">
              <div className="text-white font-medium py-3 px-4">Resources</div>
              <div className="ml-4 space-y-2 border-l border-white/10 pl-4">
                <Link
                  href="/resources/sermons"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sermons
                </Link>
                <Link
                  href="/resources/devotionals"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Devotionals
                </Link>
                <Link
                  href="/resources/media"
                  className="block text-white/80 hover:text-green-400 py-2 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Media Gallery
                </Link>
              </div>
            </div>

            <Link
              href="/join"
              className="block bg-green-600 hover:bg-green-700 text-white text-center px-6 py-4 rounded-full font-medium transition mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join AAGC
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;