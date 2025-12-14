'use client';

import Link from "next/link";
import { Church, Facebook, Youtube, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const navItems = [
    { label: 'About Us', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Give', href: '/give' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Large Background Logo/Text */}
      <div className="absolute top-32 left-0 right-0 flex items-start justify-center pointer-events-none overflow-hidden">
        <div className="text-[20rem] lg:text-[28rem] xl:text-[32rem] font-bold text-gray-500/40 leading-none select-none whitespace-nowrap">
          AAGC
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-16 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Church className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AAGC</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Apostolic Army Global Church</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A vibrant community committed to encountering God, building relationships, 
              and impacting our city with Christ's love.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Get In Touch</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-green-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>14 Harbor Way, Lagos, Nigeria</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-600 dark:text-emerald-400 flex-shrink-0" />
                <Link 
                  href="tel:+2341234567890" 
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                >
                  +234 123 456 7890
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600 dark:text-emerald-400 flex-shrink-0" />
                <Link 
                  href="mailto:info@aagc.org" 
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                >
                  info@aagc.org
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links, Social & App Downloads */}
          <div className="space-y-6">
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social & App Download Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Social Icons */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Follow Us</h3>
                <div className="flex items-center gap-3">
                  {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                    <Link
                      key={i}
                      href="#"
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile App Download */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Get Our App</h3>
                <div className="flex gap-4">
                  {/* iOS App */}
                  <Link
                    href="https://www.apple.com/app-store/"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                    title="Download on App Store"
                  >
                    <svg 
                      className="h-8 w-8" 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.76 3.28-.76 2 .76 3.3.73 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z"/>
                    </svg>
                  </Link>

                  {/* Android App */}
                  <Link
                    href="https://play.google.com/store"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                    title="Get it on Google Play"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 2C5.08579 2 5.5 2.41421 5.5 3V21C5.5 21.5858 5.08579 22 4.5 22C3.91421 22 3.5 21.5858 3.5 21V3C3.5 2.41421 3.91421 2 4.5 2Z" fill="currentColor"/>
                      <path d="M5.82315 2.64648L20.8232 11.1465C21.3503 11.4948 21.3503 12.5052 20.8232 12.8535L5.82315 21.3535C5.38201 21.6523 4.75 21.3394 4.75 20.8284V3.17157C4.75 2.66059 5.38201 2.34768 5.82315 2.64648Z" fill="currentColor"/>
                      <path d="M5.5 22.75C6.88071 22.75 8 21.6307 8 20.25C8 18.8693 6.88071 17.75 5.5 17.75C4.11929 17.75 3 18.8693 3 20.25C3 21.6307 4.11929 22.75 5.5 22.75Z" fill="currentColor"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} copyright all rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm">
              {['Terms', 'Privacy Policy', 'Facebook', 'Twitter'].map((item) => (
                <Link 
                  key={item}
                  href="#" 
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}