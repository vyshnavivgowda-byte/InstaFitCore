"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Users, Rocket, Send, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast"; // Correct: import the hook

/* --- COLOR CONSTANTS --- */
const ACCENT_COLOR = "text-[#8ed26b]";
const BG_ACCENT = "bg-[#8ed26b]";
const HOVER_ACCENT = "hover:bg-[#76c55d]";
const LIGHT_BG = "bg-[#f2faee]";

export default function CareersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast(); // ✅ Get toast function from the hook

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      toast({
        title: "Resume missing",
        description: "Please upload your resume in PDF format.",
        variant: "destructive",
      });
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const fileName = `${Date.now()}_${resumeFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, resumeFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from("career_applications")
        .insert([{ name, email, message, resume_url: publicUrl }]);
      if (dbError) throw dbError;

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setResumeFile(null);
      const fileInput = document.getElementById("resume-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
        variant: "default",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const benefits = [
    { icon: Rocket, title: "Fast Growth", desc: "Be part of a rapidly growing home services platform." },
    { icon: Users, title: "Supportive Team", desc: "Work with skilled professionals who value collaboration." },
    { icon: Briefcase, title: "Meaningful Work", desc: "Deliver real impact to customers every day." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className={`relative h-72 md:h-96 ${BG_ACCENT} flex items-center justify-center shadow-lg`}>
        <div className="text-center px-4 animate-fadeIn">
          <p className="text-[#c7e5b5] uppercase tracking-widest text-sm mb-2">Join Our Team</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Careers at InstaFitCore
          </h1>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="py-16 md:py-24 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Why Work With Us</h2>
        <div className="grid gap-8 md:grid-cols-3 place-items-center px-4 lg:px-16">
          {benefits.map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full max-w-xs flex flex-col items-center text-center gap-4 transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <div className={`p-3 rounded-full ${LIGHT_BG} ${ACCENT_COLOR}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-800">{title}</h4>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 animate-fadeInUp">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Apply for a Position</h2>

          <form onSubmit={handleApply} className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-[#f2faee] focus:border-[#8ed26b] transition-all"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-[#f2faee] focus:border-[#8ed26b] transition-all"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-[#f2faee] focus:border-[#8ed26b] transition-all"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Upload Resume (PDF only)</label>
              <input
                type="file"
                id="resume-input"
                accept="application/pdf"
                required
                onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-4 focus:ring-[#f2faee] focus:border-[#8ed26b] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white font-semibold ${BG_ACCENT} ${HOVER_ACCENT} transition-transform hover:scale-105`}
            >
              {loading ? "Submitting..." : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 ${BG_ACCENT} text-center`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Know Someone Perfect for InstaFitCore?</h2>
        <p className="text-[#c7e5b5] mb-6 max-w-2xl mx-auto px-4">
          Refer them or reach out to us directly.
        </p>

        <Link
          href="mailto:careers@instafitcore.com"
          className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#8ed26b] font-bold rounded-full shadow-lg hover:bg-teal-50 transition-colors"
        >
          <Mail className="w-5 h-5" />
          careers@instafitcore.com
        </Link>
      </section>
    </div>
  );
}
