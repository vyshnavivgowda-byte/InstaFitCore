"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import { FaBed, FaArchive, FaTv, FaThLarge, FaUtensils } from "react-icons/fa";

type AddressField = [string, string, boolean];

export default function CustomizedModularFurniturePage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState<any>({
    full_name: "",
    mobile_number: "",
    email: "",
    flat_no: "",
    floor: "",
    building_name: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    furniture_requirement_details: "",
    material_finish_preference: "",
    measurements_available: false,
    expected_timeline: "",
    approximate_budget_range: "",
    additional_notes: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("customized_modular_furniture_requests")
      .insert([form]);

    setLoading(false);

    if (error) {
      toast({
        title: "❌ Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
      console.error(error);
    } else {
      toast({
        title: "Success submitted",
        description: "Request submitted successfully",
        variant: "success",
      });
      setForm({
        full_name: "",
        mobile_number: "",
        email: "",
        flat_no: "",
        floor: "",
        building_name: "",
        street: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        furniture_requirement_details: "",
        material_finish_preference: "",
        measurements_available: false,
        expected_timeline: "",
        approximate_budget_range: "",
        additional_notes: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Customized <span className="text-[#8ed26b]">Modular</span> Furniture
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Design your perfect space with our customized modular furniture solutions.
            Submit your requirements and our team will contact you shortly.
          </p>
        </div>

        {/* Furniture Types Showcase */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-4">
            Popular Furniture Types
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {[
              { name: "Modular Bed", icon: <FaBed /> },
              { name: "Wardrobe", icon: <FaArchive /> },
              { name: "TV Unit / Entertainment Unit", icon: <FaTv /> },
              { name: "Wall Unit", icon: <FaThLarge /> },
              { name: "Crockery Unit", icon: <FaUtensils /> },
              { name: "Dresser Unit", icon: <FaArchive /> },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 bg-[#8ed26b] text-black rounded-lg px-3 md:px-4 py-2 text-sm font-medium hover:bg-[#7bc55a] transition-all cursor-pointer min-h-[40px]"
              >
                <span className="text-base md:text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#8ed26b] py-4 md:py-6 px-6 md:px-8">
            <h2 className="text-xl md:text-2xl font-bold text-white text-center">
              Submit Your Requirements
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-12 space-y-8 md:space-y-12">
            {/* Customer Details */}
            <div className="space-y-4 md:space-y-2">
              <h3 className="text-xl md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">
                Customer Details
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="full_name"
                    required
                    value={form.full_name}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="mobile_number"
                    required
                    value={form.mobile_number}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., +91 9876543210"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-xl md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">
                Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {([
                  ["flat_no", "Flat / House / Plot No", true],
                  ["floor", "Floor", true],
                  ["building_name", "Building / Apartment Name", true],
                  ["street", "Street / Locality", true],
                  ["area", "Area / Zone", true],
                  ["landmark", "Landmark (Optional)", false],
                  ["city", "City / Town", true],
                  ["state", "State", true],
                  ["pincode", "Pincode", true],
                ] as AddressField[]).map(([name, label, required]) => (
                  <div key={name} className="flex-1">
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      name={name}
                      required={required}
                      value={form[name]}
                      onChange={handleChange}
                      className={input}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Furniture Requirement */}
            <div className="space-y-4">
              <h3 className="text-xl md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">
                Furniture Requirement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Requirement Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="furniture_requirement_details"
                    required
                    className={`${input} h-24 md:h-28 resize-none`}
                    value={form.furniture_requirement_details}
                    onChange={handleChange}
                    placeholder="Describe your furniture requirements..."
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Material / Finish Preference
                  </label>
                  <input
                    name="material_finish_preference"
                    value={form.material_finish_preference}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., Wood, laminate, color preferences"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Expected Timeline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expected_timeline"
                    required
                    value={form.expected_timeline}
                    onChange={handleChange}
                    className={input}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Approximate Budget Range <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="approximate_budget_range"
                    required
                    value={form.approximate_budget_range}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., ₹50,000 - ₹1,00,000"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Additional Notes / Special Instructions
                  </label>
                  <textarea
                    name="additional_notes"
                    value={form.additional_notes}
                    onChange={handleChange}
                    className={`${input} h-20 md:h-24 resize-none`}
                    placeholder="Any special instructions or notes..."
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    name="measurements_available"
                    checked={form.measurements_available}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#8ed26b]"
                  />
                  <span className="text-gray-700 font-medium text-sm">Measurements Available</span>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 md:py-5 bg-[#8ed26b] hover:bg-[#7bc55a] text-white font-bold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit Requirement"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
const Field = ({ label, required, children }: any) => (
  <div className="flex flex-col gap-2 md:gap-3">
    <label className="text-gray-700 font-semibold text-sm md:text-base">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

/* ================= INPUT STYLES ================= */
const input = `w-full border border-gray-300 rounded-xl px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base min-h-[44px]`;