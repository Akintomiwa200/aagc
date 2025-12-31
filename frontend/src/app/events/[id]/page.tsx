'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { Calendar, MapPin, Clock, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";

export default function EventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const data = await apiService.getEvent(id as string);
                setEvent(data);
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500 text-lg">Event not found.</p>
                <Link href="/events" className="text-green-600 hover:text-green-700 font-medium">
                    Back to Events
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </button>

                    {/* Image */}
                    <div className="w-full h-64 lg:h-96 rounded-3xl overflow-hidden shadow-xl mb-10 relative">
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                            {event.category || "Event"}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>

                        <div className="grid md:grid-cols-2 gap-6 mb-8 text-gray-600">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <span className="text-lg">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-green-600" />
                                <span className="text-lg">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 md:col-span-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <span className="text-lg">{event.location}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600 leading-relaxed mb-10">
                            <p className="text-lg whitespace-pre-wrap">{event.description || event.detail}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 border-t pt-8">
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-green-500/25">
                                Register / RSVP Now
                            </button>
                            <button className="flex-1 bg-white border border-gray-200 hover:border-green-600 text-gray-900 hover:text-green-600 px-8 py-4 rounded-xl font-bold transition">
                                Add to Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
