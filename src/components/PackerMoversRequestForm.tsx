"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import { FaHome, FaBuilding, FaTruck, FaRoute } from "react-icons/fa";
type AddressField = [string, string, boolean];

export default function PackersMoversPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initialForm = {
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
    move_from_address: "",
    move_to_address: "",
    property_details: "",
    moving_type_description: "",
    preferred_moving_date: "",
    items_details: "",
    services_required: "",
    special_handling_instructions: "",
    expected_completion_timeline: "",
    additional_notes: "",
  };

  const [form, setForm] = useState<any>(initialForm);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("packer_and_movers_requests").insert([form]);

    setLoading(false);
    if (error) {
      toast({ title: "❌ Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Success", description: "Request submitted", variant: "success" });
      setForm(initialForm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Packers & <span className="text-[#8ed26b]">Movers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hassle-free moving services tailored to your needs.
            Submit your moving details and get a quote from our experts.
          </p>
        </div>

        {/* Services Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Our Moving Services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Home Relocation", icon: <FaHome /> },
              { name: "Office Relocation", icon: <FaBuilding /> },
              { name: "Local Shifting", icon: <FaTruck /> },
              { name: "Domestic Moving", icon: <FaRoute /> },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2 bg-[#8ed26b] text-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#7bc55a] transition-all cursor-pointer">
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#8ed26b] py-6 px-8">
            <h2 className="text-2xl font-bold text-white text-center">Get Your Moving Quote</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">

            {/* Customer Details */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Customer Details</h3>
              <div className="flex flex-wrap gap-4">
                {["full_name", "mobile_number", "email"].map((field, idx) => (
                  <div key={field} className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      {field.replace("_", " ").toUpperCase()} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      required
                      value={form[field]}
                      onChange={handleChange}
                      className={input}
                      placeholder={`Enter ${field.replace("_", " ")}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Address Details</h3>
              <div className="flex flex-wrap gap-4">
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
                  <div key={name} className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 font-medium text-sm mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
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

          {/* Move Details */}
<div className="space-y-4">
  <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">
    Move Details
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      ["move_from_address", "Move From (Pickup Location)", 2],
      ["move_to_address", "Move To (Drop Location)", 2],
      ["property_details", "Property Details", 1],
      ["moving_type_description", "Moving Type Description", 1],
      ["preferred_moving_date", "Preferred Moving Date / Time", 1],
      ["items_details", "Items / Household Details", 2],
      ["services_required", "Services Required", 1],
      ["special_handling_instructions", "Special Handling Instructions", 1],
      ["expected_completion_timeline", "Expected Completion Timeline", 1],
      ["additional_notes", "Additional Notes", 4],
    ].map(([name, label, span]) => (
      <div key={name} className={`col-span-${span}`}>
        <label className="block text-gray-700 font-medium text-sm mb-1">{label}</label>
        {name.includes("date") ? (
          <input
            type="date"
            name={name}
            value={form[name]}
            onChange={handleChange}
            className={input}
          />
        ) : (
          <textarea
            name={name}
            value={form[name]}
            onChange={handleChange}
            className={`${input} h-24 resize-none`}
            placeholder={`Enter ${label}`}
          />
        )}
      </div>
    ))}
  </div>
</div>


            <button
              disabled={loading}
              className="w-full py-4 bg-[#8ed26b] hover:bg-[#7bc55a] text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? "Submitting..." : "Request Moving Quote"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT STYLES ================= */
const input = `w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500`;
