'use client';

import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone } from 'lucide-react';

const Location: React.FC = () => {
  const latitude = 9.7978;    // Plateau State approximate latitude
  const longitude = 8.8875;   // Plateau State approximate longitude
  const placeName = "AAGC - Apostolic Army Global Church";
  const address = "QVQ4+7V9, Bukuru 930101, Plateau, Nigeria";

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}&center=${latitude},${longitude}&zoom=16`;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=en`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className="w-full"> {/* Removed bg-white */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-8">
        {/* Left: Info Panel */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Our Location</h2>
              <p className="text-gray-600 dark:text-gray-300">Come worship with us in Plateau</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{placeName}</h3>
              <p className="flex items-start gap-2 text-gray-600 dark:text-gray-300 mt-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                {address}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                Contact Us
              </h4>
              <div className="space-y-2">
                <a
                  href="tel:+2348031234567"
                  className="block text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-emerald-300 transition"
                >
                  +234 803 123 4567
                </a>
                <a
                  href="mailto:info@aagc.com"
                  className="block text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-emerald-300 transition"
                >
                  info@aagc.com
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-shadow shadow-md hover:shadow-lg"
              >
                <Navigation className="h-5 w-5" />
                Get Directions
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>

        {/* Right: Map Panel */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <iframe
            src={mapSrc}
            className="w-full h-[400px] md:h-[500px] lg:h-full border-0 rounded-2xl"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Location of ${placeName}`}
          />

          {/* Map overlay label */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
            📍 Bukuru, Plateau
          </div>

          {/* Map hint */}
          <div className="absolute bottom-4 left-4 hidden md:flex px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm text-xs text-gray-600 dark:text-gray-300 items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Use mouse or touch to navigate the map
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-4 right-4 hidden md:block px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-xs text-gray-600 dark:text-gray-300">
            {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
          </div>
        </div>
      </section>
    </div>
  );
};

export default Location;