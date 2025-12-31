'use client';

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Users, Target, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1510936111840-65e151ad71bb?w=1920&q=80')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-green-400 font-bold tracking-wider uppercase mb-4 block">Who We Are</span>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-8">Raising a Generation<br />on Fire for God</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Apostolic Army Global Church is more than a denomination; it's a movement of spirit-filled believers committed to establishing God's kingdom on earth.
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To see a global awakening where hearts are set ablaze for Christ, nations are discipled, and the power of the Holy Spirit is demonstrated in every sphere of life.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Heart className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To equip believers through the undiluted Word of God, fervent prayer, and discipleship, empowering them to walk in their divine purpose and impact their world.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
                            alt="Community Worship"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-16">Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            "Word Centered",
                            "Spirit Led",
                            "Prayer Focused",
                            "Excellence",
                            "Love & Unity",
                            "Global Impact"
                        ].map((value) => (
                            <div key={value} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <h3 className="text-xl font-bold text-gray-900">{value}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Us */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto bg-green-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">Become Part of the Family</h2>
                        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                            Whether you are new to the faith or looking for a home, there is a place for you here.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition">
                            Connect With Us
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
