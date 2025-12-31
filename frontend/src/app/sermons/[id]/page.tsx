'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { Calendar, User, Clock, ArrowLeft, Loader2, Play, Download, Share2 } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function SermonDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [sermon, setSermon] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSermon = async () => {
            if (!id) return;
            try {
                const data = await apiService.getSermon(id as string);
                setSermon(data);
            } catch (error) {
                console.error("Failed to fetch sermon", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSermon();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!sermon) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500 text-lg">Sermon not found.</p>
                <button onClick={() => router.push('/sermons')} className="text-green-600 hover:text-green-700 font-medium">
                    Back to Sermons
                </button>
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
                        Back to Library
                    </button>

                    {/* Video Player Placeholder */}
                    <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl mb-10 relative group">
                        {sermon.videoUrl ? (
                            <iframe
                                src={sermon.videoUrl}
                                className="w-full h-full"
                                title={sermon.title}
                                allowFullScreen
                            />
                        ) : (
                            <>
                                <img
                                    src={sermon.image || "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80"}
                                    alt={sermon.title}
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-full cursor-pointer hover:scale-110 transition">
                                        <Play className="w-12 h-12 text-white fill-white" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm">
                        <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{sermon.title}</h1>
                                <p className="text-xl text-green-600 font-medium">{sermon.series}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-600">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-600">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 mb-8 text-gray-600 text-sm border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="font-medium">{sermon.preacher}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <span>{sermon.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span>{sermon.duration}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600 leading-relaxed mb-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About the Message</h3>
                            <p className="text-lg whitespace-pre-wrap">{sermon.description}</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
