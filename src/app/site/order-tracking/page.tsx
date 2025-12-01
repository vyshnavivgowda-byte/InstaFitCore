"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Package, Clock, CheckCircle, MapPin, Wrench, Calendar, DollarSign, Home } from "lucide-react";

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
  address: string | null;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders initially
  const fetchOrders = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setLoading(false);
      return;
    }

    const user = data.user;

    const { data: bookings, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (!fetchError) setOrders(bookings || []);
    setLoading(false);
  };

  // Set up real-time subscription for updates
  useEffect(() => {
    const setup = async () => {
      await fetchOrders();

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;

      const user = data.user;

      // Subscribe to changes in the bookings table for the current user
      const subscription = supabase
        .channel("bookings-updates")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events: INSERT, UPDATE, DELETE
            schema: "public",
            table: "bookings",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Real-time update:", payload);

            if (payload.eventType === "INSERT") {
              setOrders((prev) => [payload.new as Booking, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === payload.new.id ? (payload.new as Booking) : order
                )
              );
            } else if (payload.eventType === "DELETE") {
              setOrders((prev) =>
                prev.filter((order) => order.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(subscription);
      };
    };

    setup();
  }, []);

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-200";

    switch (status) {
      case "Pending":
        return `${base} bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 border border-orange-600`;
      case "Confirmed":
        return `${base} bg-gradient-to-r from-indigo-400 to-indigo-500 text-indigo-900 border border-indigo-600`;
      case "Arriving Today":
        return `${base} bg-gradient-to-r from-pink-400 to-pink-500 text-pink-900 border border-pink-600`;
      case "Work Done":
        return `${base} bg-gradient-to-r from-teal-400 to-teal-500 text-teal-900 border border-teal-600`;
      default:
        return `${base} bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 border border-gray-600`;
    }
  };

  const getStepIndex = (status: string) => {
    const statuses = ["Pending", "Confirmed", "Arriving Today", "Work Done"];
    return statuses.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-8 text-center">My Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="ml-4 text-slate-600 text-lg">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-xl">No orders found. Start booking services!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 sm:mb-0">
                    Order #{order.id}
                  </h2>
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </div>

                {/* Service Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Package className="w-10 h-10 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-bold text-xl text-slate-900">
                      {order.service_name}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold">Types:</span> {order.service_types.join(", ")}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold">Price:</span> ₹{order.total_price}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold">Date:</span> {order.date} at {order.booking_time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold">Address:</span> {order.address || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Order Progress</h3>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${((getStepIndex(order.status) + 1) / 4) * 100}%` }}
                      ></div>
                    </div>
                    {/* Steps */}
                    <div className="flex items-center justify-between relative">
                      {[
                        { label: "Pending", icon: Clock },
                        { label: "Confirmed", icon: CheckCircle },
                        { label: "Arriving Today", icon: MapPin },
                        { label: "Work Done", icon: Wrench },
                      ].map((step, i) => {
                        const Icon = step.icon;
                        const active = getStepIndex(order.status) >= i;
                        const current = getStepIndex(order.status) === i;

                        return (
                          <div key={i} className="flex flex-col items-center w-full">
                            <div
                              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                                active
                                  ? "border-teal-500 bg-teal-50 text-teal-600 shadow-md"
                                  : "border-slate-300 bg-slate-100 text-slate-400"
                              } ${current ? "ring-2 ring-teal-200" : ""}`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <p
                              className={`text-xs mt-2 font-semibold transition-colors duration-300 ${
                                active ? "text-teal-600" : "text-slate-400"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}