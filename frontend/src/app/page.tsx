

'use client';

import HeroSection from "@/components/home/HeroSection";
// import MinistrySection from "@/components/home/MinistrySection";
import EventsSection from "@/components/home/EventsSection";
import SermonsSection from "@/components/home/SermonsSection";
import Footer from "@/components/sections/Footer";
import GivingSection from "@/components/home/GivingSection";
import ChurchDetailsSection from '@/components/home/ChurchDetails';
import Location from '@/components/home/Location';



export default function Home() {
  return (
    <div className="min-h-screen bg-night">
      <main className="mx-auto flex flex-col">
        <HeroSection />
        <ChurchDetailsSection/>
          <EventsSection />
          <SermonsSection />
          <GivingSection />
          <Location />
       </main>
      
      <Footer />
    </div>
  );
}