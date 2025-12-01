"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-64 bg-green-600 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                Your message has been sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>

              <p className="text-gray-700 font-semibold mt-4">📞 Customer Support</p>
              <p className="text-gray-600 mb-3">customersupport@instafitcore.com</p>

              <p className="text-gray-700 font-semibold">⚖️ Grievance</p>
              <p className="text-gray-600 mb-3">grienvance@instafitcore.com</p>

              <p className="text-gray-700 font-semibold">🏢 Head Office</p>
              <p className="text-gray-600 mb-3">
                G7 Kemps Green View,<br />
                Ayyappanagar, KR Puram,<br />
                Bangalore
              </p>
            </div>

            {/* Map */}
            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.978715232021!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f1b8f6a3%3A0x4e6e948e0aaee77a!2sBangalore!5e0!3m2!1sen!2sin!4v1699439332923!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-green-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Our Services?
          </h2>
          <p className="text-white mb-6">Book furniture installation or assembly with our experts today!</p>

          <Link
            href="/site/services"
            className="inline-block px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            Book a Service
          </Link>
        </div>
      </section>
    </div>
  );
}
