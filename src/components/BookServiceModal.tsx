"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

type ServiceItem = {
  service_name: string;
  installation_price: number | null;
  dismantling_price: number | null;
  repair_price: number | null;
};

type Props = {
  service: ServiceItem;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
};

const SERVICE_TYPES = [
  { key: "Installation", label: "Installation", priceKey: "installation_price" as keyof ServiceItem },
  { key: "Dismantle", label: "Dismantle", priceKey: "dismantling_price" as keyof ServiceItem },
  { key: "Repair", label: "Repair", priceKey: "repair_price" as keyof ServiceItem },
];

export default function BookServiceModal({ service, isOpen, onClose, isLoading = false }: Props) {
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ date?: string; time?: string; serviceTypes?: string; address?: string }>({});

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      setServiceTypes([]);
      setDate("");
      setTime("");
      setAddress("");
      setErrors({});
    }
  }, [isOpen]);

  const totalPrice = serviceTypes.reduce((sum, type) => {
    const option = SERVICE_TYPES.find(opt => opt.key === type);
    const price = option ? (service[option.priceKey] || 0) : 0;
    return sum + price;
  }, 0);

  const toggleService = (type: string) => {
    setServiceTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setErrors(prev => ({ ...prev, serviceTypes: undefined }));
  };

  const toggleAllServices = () => {
    const availableTypes = SERVICE_TYPES.filter(opt => service[opt.priceKey] && service[opt.priceKey]! > 0).map(opt => opt.key);
    setServiceTypes(prev => prev.length === availableTypes.length ? [] : availableTypes);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    if (!date) newErrors.date = "Please select a date.";
    else if (selectedDateTime < now) newErrors.date = "Please select a future date and time.";

    if (!time) newErrors.time = "Please select a time.";
    else if (selectedDateTime < now) newErrors.time = "Please select a future time.";

    if (serviceTypes.length === 0) newErrors.serviceTypes = "Please select at least one service.";
    if (!address) newErrors.address = "Please enter your address.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      alert("User not logged in.");
      return;
    }

    const { error } = await supabase.from("bookings").insert([
      {
        user_id: userData.user.id,
        customer_name: userData.user.email,
        service_name: service.service_name,
        service_types: serviceTypes,
        date,
        booking_time: time,
        total_price: totalPrice,
        address,
        status: "Pending",
      },
    ]);

    if (error) {
      console.error("Booking error:", error);
      alert("Failed to book service. Please try again.");
    } else {
      alert("Booking confirmed!");
      onClose();
    }
  };

  if (!isOpen) return null;

  const availableServices = SERVICE_TYPES.filter(opt => service[opt.priceKey] && service[opt.priceKey]! > 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6">Book {service.service_name}</h2>

        {/* Service Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-semibold text-gray-700">Select Services</label>
            {availableServices.length > 1 && (
              <button onClick={toggleAllServices} className="text-sm text-blue-600 hover:text-blue-800 underline">
                {serviceTypes.length === availableServices.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {availableServices.map(opt => (
              <label key={opt.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={serviceTypes.includes(opt.key)}
                    onChange={() => toggleService(opt.key)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-800 font-medium">{opt.label}</span>
                </div>
                <span className="text-green-600 font-semibold">₹{service[opt.priceKey]}</span>
              </label>
            ))}
          </div>
          {errors.serviceTypes && <p className="text-red-500 mt-1">{errors.serviceTypes}</p>}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={minDate}
              className="w-full border rounded px-4 py-3"
            />
            {errors.date && <p className="text-red-500 mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block mb-2 font-medium">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full border rounded px-4 py-3"
            />
            {errors.time && <p className="text-red-500 mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Address</label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your address"
            className="w-full border rounded px-4 py-3"
            rows={3}
          />
          {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Total Price */}
        {totalPrice > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold text-gray-800">
              Total Price: <span className="text-green-600">₹{totalPrice}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
