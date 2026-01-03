// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church, Menu, ChevronDown, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is homepage
  const isHomepage = pathname === "/";
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navbar styles based on page and scroll state
  const getNavbarStyles = () => {
    if (isHomepage) {
      // Homepage: transparent background, white text
      return {
        bg: isScrolled 
          ? "bg-gray-500/90 backdrop-blur-md shadow-lg" 
          : "bg-transparent",
        textColor: isScrolled ? "text-gray-900" : "text-white",
        logoBg: isScrolled ? "bg-green-700" : "bg-green-700",
        dropdownBg: isScrolled 
          ? "bg-white/90 backdrop-blur-md border border-gray-200" 
          : "bg-white/10 backdrop-blur-md border border-white/20",
        dropdownText: isScrolled ? "text-gray-900" : "text-white/90",
        mobileMenuBg: isScrolled 
          ? "bg-white/95 backdrop-blur-lg border border-gray-200" 
          : "bg-black/90 backdrop-blur-lg border border-white/10",
        mobileText: isScrolled ? "text-gray-900" : "text-white",
        hoverColor: isScrolled ? "hover:text-green-600" : "hover:text-green-400",
      };
    } else {
      // Other pages: white background, dark text
      return {
        bg: isScrolled 
          ? "bg-white shadow-lg" 
          : "bg-white",
        textColor: "text-gray-900",
        logoBg: "bg-green-700",
        dropdownBg: "bg-white border border-gray-200 shadow-lg",
        dropdownText: "text-gray-700",
        mobileMenuBg: "bg-white border border-gray-200",
        mobileText: "text-gray-900",
        hoverColor: "hover:text-green-600",
      };
    }
  };

  const styles = getNavbarStyles();

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
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-4 transition-all duration-300 ${styles.bg}`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 ${styles.logoBg} rounded-lg flex items-center justify-center`}>
            <Church className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className={`font-bold text-lg ${styles.textColor}`}>
              APOSTOLIC ARMY
            </div>
            <div className={`text-xs ${isHomepage && !isScrolled ? 'text-white/70' : 'text-gray-600'}`}>
              GLOBAL CHURCH (AAGC)
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link 
            href="/" 
            className={`font-medium ${pathname === "/" ? 'text-green-600' : styles.textColor} ${styles.hoverColor} transition`}
          >
            Home
          </Link>

          {/* About Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleDropdownHover("about")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              className={`flex items-center gap-1 ${styles.textColor} ${styles.hoverColor} transition`}
              aria-expanded={activeDropdown === "about"}
            >
              About Us
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            <div
              className={`absolute top-full left-0 mt-3 w-48 rounded-lg
                ${styles.dropdownBg} backdrop-blur-md
                shadow-lg transition-all duration-200 ${
                  activeDropdown === "about"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none"
                }`}
            >
              <Link
                href="/about/vision"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 rounded-t-lg transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Our Vision
              </Link>
              <Link
                href="/about/leadership"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Leadership
              </Link>
              <Link
                href="/about/beliefs"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 rounded-b-lg transition`}
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
            <button className={`flex items-center gap-1 ${styles.textColor} ${styles.hoverColor} transition`}>
              Events
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            <div
              className={`absolute top-full left-0 mt-3 w-48 rounded-lg
                ${styles.dropdownBg} backdrop-blur-md
                shadow-lg transition-all duration-200 ${
                  activeDropdown === "events"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none"
                }`}
            >
              <Link
                href="/events/services"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 rounded-t-lg transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Church Services
              </Link>
              <Link
                href="/events/programs"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Special Programs
              </Link>
              <Link
                href="/events/outreach"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 rounded-b-lg transition`}
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
            <button className={`flex items-center gap-1 ${styles.textColor} ${styles.hoverColor} transition`}>
              Resources
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            <div
              className={`absolute top-full left-0 mt-3 w-48 rounded-lg
                ${styles.dropdownBg} backdrop-blur-md
                shadow-lg transition-all duration-200 ${
                  activeDropdown === "resources"
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible translate-y-1 pointer-events-none"
                }`}
            >
              <Link
                href="/resources/sermons"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 rounded-t-lg transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Sermons
              </Link>
              <Link
                href="/resources/devotionals"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Devotionals
              </Link>
              <Link
                href="/resources/media"
                className={`block px-4 py-3 text-sm ${styles.dropdownText} hover:bg-gray-100/50 rounded-b-lg transition`}
                onClick={() => setActiveDropdown(null)}
              >
                Media Gallery
              </Link>
            </div>
          </div>

          <Link
            href="/join"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium transition"
          >
            Join AAGC
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`lg:hidden p-2 ${styles.textColor}`}
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
        <div className={`lg:hidden mt-4 rounded-xl p-4 ${styles.mobileMenuBg} shadow-lg`}>
          <div className="space-y-2">
            <Link
              href="/"
              className={`block ${pathname === "/" ? 'text-green-600' : styles.mobileText} font-medium py-3 px-4 rounded-lg hover:bg-gray-100/50 transition`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Dropdown: About */}
            <div className="space-y-2">
              <div className={`${styles.mobileText} font-medium py-3 px-4`}>
                About Us
              </div>
              <div className="ml-4 space-y-2 border-l border-gray-200 pl-4">
                <Link
                  href="/about/vision"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Vision
                </Link>
                <Link
                  href="/about/leadership"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leadership
                </Link>
                <Link
                  href="/about/beliefs"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Beliefs
                </Link>
              </div>
            </div>

            {/* Mobile Dropdown: Events */}
            <div className="space-y-2">
              <div className={`${styles.mobileText} font-medium py-3 px-4`}>
                Events
              </div>
              <div className="ml-4 space-y-2 border-l border-gray-200 pl-4">
                <Link
                  href="/events/services"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Church Services
                </Link>
                <Link
                  href="/events/programs"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Special Programs
                </Link>
                <Link
                  href="/events/outreach"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Outreach
                </Link>
              </div>
            </div>

            {/* Mobile Dropdown: Resources */}
            <div className="space-y-2">
              <div className={`${styles.mobileText} font-medium py-3 px-4`}>
                Resources
              </div>
              <div className="ml-4 space-y-2 border-l border-gray-200 pl-4">
                <Link
                  href="/resources/sermons"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sermons
                </Link>
                <Link
                  href="/resources/devotionals"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Devotionals
                </Link>
                <Link
                  href="/resources/media"
                  className={`block ${styles.mobileText}/80 hover:text-green-600 py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Media Gallery
                </Link>
              </div>
            </div>

            <Link
              href="/join"
              className="block bg-green-600 hover:bg-green-700 text-white text-center px-6 py-3 rounded-full font-medium transition mt-3"
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