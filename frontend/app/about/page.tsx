'use client';

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Users, Target, Heart, ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

            {/* Leadership Section */}
            <section className="py-24 px-6 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-green-600 font-bold tracking-widest uppercase mb-4 block"
                        >
                            Our Leadership
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900"
                        >
                            Dedicated to Your Spiritual Growth
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            {
                                name: "Rev. Dr. Samuel Adeniyi",
                                role: "General Overseer",
                                bio: "A visionary leader with over 30 years of apostolic ministry, passionate about global revival and kingdom established.",
                                image: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=800&q=80",
                                social: { ig: "#", tw: "#", li: "#" }
                            },
                            {
                                name: "Pastor Grace Adeniyi",
                                role: "Co-Pastor",
                                bio: "A woman of prayer and excellence, dedicated to empowering families and mentoring the next generation of leaders.",
                                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
                                social: { ig: "#", tw: "#", li: "#" }
                            },
                            {
                                name: "Pastor John Smith",
                                role: "Youth Pastor",
                                bio: "Leading with fire and innovation, John is committed to seeing young people walk in their divine identity.",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
                                social: { ig: "#", tw: "#", li: "#" }
                            }
                        ].map((pastor, index) => (
                            <motion.div
                                key={pastor.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
                            >
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={pastor.image}
                                        alt={pastor.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <div className="flex gap-4">
                                            <Link href={pastor.social.ig} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-green-500 transition-colors">
                                                <Instagram size={18} />
                                            </Link>
                                            <Link href={pastor.social.tw} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-green-500 transition-colors">
                                                <Twitter size={18} />
                                            </Link>
                                            <Link href={pastor.social.li} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-green-500 transition-colors">
                                                <Linkedin size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <span className="text-green-600 font-bold text-sm tracking-widest uppercase mb-2 block">{pastor.role}</span>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{pastor.name}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {pastor.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
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
