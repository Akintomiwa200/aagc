import EventsSection from '@/components/sections/EventsSection';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata = {
  title: 'Events & Gatherings | AAGC',
  description: 'Join us for worship, fellowship, and service. View our upcoming church events and gatherings.',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-12">
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
}