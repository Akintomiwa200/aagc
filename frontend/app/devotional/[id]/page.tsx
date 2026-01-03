'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { Calendar, User, Share2, ArrowLeft, Loader2, BookOpen } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";

export default function DevotionalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [devotional, setDevotional] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevotional = async () => {
            // Handle "today" or specific ID
            if (!id) return;
            try {
                let data;
                if (id === 'today') {
                    data = await apiService.getTodayDevotional();
                } else {
                    // Assuming we have getDevotional(id), closely related to getDevotionals list
                    // If API doesn't support getDevotional(id), we might need to fetch all and find (less ideal)
                    // For now assuming the endpoint exists or we use the list one if specific one fails?
                    // Let's assume the API structure supports it or we try to hit the endpoint.
                    // The Implementation Plan mentions getDevotionals and getTodayDevotional.
                    // I will assume for now getDevotional(id) is implied or I should fallback to fetching list if needed.
                    // Actually, let's keep it simple: if API fails, handle error.
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/devotionals/${id}`);
                    if (response.ok) {
                        data = await response.json();
                    }
                }
                setDevotional(data);
            } catch (error) {
                console.error("Failed to fetch devotional", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDevotional();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!devotional) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500 text-lg">Devotional not found.</p>
                <Link href="/devotional" className="text-green-600 hover:text-green-700 font-medium">
                    View All Devotionals
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50/50">
            <Navbar />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <Link href="/devotional" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 transition">
                        <ArrowLeft className="w-4 h-4" />
                        All Devotionals
                    </Link>

                    <article className="bg-white rounded-3xl p-8 lg:p-16 shadow-xl border border-amber-100">
                        {/* Header */}
                        <div className="mb-10 text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 text-amber-800 text-sm font-medium">
                                <BookOpen className="w-4 h-4" />
                                <span>Daily Devotional</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                                {devotional.title}
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{devotional.date}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{devotional.author || "AAGC Ministry"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Scripture */}
                        <div className="bg-green-50/50 border-l-4 border-green-500 p-6 my-10 rounded-r-xl">
                            <p className="text-xl lg:text-2xl font-serif italic text-gray-800 leading-relaxed mb-4">
                                "{devotional.scriptureContent || "Scripture text..."}"
                            </p>
                            <p className="font-bold text-green-700 text-right">
                                — {devotional.scriptureReference}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 font-serif">
                            {/* Assuming content is HTML or paragraphs */}
                            <div dangerouslySetInnerHTML={{ __html: devotional.content }}></div>
                        </div>

                        {/* Prayer */}
                        <div className="mt-12 pt-10 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-green-500"></span>
                                Prayer
                            </h3>
                            <p className="text-lg text-gray-700 italic">
                                {devotional.prayer}
                            </p>
                        </div>

                        {/* Action */}
                        <div className="mt-10 flex justify-end">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition">
                                <Share2 className="w-4 h-4" />
                                Share this devotional
                            </button>
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
