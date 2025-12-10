'use client';

import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

const Location: React.FC = () => {
  const latitude = 9.765061;   // Lagos latitude
  const longitude = 8.814226;  // Lagos longitude
  const placeName = "AAGC - Apostolic Army Global Church";
  const address = "14 Harbor Way, Lagos, Nigeria";

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(placeName)}&center=${latitude},${longitude}&zoom=16`;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en`;

  return (
    <div className="bg-white w-full">
    <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-8">
      {/* Left: Info Panel */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Our Location</h2>
            <p className="text-gray-600">Come worship with us</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{placeName}</h3>
            <p className="flex items-start gap-2 text-gray-600 mt-2">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              {address}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-shadow shadow-md hover:shadow-lg"
            >
              <Navigation className="h-5 w-5" />
              Get Directions
              <ExternalLink className="h-4 w-4" />
            </a>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>

      {/* Right: Map Panel */}
      <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <iframe
          src={mapSrc}
          className="w-full h-[400px] md:h-[500px] lg:h-full border-0 rounded-2xl"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Location of ${placeName}`}
        />

        {/* Map overlay label */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
          📍 Live Location
        </div>

        {/* Map hint */}
        <div className="absolute bottom-4 left-4 hidden md:flex px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-xs text-gray-600 items-center gap-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Use mouse or touch to navigate the map
        </div>
      </div>
    </section>
    </div>
  );
};

export default Location;
