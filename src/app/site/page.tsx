"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";

type Category = {
  id: number;
  category: string;
  subcategory: string;
  image_url: string | null;
};

type Service = {
  id: number;
  service_name: string;
  category: string;
  subcategory: string;
  image_url: string | null;
  installation_price: number | null;
  dismantling_price: number | null;
  repair_price: number | null;
  created_at: string;
};


export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      id: 1,
      img: "/pi.jpg",
      title: "Explore Our Services",
      subtitle: "Professional, Reliable, and Hassle-Free Solutions",
      cta: { text: "Services", href: "/site/services" }, // Links to Services
    },
    {
      id: 2,
      img: "/pi2.jpg",
      title: "Learn About Us",
      subtitle: "Know More About Our Expertise and Values",
      cta: { text: "About Us", href: "/site/about" }, // Links to About Us
    },
    {
      id: 3,
      img: "/pic3.jpg",
      title: "Get in Touch",
      subtitle: "Contact Us for Any Queries or Bookings",
      cta: { text: "Contact Us", href: "/site/contact" }, // Links to Contact Us
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimer = useRef<number | null>(null);

  // Fetch services like ServicesPage
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("id", { ascending: false }); // latest first

      if (error) {
        console.error("Service fetch error:", error.message);
      } else {
        setServices(data || []);
      }

      setLoading(false);
    };

    fetchServices();
  }, []);


  useEffect(() => {
    slideTimer.current = window.setInterval(() => {
      setCurrentSlide((s) => (s + 1) % slides.length);
    }, 5000);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, []);

  const goToSlide = (i: number) => setCurrentSlide(i);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------------------------------------------------ */}
      {/* HERO — ENHANCED CAROUSEL WITH SUBTITLES AND BETTER STYLING */}
      {/* ------------------------------------------------ */}
      <section className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ${currentSlide === i ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image src={slide.img} alt="hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

            <div className="absolute z-20 left-8 md:left-20 top-1/2 -translate-y-1/2 max-w-lg">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-4">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 drop-shadow-lg mb-6">
                {slide.subtitle}
              </p>
              <Link
                href={slide.cta.href}
                className="inline-block px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                {slide.cta.text}
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-40">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-3 w-10 rounded-full transition-all ${currentSlide === i ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"
                }`}
            ></button>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* ------------------------------------------------ */}
      {/* WHY CHOOSE US — NEW SECTION FOR TRUST BUILDING */}
      {/* ------------------------------------------------ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Technicians</h3>
              <p className="text-gray-600">Certified professionals with years of experience in furniture installation and home services.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick & Reliable</h3>
              <p className="text-gray-600">Fast booking and on-time service delivery to minimize your wait and maximize convenience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">100% satisfaction guarantee with transparent pricing and excellent customer support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* LATEST SERVICES — REPLACES SHOP BY CATEGORY */}
      {/* ------------------------------------------------ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Latest Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 8).map((srv) => (
              <Link
                key={srv.id}
                href={`/site/service/${srv.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.03]"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  {srv.image_url ? (
                    <Image
                      src={srv.image_url}
                      alt={srv.service_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {srv.service_name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {srv.category} → {srv.subcategory}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/site/services"
              className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>


      {/* ------------------------------------------------ */}
      {/* PROMO BANNER — ENHANCED WITH CALL-TO-ACTION */}
      {/* ------------------------------------------------ */}
      <section className="py-12 bg-green-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/promo.jpg"
              alt="promo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center">
              <h3 className="text-2xl md:text-4xl font-bold mb-4">
                Limited Time Offer!
              </h3>
              <p className="text-lg md:text-xl mb-6">
                Up to 30% off on select services. Don't miss out!
              </p>
              <Link
                href="/site/services"
                className="px-8 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* MAIN SERVICE TYPES (3 Boxes) */}
      {/* ------------------------------------------------ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Installation */}
            <Link
              href="/site/services?type=Installation"
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
            >
              <div className="h-48 w-full relative">
                <Image
                  src="/install.jpg"
                  alt="Installation"
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800">Installation</h3>
              </div>
            </Link>

            {/* Dismantling */}
            <Link
              href="/site/services?type=Dismantling"
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
            >
              <div className="h-48 w-full relative">
                <Image
                  src="/install.jpg"
                  alt="Dismantling"
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800">Dismantling</h3>
              </div>
            </Link>

            {/* Repair */}
            <Link
              href="/site/services?type=Repair"
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white"
            >
              <div className="h-48 w-full relative">
                <Image
                  src="/install.jpg"
                  alt="Repair"
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800">Repair</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>



      {/* ------------------------------------------------ */}
      {/* PARTNERSHIP SECTION */}
      {/* ------------------------------------------------ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Our Partners
          </h2>
          <p className="text-gray-600 mb-12">
            We are proud to collaborate with industry-leading companies to deliver exceptional services.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
            {/* Partner 1 */}
            <div className="flex flex-col items-center gap-3">
              {/* Logo placeholder */}
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {/** Replace src with your uploaded logo */}
                <Image
                  src="/simplylogistics-logo.jpeg"
                  alt="Simply Logistics"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-gray-800">SimplyLogistics</span>
            </div>

            {/* You can duplicate this block for more partners */}
            {/* <div className="flex flex-col items-center gap-3">
        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <Image src="/partner2-logo.png" alt="Partner 2" width={128} height={128} className="object-contain"/>
        </div>
        <span className="font-semibold text-gray-800">Partner 2</span>
      </div> */}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* WHY CHOOSE US — CARD DESIGN */}
      {/* ------------------------------------------------ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Technicians</h3>
              <p className="text-gray-600">
                Background-verified and skilled experts for every job.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                No surprises, no hidden charges—what you see is what you pay.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Same-Day Service</h3>
              <p className="text-gray-600">
                Book and get service the same or next day without delays.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Tracking</h3>
              <p className="text-gray-600">
                Real-time job updates, photos, and invoices at your fingertips.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">
                We deliver quality—or we make it right.
              </p>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}