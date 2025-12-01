"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Users, Clock, Shield, Star, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero / Banner */}
      <section className="relative h-80 bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mt-4 font-light">
            Discover the heart of InstaFitCore Solutions
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white/10 transform skew-y-3"></div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* About Us */}
          <div className="mb-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Who We Are</h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              At <span className="font-semibold text-green-600">InstaFitCore Solutions Pvt Ltd.</span>, we revolutionize furniture installation and assembly for homes and offices.
              Our certified professionals deliver precise, reliable service for all furniture types — from sleek wardrobes to dynamic office setups.
              Leveraging cutting-edge technology for seamless scheduling, we ensure every project is executed with excellence, on time, and with unmatched care.
              Trust InstaFitCore to transform your space effortlessly.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                To simplify furniture setup through trust, technology, and transparency.
                We empower customers with peace of mind, delivering:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Professional & Punctual Service</h3>
                  <p className="text-gray-600">Every time, without fail.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Fair & Transparent Pricing</h3>
                  <p className="text-gray-600">No hidden fees, just honesty.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Real-Time Updates & Digital Invoices</h3>
                  <p className="text-gray-600">Stay informed every step of the way.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Empowering Skilled Technicians</h3>
                  <p className="text-gray-600">Building better livelihoods through opportunity.</p>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-8 italic">
              We're not just assembling furniture — we're crafting comfort and reliability.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Why Choose Us</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Certified Technicians</h3>
                <p className="text-gray-600">Background-verified experts ensuring top-tier, professional service.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Transparent Pricing</h3>
                <p className="text-gray-600">Clear, upfront costs with no surprises or hidden charges.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Same-Day Service</h3>
                <p className="text-gray-600">Urgent needs met with fast, reliable same or next-day scheduling.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Tracking</h3>
                <p className="text-gray-600">Real-time updates, photos, and digital invoices at your fingertips.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                  <Star className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Satisfaction Guaranteed</h3>
                <p className="text-gray-600">Quality assured — we deliver excellence or make it right.</p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Vision</h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              To become India’s most trusted on-demand platform for furniture assembly, installation, and service.
              We connect customers, retailers, and professionals through innovative technology and unwavering transparency.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/site/services"
              className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Our Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}