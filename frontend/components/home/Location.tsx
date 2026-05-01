'use client';

import { MapPin, Navigation, ExternalLink, Phone } from 'lucide-react';

export default function Location() {
  const latitude = 9.7978;
  const longitude = 8.8875;
  const placeName = "AAGC - Apostolic Army Global Church";
  const address = "QVQ4+7V9, Bukuru 930101, Plateau, Nigeria";

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}&center=${latitude},${longitude}&zoom=16`;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=en`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section className="py-[80px] px-6 lg:px-16 bg-[#f7f7f4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#e6e5e0] mb-6">
            <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
            <span className="text-sm font-medium tracking-wide text-[#5a5852] uppercase" style={{ letterSpacing: '0.88px' }}>
              Visit Us
            </span>
          </div>

          <h2
            className="text-[36px] font-normal text-[#26251e]"
            style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Our Location
          </h2>
          <p className="text-lg text-[#5a5852] mt-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Come worship with us in Plateau State
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Info Card */}
          <div className="bg-white rounded-[12px] border border-[#e6e5e0] p-8 hover:border-[#cfcdc4] transition space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#26251e] mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                {placeName}
              </h3>

              <div className="flex items-start gap-3 text-[#5a5852]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <MapPin className="h-5 w-5 text-[#f54e00] mt-0.5 flex-shrink-0" />
                <p>{address}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-[#e6e5e0]">
              <h4 className="text-lg font-semibold text-[#26251e] flex items-center gap-2 mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <Phone className="h-5 w-5 text-[#f54e00]" />
                Contact Us
              </h4>
              <div className="space-y-2">
                <a href="tel:+2348031234567" className="block text-[#5a5852] hover:text-[#f54e00] transition">
                  +234 803 123 4567
                </a>
                <a href="mailto:info@aagc.com" className="block text-[#5a5852] hover:text-[#f54e00] transition">
                  info@aagc.com
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#e6e5e0]">
              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-[18px] py-[10px] bg-[#f54e00] hover:bg-[#d04200] text-white font-medium rounded-[8px] transition"
                style={{ fontSize: '14px', lineHeight: '1.0' }}
              >
                <Navigation className="h-4 w-4" />
                Get Directions
                <ExternalLink className="h-3 w-3" />
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-[18px] py-[10px] border border-[#e6e5e0] text-[#26251e] font-medium rounded-[8px] hover:bg-[#f7f7f4] transition"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
              >
                Open in Maps
              </a>
            </div>
          </div>

          {/* Right: Map */}
          <div className="rounded-[12px] overflow-hidden border border-[#e6e5e0] hover:border-[#cfcdc4] transition">
            <iframe
              src={mapSrc}
              className="w-full h-[400px] lg:h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Location of ${placeName}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
