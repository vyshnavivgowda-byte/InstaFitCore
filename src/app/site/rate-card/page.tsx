"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function RateCard() {
  const [rates, setRates] = useState([]);

  const fetchRates = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true });

    if (!error) setRates(data || []);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Rate Card</h1>

      {rates.length === 0 ? (
        <p className="text-gray-500">No services found.</p>
      ) : (
        <div className="space-y-4">
          {rates.map((service: any) => (
            <div
              key={service.id}
              className="p-4 bg-white shadow-sm border rounded-lg flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <p className="text-lg font-semibold">{service.type}</p>
                <p className="text-sm text-gray-500">{service.category}</p>
              </div>

              <p className="text-xl font-bold text-blue-600">₹{service.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
