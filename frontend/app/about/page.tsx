'use client';

import { useState } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Target, Heart, MapPin, Phone, Mail, X, Linkedin, Instagram, Twitter, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Pastor {
  id: number;
  name: string;
  role: string;
  branch: string;
  bio: string;
  fullBio: string;
  image: string;
  email: string;
  phone: string;
  social: {
    ig: string;
    tw: string;
    li: string;
  };
}

interface Branch {
  id: number;
  name: string;
  location: string;
  pastor: string;
  image: string;
  address: string;
  serviceTimes: string;
}

const pastors: Pastor[] = [
  {
    id: 1,
    name: "Rev. Dr. Samuel Adeniyi",
    role: "General Overseer",
    branch: "Headquarters",
    bio: "A visionary leader with over 30 years of apostolic ministry, passionate about global revival.",
    fullBio: "Rev. Dr. Samuel Adeniyi is a seasoned apostolic leader with over three decades of ministry experience. Called to raise a generation on fire for Christ, he has pioneered churches across Nigeria and beyond. His teaching emphasizes the power of the Holy Spirit, biblical discipleship, and practical Christianity. Under his leadership, AAGC has grown into a global movement impacting nations through worship, the Word, and compassionate service.",
    image: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=800&q=80",
    email: "samuel@aagc.com",
    phone: "+234 803 123 4567",
    social: { ig: "#", tw: "#", li: "#" }
  },
  {
    id: 2,
    name: "Pastor Grace Adeniyi",
    role: "Co-Pastor",
    branch: "Headquarters",
    bio: "A woman of prayer and excellence, dedicated to empowering families and mentoring leaders.",
    fullBio: "Pastor Grace Adeniyi is a dynamic teacher and mentor with a heart for families and the next generation. She leads the women's ministry, marriage enrichment programs, and leadership development initiatives at AAGC. Her passion for seeing women fulfill their divine purpose has transformed countless lives. She also oversees the church's humanitarian outreaches and community development projects.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    email: "grace@aagc.com",
    phone: "+234 803 123 4568",
    social: { ig: "#", tw: "#", li: "#" }
  },
  {
    id: 3,
    name: "Pastor John Smith",
    role: "Youth Pastor",
    branch: "Headquarters",
    bio: "Leading with fire and innovation, John is committed to seeing young people walk in divine identity.",
    fullBio: "Pastor John Smith brings fresh energy and innovation to youth ministry at AAGC. With a background in music and creative arts, he has revolutionized how young people engage with the gospel. His ministry focuses on identity in Christ, purpose discovery, and equipping youth to be world-changers. Under his leadership, the youth ministry has grown to become a model for churches across the region.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    email: "john@aagc.com",
    phone: "+234 803 123 4569",
    social: { ig: "#", tw: "#", li: "#" }
  },
  {
    id: 4,
    name: "Pastor Emmanuel Okafor",
    role: "Branch Pastor",
    branch: "Lagos Branch",
    bio: "Passionate about church planting and discipleship in urban communities.",
    fullBio: "Pastor Emmanuel Okafor leads the vibrant Lagos branch of AAGC with a heart for urban missions. His ministry focuses on reaching the unreached in metropolitan areas through innovative outreach strategies, community development, and practical discipleship. Under his leadership, the Lagos branch has become a beacon of hope, planting several daughter churches and impacting thousands of lives.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    email: "emmanuel@aagc.com",
    phone: "+234 803 123 4570",
    social: { ig: "#", tw: "#", li: "#" }
  },
  {
    id: 5,
    name: "Pastor Sarah Johnson",
    role: "Branch Pastor",
    branch: "Abuja Branch",
    bio: "Called to intercession and building strong prayer foundations in the capital.",
    fullBio: "Pastor Sarah Johnson oversees the Abuja branch with a strong emphasis on prayer and intercession. Her journey in ministry began with a powerful encounter with God that led her to establish prayer mountains and 24/7 prayer watches. She is also passionate about leadership development and has trained hundreds of prayer coordinators and ministry leaders who now serve across various AAGC branches.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    email: "sarah@aagc.com",
    phone: "+234 803 123 4571",
    social: { ig: "#", tw: "#", li: "#" }
  }
];

const branches: Branch[] = [
  {
    id: 1,
    name: "AAGC Headquarters",
    location: "Bukuru, Plateau State",
    pastor: "Rev. Dr. Samuel Adeniyi",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
    address: "QVQ4+7V9, Bukuru 930101, Plateau, Nigeria",
    serviceTimes: "Sunday: 9:00 AM - 12:00 PM | Wednesday: 5:30 PM - 7:00 PM"
  },
  {
    id: 2,
    name: "AAGC Lagos",
    location: "Lagos State",
    pastor: "Pastor Emmanuel Okafor",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
    address: "123 Victoria Island, Lagos, Nigeria",
    serviceTimes: "Sunday: 10:00 AM - 1:00 PM | Wednesday: 6:00 PM - 7:30 PM"
  },
  {
    id: 3,
    name: "AAGC Abuja",
    location: "Federal Capital Territory",
    pastor: "Pastor Sarah Johnson",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    address: "45 Garki District, Abuja, Nigeria",
    serviceTimes: "Sunday: 9:30 AM - 12:30 PM | Friday: 6:00 PM - 8:00 PM"
  }
];

export default function AboutPage() {
  const [selectedPastor, setSelectedPastor] = useState<Pastor | null>(null);

  return (
    <div className="min-h-screen bg-[#f7f7f4]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-[120px] pb-[80px] px-6 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#f54e00] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#9fbbe0] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#f54e00]/10 px-4 py-2 rounded-full border border-[#f54e00]/20 mb-8">
              <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
              <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#5a5852', letterSpacing: '0.88px' }}>
                Who We Are
              </span>
            </div>

            <h1
              className="text-[72px] font-normal text-[#26251e] mb-8"
              style={{ letterSpacing: '-2.16px', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Raising a Generation<br />
              <span className="text-[#f54e00]">On Fire</span> For Christ
            </h1>

            <p className="text-lg text-[#5a5852] max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Apostolic Army Global Church is more than a denomination; it's a movement of Spirit-filled believers committed to establishing God's Kingdom on earth through worship, discipleship, and compassionate service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-[80px] px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-[36px] font-normal text-[#26251e] mb-4"
              style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Our Vision & Mission
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#f7f7f4] p-8 rounded-[12px] border border-[#e6e5e0] hover:border-[#cfcdc4] transition"
            >
              <div className="w-12 h-12 bg-[#f54e00]/10 rounded-[8px] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#f54e00]" />
              </div>
              <h3 className="text-lg font-semibold text-[#26251e] mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Our Vision
              </h3>
              <p className="text-[#5a5852] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                To see a global awakening where hearts are set ablaze for Christ, nations are discipled, and the power of the Holy Spirit is demonstrated in every sphere of life.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#f7f7f4] p-8 rounded-[12px] border border-[#e6e5e0] hover:border-[#cfcdc4] transition"
            >
              <div className="w-12 h-12 bg-[#9fc9a2]/30 rounded-[8px] flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-[#26251e]" />
              </div>
              <h3 className="text-lg font-semibold text-[#26251e] mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Our Mission
              </h3>
              <p className="text-[#5a5852] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                To equip believers through the undiluted Word of God, fervent prayer, and discipleship, empowering them to walk in their divine purpose and impact their world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-[80px] px-6 lg:px-16 bg-[#f7f7f4]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#f54e00]/10 px-4 py-2 rounded-full border border-[#f54e00]/20 mb-6">
              <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
              <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#5a5852', letterSpacing: '0.88px' }}>
                Our Leadership
              </span>
            </div>
            <h2
              className="text-[36px] font-normal text-[#26251e] mb-4"
              style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Dedicated to Your Spiritual Growth
            </h2>
            <p className="text-lg text-[#5a5852] max-w-2xl mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Meet the passionate leaders guiding our church family with wisdom, prayer, and the Word.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor, index) => (
              <motion.div
                key={pastor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedPastor(pastor)}
                className="group bg-white rounded-[12px] overflow-hidden border border-[#e6e5e0] hover:border-[#cfcdc4] hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={pastor.image}
                    alt={pastor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26251e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <a
                      href={pastor.social.ig}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#f54e00] transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={pastor.social.tw}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#f54e00] transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={pastor.social.li}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#f54e00] transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[#f54e00] font-medium text-sm tracking-wide uppercase" style={{ letterSpacing: '0.88px' }}>
                    {pastor.role}
                  </span>
                  <h3 className="text-lg font-semibold text-[#26251e] mt-2 mb-1" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {pastor.name}
                  </h3>
                  <p className="text-sm text-[#5a5852] mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {pastor.branch}
                  </p>
                  <p className="text-sm text-[#5a5852] leading-relaxed line-clamp-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {pastor.bio}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-[#f54e00] text-sm font-medium">
                    <span>View Profile</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-[80px] px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#f54e00]/10 px-4 py-2 rounded-full border border-[#f54e00]/20 mb-6">
              <div className="w-2 h-2 bg-[#f54e00] rounded-full"></div>
              <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#5a5852', letterSpacing: '0.88px' }}>
                Our Branches
              </span>
            </div>
            <h2
              className="text-[36px] font-normal text-[#26251e] mb-4"
              style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Worship Centers Worldwide
            </h2>
            <p className="text-lg text-[#5a5852] max-w-2xl mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Find an AAGC branch near you and join our growing family of faith.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-[#f7f7f4] rounded-[12px] overflow-hidden border border-[#e6e5e0] hover:border-[#cfcdc4] hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26251e]/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#26251e] mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {branch.name}
                  </h3>
                  <div className="space-y-2 text-sm text-[#5a5852]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#f54e00]" />
                      {branch.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#f54e00]" />
                      Pastor: {branch.pastor}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#e6e5e0]">
                    <p className="text-xs text-[#5a5852] leading-relaxed">{branch.serviceTimes}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-[80px] px-6 lg:px-16 bg-[#f7f7f4]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-[36px] font-normal text-[#26251e] mb-12"
              style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Word Centered", desc: "Rooted in biblical truth and sound doctrine" },
                { title: "Spirit Led", desc: "Sensitive to the Holy Spirit's leading" },
                { title: "Prayer Focused", desc: "Fervent prayer that moves mountains" },
                { title: "Excellence", desc: "Pursuing excellence in all we do" },
                { title: "Love & Unity", desc: "One family bound by God's love" },
                { title: "Global Impact", desc: "Reaching the nations with the Gospel" }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-[12px] border border-[#e6e5e0] hover:border-[#f54e00] hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-[#26251e] mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#5a5852] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-[80px] px-6 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#26251e] rounded-[12px] p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-[#f54e00] rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2
                className="text-[36px] font-normal text-white mb-6"
                style={{ letterSpacing: '-0.72px', fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Become Part of the Family
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Whether you are new to the faith or looking for a home, there is a place for you here.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#f54e00] hover:bg-[#d04200] text-white px-[18px] py-[10px] rounded-[8px] font-medium transition"
                style={{ fontSize: '14px', lineHeight: '1.0' }}
              >
                Connect With Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pastor Modal */}
      <AnimatePresence>
        {selectedPastor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPastor(null)}
            className="fixed inset-0 bg-[#26251e]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[12px] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <div className="h-64 overflow-hidden rounded-t-[12px]">
                  <img
                    src={selectedPastor.image}
                    alt={selectedPastor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26251e]/80 to-transparent"></div>
                </div>
                <button
                  onClick={() => setSelectedPastor(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="inline-flex items-center gap-2 bg-[#f54e00] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {selectedPastor.role}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-semibold text-[#26251e] mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  {selectedPastor.name}
                </h2>
                <p className="text-[#f54e00] font-medium mb-6">{selectedPastor.branch}</p>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-[#26251e]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    About
                  </h3>
                  <p className="text-[#5a5852] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {selectedPastor.fullBio}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-[#26251e]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    Contact
                  </h3>
                  <div className="space-y-3">
                    <a href={`mailto:${selectedPastor.email}`} className="flex items-center gap-3 text-[#5a5852] hover:text-[#f54e00] transition">
                      <div className="w-10 h-10 bg-[#f54e00]/10 rounded-[8px] flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#f54e00]" />
                      </div>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{selectedPastor.email}</span>
                    </a>
                    <a href={`tel:${selectedPastor.phone}`} className="flex items-center gap-3 text-[#5a5852] hover:text-[#f54e00] transition">
                      <div className="w-10 h-10 bg-[#f54e00]/10 rounded-[8px] flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#f54e00]" />
                      </div>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{selectedPastor.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#e6e5e0]">
                  <a
                    href={selectedPastor.social.ig}
                    className="w-12 h-12 bg-[#f54e00]/10 rounded-[8px] flex items-center justify-center text-[#f54e00] hover:bg-[#f54e00] hover:text-white transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={selectedPastor.social.tw}
                    className="w-12 h-12 bg-[#f54e00]/10 rounded-[8px] flex items-center justify-center text-[#f54e00] hover:bg-[#f54e00] hover:text-white transition"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={selectedPastor.social.li}
                    className="w-12 h-12 bg-[#f54e00]/10 rounded-[8px] flex items-center justify-center text-[#f54e00] hover:bg-[#f54e00] hover:text-white transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
