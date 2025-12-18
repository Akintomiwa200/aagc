import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Star, CheckCircle } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { Button } from '../components/ui/Button';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = MOCK_EVENTS.find(e => e.id === id);
  const [isRegistered, setIsRegistered] = React.useState(event?.isRegistered || false);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Event not found</h2>
        <Button onClick={() => navigate('/events')}>Go Back</Button>
      </div>
    );
  }

  const handleRegister = () => {
    setIsRegistered(true);
    // Logic to save registration would go here
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 relative">
      {/* Hero Image */}
      <div className="relative h-72 w-full">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button onClick={() => navigate(-1)} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50">
            <ArrowLeft size={24} />
          </button>
          <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50">
            <Share2 size={24} />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block px-3 py-1 bg-primary-600 rounded-full text-xs font-bold mb-2 uppercase tracking-wide">
                {event.type}
            </span>
            <h1 className="text-3xl font-bold leading-tight mb-2">{event.title}</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4">
             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
             </div>

             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Clock size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Time</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{event.time}</p>
                </div>
             </div>

             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <MapPin size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Location</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{event.location}</p>
                </div>
             </div>
        </div>

        {/* Description */}
        <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About Event</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                {event.description}
            </p>
        </div>

        {/* Previous Highlights */}
        {(event.previousImages && event.previousImages.length > 0) && (
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Highlights from Last Edition</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {event.previousImages.map((img, idx) => (
                        <img 
                            key={idx} 
                            src={img} 
                            className="w-60 h-40 object-cover rounded-xl shadow-sm flex-shrink-0" 
                            alt={`Previous edition ${idx + 1}`} 
                        />
                    ))}
                </div>
            </div>
        )}

        {/* Testimonials */}
        {(event.testimonials && event.testimonials.length > 0) && (
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Testimonials</h3>
                <div className="space-y-4">
                    {event.testimonials.map(t => (
                        <div key={t.id} className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800/50">
                            <div className="flex items-center gap-2 mb-2">
                                {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-gray-700 dark:text-gray-200 text-sm italic mb-3">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.name}`} className="w-8 h-8 rounded-full bg-gray-300" alt={t.name} />
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* Footer Registration */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-20">
         {isRegistered ? (
             <Button fullWidth variant="secondary" disabled className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 font-bold h-12 text-lg">
                 <CheckCircle className="mr-2" /> You are Registered
             </Button>
         ) : (
             <Button fullWidth size="lg" onClick={handleRegister} className="shadow-lg shadow-primary-600/30 text-lg font-bold h-12">
                 Register Now
             </Button>
         )}
      </div>
    </div>
  );
};
