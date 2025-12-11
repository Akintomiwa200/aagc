import SermonsSection from '@/components/sections/SermonsSection';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata = {
  title: 'Sermons & Messages | AAGC',
  description: 'Access our library of biblical teaching and sermons. Grow in your faith journey with powerful messages.',
};

export default function SermonsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-12">
        <SermonsSection />
      </main>
      <Footer />
    </div>
  );
}