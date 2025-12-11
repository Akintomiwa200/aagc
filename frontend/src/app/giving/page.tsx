import GivingSection from '@/components/sections/GivingSection';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata = {
  title: 'Give | AAGC',
  description: 'Support God\'s work through your generous giving. Your contribution helps transform lives and advance the Kingdom.',
};

export default function GivingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        <GivingSection />
      </main>
      <Footer />
    </div>
  );
}