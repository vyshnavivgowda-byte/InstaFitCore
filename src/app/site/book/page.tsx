"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function BookService() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const submitBooking = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("bookings").insert([
      {
        customer_name: name,
        service_type: service,
        date,
        status: "Pending",
      },
    ]);

    setLoading(false);

    if (!error) {
      setSuccess("Your booking has been submitted successfully!");
      setName("");
      setService("");
      setDate("");
    } else {
      setSuccess("Failed to submit booking. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Book a Service</h1>

      {success && (
        <p className="p-3 mb-4 text-center rounded-lg bg-green-100 text-green-700">
          {success}
        </p>
      )}

      <form onSubmit={submitBooking} className="space-y-5">
        <div>
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-medium">Select Service</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Choose a service</option>
            <option value="Bed Installation">Bed Installation</option>
            <option value="Wardrobe Assembly">Wardrobe Assembly</option>
            <option value="Furniture Repair">Furniture Repair</option>
            <option value="Custom Work">Custom Work</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Preferred Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg"
        >
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
