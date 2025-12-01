"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Layers, List, Wrench, BookOpenCheck } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubcategories: 0,
    totalServices: 0,
    totalBookings: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all counts in parallel
      const [
        { count: categoryCount },
        { count: subcategoryCount },
        { count: serviceCount },
        { count: bookingCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("subcategories").select("*", { count: "exact" }),
        supabase.from("services").select("*", { count: "exact" }),
        supabase.from("bookings").select("*", { count: "exact" }),
        supabase
          .from("bookings")
          .select("*")
          .order("id", { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalCategories: categoryCount || 0,
        totalSubcategories: subcategoryCount || 0,
        totalServices: serviceCount || 0,
        totalBookings: bookingCount || 0,
      });

      setRecentBookings(recent || []);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cardClass =
    "p-7 bg-white shadow-lg rounded-3xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all";

  const iconWrapClass =
    "w-16 h-16 flex items-center justify-center rounded-2xl text-white text-2xl shadow-md";

  return (
    <div className="space-y-10 p-6">
      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-2 tracking-tight text-gray-900">
        Dashboard
      </h1>
      <p className="text-gray-500 text-lg">Welcome back! Here's your platform overview.</p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
        <div className={cardClass}>
          <div className="flex items-center gap-5">
            <div className={`${iconWrapClass} bg-gradient-to-br from-blue-400 to-blue-600`}>
              <Layers size={30} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Categories</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-5">
            <div className={`${iconWrapClass} bg-gradient-to-br from-purple-400 to-purple-600`}>
              <List size={30} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Subcategories</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalSubcategories}</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-5">
            <div className={`${iconWrapClass} bg-gradient-to-br from-orange-400 to-orange-600`}>
              <Wrench size={30} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Services</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-5">
            <div className={`${iconWrapClass} bg-gradient-to-br from-green-400 to-green-600`}>
              <BookOpenCheck size={30} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100 mt-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Recent Bookings</h2>

        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-4 text-sm font-semibold">Customer</th>
                <th className="p-4 text-sm font-semibold">Service</th>
                <th className="p-4 text-sm font-semibold">Date</th>
                <th className="p-4 text-sm font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 bg-white">
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 font-medium">
                    No recent bookings found.
                  </td>
                </tr>
              )}

              {recentBookings.map((b: any) => (
                <tr key={b.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-2">
                    <img
                      src={b.customer_image || "/default-user.png"}
                      alt={b.customer_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {b.customer_name}
                  </td>
                  <td className="p-4">{b.service_type}</td>
                  <td className="p-4">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        b.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
