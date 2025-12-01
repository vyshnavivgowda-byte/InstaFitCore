"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Search } from "lucide-react";

type Booking = {
  id: number;
  user_id: string | null;
  customer_name: string;
  service_name: string;
  service_types: string[];
  date: string;
  booking_time: string;
  total_price: number;
  status: string;
  payment_status?: string;
  created_at: string;
  address: string | null;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Status");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All Service Types");

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setBookings(data || []);
      setFiltered(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔍 Apply Filters + Search
  useEffect(() => {
    let results = bookings;

    // Search
    if (search.trim() !== "") {
      results = results.filter((b) =>
        b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        b.service_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== "All Status") {
      results = results.filter((b) => b.status === statusFilter);
    }

    // Payment Filter
    if (paymentFilter !== "All Payment Status") {
      results = results.filter((b) => b.payment_status === paymentFilter);
    }

    // Service Type Filter
    if (serviceTypeFilter !== "All Service Types") {
      results = results.filter((b) => b.service_types.includes(serviceTypeFilter));
    }

    setFiltered(results);
  }, [search, statusFilter, paymentFilter, serviceTypeFilter, bookings]);

  // 🔄 Update Booking Status
  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Bookings</h1>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 border">

        {/* 🔍 Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-gray-50"
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Arriving Today">Arriving Today</option>
          <option value="Work Done">Work Done</option>
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-gray-50"
        >
          <option value="All Payment Status">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        {/* Service Type Filter */}
        <select
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-gray-50"
        >
          <option value="All Service Types">All Service Types</option>
          <option value="Installation">Installation</option>
          <option value="Dismantle">Dismantle</option>
          <option value="Repair">Repair</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-xl border">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Types</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Price</th>
              <th className="p-4">Address</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{b.customer_name}</td>
                  <td className="p-4">{b.service_name}</td>
                  <td className="p-4 text-gray-700">{b.service_types.join(", ")}</td>
                  <td className="p-4">{b.date}</td>
                  <td className="p-4">{b.booking_time}</td>
                  <td className="p-4 font-semibold">₹{b.total_price}</td>
                  <td className="p-4 max-w-xs">{b.address || "-"}</td>

                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Arriving Today">Arriving Today</option>
                      <option value="Work Done">Work Done</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
