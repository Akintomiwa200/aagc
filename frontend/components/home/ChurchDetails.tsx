'use client';

import { Clock, Users, Flame, Shield } from "lucide-react";

export default function ChurchDetailsSection() {
  return (
    <section className="relative py-20 px-6 lg:px-16 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 dot-grid"></div>
     
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 0,100 Q 50,0 100,100 T 200,100"
            stroke="currentColor"
            fill="none"
            strokeWidth="0.5"
            className="text-gray-400"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">
              APOSTOLIC ARMY GLOBAL CHURCH
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Worship With Us
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mt-6">
            Apostolic Army Global Church (AAGC) is a growing family of believers
            committed to worship, discipleship, service, and kingdom impact.
            Join us in any of our weekly services and church departments.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Main Service Highlight */}
          <div className="lg:row-span-2">
            <div className="relative h-full rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80"
                alt="Church Service"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Church Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div className="text-white text-xs font-medium">
                  <div>APOSTOLIC ARMY</div>
                  <div className="text-white/70">GLOBAL CHURCH</div>
                </div>
              </div>

              {/* Service Highlight */}
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  SUNDAY<br />WORSHIP
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  9:00 AM – 12:00 PM
                </p>
                <p className="text-white/80 text-sm max-w-md">
                  A powerful time of worship, the Word, prayer, and divine encounters.
                  Come expecting and experience God in a fresh way.
                </p>
              </div>
            </div>
          </div>

          {/* Midweek Service */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Midweek Service
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Wednesdays | 5:30 PM – 7:00 PM  
                <br />
                A refreshing time of teaching, prayer, and spiritual growth.
              </p>
            </div>
          </div>

          {/* End of Month Vigil */}
          <div className=" rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-200" />
              </div>
              <h3 className="text-2xl font-bold ">
                End-of-Month Vigil
              </h3>
              <p className=" leading-relaxed">
                9:00 PM – 4:00 AM  
                <br />
                A night of intense prayer, worship, and prophetic declarations.
              </p>
            </div>
          </div>

          {/* Departments & Membership */}
          <div className="lg:col-span-2">
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80"
                alt="Church Departments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-white/80 text-sm mb-2">
                      JOIN A DEPARTMENT
                    </p>
                    <h4 className="text-3xl font-bold text-white">
                      Serve With Purpose
                    </h4>
                    <p className="text-white/80 max-w-xl mt-2 text-sm">
                      Become part of what God is doing by joining a department —
                      Choir, Media, Protocol, Technical, Ushering, Children, and more.
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition">
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
