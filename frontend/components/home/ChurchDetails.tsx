'use client';

import { Clock, Users, Flame, Shield } from "lucide-react";

export default function ChurchDetailsSection() {
  return (
    <section className="relative py-[80px] px-6 lg:px-16 overflow-hidden bg-[#f7f7f4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#e6e5e0]">
            <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
            <span className="text-sm font-medium tracking-wide text-[#5a5852] uppercase" style={{ letterSpacing: '0.88px' }}>
              APOSTOLIC ARMY GLOBAL CHURCH
            </span>
          </div>

          <h2
            className="text-[36px] font-normal text-[#26251e]"
            style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Worship With Us
          </h2>

          <p className="text-lg text-[#5a5852] max-w-3xl mx-auto leading-relaxed mt-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            Apostolic Army Global Church (AAGC) is a growing family of believers
            committed to worship, discipleship, service, and kingdom impact.
            Join us in any of our weekly services and church departments.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Main Service Highlight */}
          <div className="lg:row-span-2">
            <div className="relative h-full rounded-[12px] overflow-hidden border border-[#e6e5e0] group">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80"
                alt="Church Service"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26251e]/80 via-[#26251e]/40 to-transparent"></div>

              {/* Church Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-[8px]">
                <div className="w-8 h-8 bg-[#f54e00] rounded-[8px] flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div className="text-white text-xs font-medium">
                  <div>APOSTOLIC ARMY</div>
                  <div className="text-white/70">GLOBAL CHURCH</div>
                </div>
              </div>

              {/* Service Highlight */}
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                <h3 className="text-[36px] font-normal text-white leading-tight" style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  SUNDAY<br />WORSHIP
                </h3>
                <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  9:00 AM – 12:00 PM
                </p>
                <p className="text-white/80 text-sm max-w-md" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  A powerful time of worship, the Word, prayer, and divine encounters.
                  Come expecting and experience God in a fresh way.
                </p>
              </div>
            </div>
          </div>

          {/* Midweek Service */}
          <div className="bg-white rounded-[12px] p-8 border border-[#e6e5e0] hover:border-[#cfcdc4] transition">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#9fbbe0]/30 rounded-[8px] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#26251e]" />
              </div>
              <h3 className="text-lg font-semibold text-[#26251e]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Midweek Service
              </h3>
              <p className="text-[#5a5852] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Wednesdays | 5:30 PM – 7:00 PM
                <br />
                A refreshing time of teaching, prayer, and spiritual growth.
              </p>
            </div>
          </div>

          {/* End of Month Vigil */}
          <div className="bg-white rounded-[12px] p-8 border border-[#e6e5e0] hover:border-[#cfcdc4] transition">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#c0a8dd]/30 rounded-[8px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#26251e]" />
              </div>
              <h3 className="text-lg font-semibold text-[#26251e]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                End-of-Month Vigil
              </h3>
              <p className="text-[#5a5852] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                9:00 PM – 4:00 AM
                <br />
                A night of intense prayer, worship, and prophetic declarations.
              </p>
            </div>
          </div>

          {/* Departments & Membership */}
          <div className="lg:col-span-2">
            <div className="relative h-80 rounded-[12px] overflow-hidden border border-[#e6e5e0] group">
              <img
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80"
                alt="Church Departments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26251e]/70 via-transparent to-transparent"></div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-white/80 text-sm mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                      JOIN A DEPARTMENT
                    </p>
                    <h4 className="text-[22px] font-normal text-white" style={{ letterSpacing: '-0.11px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                      Serve With Purpose
                    </h4>
                    <p className="text-white/80 max-w-xl mt-2 text-sm" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                      Become part of what God is doing by joining a department —
                      Choir, Media, Protocol, Technical, Ushering, Children, and more.
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 bg-[#f54e00] hover:bg-[#d04200] text-white px-[18px] py-[10px] rounded-[8px] font-medium transition" style={{ fontSize: '14px', lineHeight: '1.0' }}>
                    <Users className="w-5 h-5" />
                    Join a Department
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

