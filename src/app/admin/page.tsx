"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  Layers,
  List,
  Wrench,
  BookOpenCheck,
  Star,
  RefreshCw,
} from "lucide-react";

// -----------------------
// TYPES
// -----------------------
type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
};

type Booking = {
  id: number;
  customer_name: string;
  service_name: string;
  date: string;
  status: string;
  total_price: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubcategories: 0,
    totalServices: 0,
    totalBookings: 0,
    totalReviews: 0,
  });

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [
        { count: catCount },
        { count: subCount },
        { count: servCount },
        { count: bookCount },
        { count: revCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("subcategories").select("*", { count: "exact" }),
        supabase.from("services").select("*", { count: "exact" }),
        supabase.from("bookings").select("*", { count: "exact" }),
        supabase.from("service_reviews").select("*", { count: "exact" }),
        supabase.from("bookings").select("*").order("id", { ascending: false }).limit(5),
      ]);

      setStats({
        totalCategories: catCount || 0,
        totalSubcategories: subCount || 0,
        totalServices: servCount || 0,
        totalBookings: bookCount || 0,
        totalReviews: revCount || 0,
      });
      setRecentBookings((recent as Booking[]) || []);
    } catch (err: any) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-8 space-y-10">
      {/* HEADER */}
      <div className="bg-white shadow-sm p-8 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Platform overview and recent activity</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-instafitcore-green text-white hover:bg-instafitcore-green-hover font-medium transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </div>

      {/* STAT CARDS - Using Unified Brand Color */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard title="Categories" value={stats.totalCategories} icon={<Layers size={24} />} />
        <StatCard title="Subcategories" value={stats.totalSubcategories} icon={<List size={24} />} />
        <StatCard title="Services" value={stats.totalServices} icon={<Wrench size={24} />} />
        <StatCard title="Bookings" value={stats.totalBookings} icon={<BookOpenCheck size={24} />} />
        <StatCard title="Reviews" value={stats.totalReviews} icon={<Star size={24} />} />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left font-semibold">Customer</th>
                <th className="p-4 text-left font-semibold">Service</th>
                <th className="p-4 text-left font-semibold">Date</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{b.customer_name}</td>
                  <td className="p-4 text-gray-600">{b.service_name}</td>
                  <td className="p-4 text-gray-500">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#8ED26B15] text-instafitcore-green-hover border border-[#8ED26B30]">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">₹{b.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -----------------------
// REUSABLE STAT CARD
// -----------------------
function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-instafitcore-green text-white shadow-md shadow-instafitcore-green/20">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}