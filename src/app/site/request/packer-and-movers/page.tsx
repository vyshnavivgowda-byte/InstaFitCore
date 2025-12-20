"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import { FaHome, FaBuilding, FaTruck, FaRoute } from "react-icons/fa";

export default function PackerAndMoversPage() {
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
      console.error(error);
      toast({
        title: "❌ Failed to submit request",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request submitted",
        variant: "success",
      });
      setForm(initialForm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Packers & <span className="text-[#8ed26b]">Movers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hassle-free moving services tailored to your needs. 
            Submit your moving details and get a quote from our experts.
          </p>
        </div>

        {/* Relocation Types Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Our Moving Services
          </h2>
          <div className="space-y-4">
            {/* First Row: 2 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { name: "Home Relocation", icon: <FaHome />, desc: "Seamless home moves" },
                { name: "Office Relocation", icon: <FaBuilding />, desc: "Professional office shifts" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-[#8ed26b] group"
                >
                  <div className="flex justify-center items-center h-20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-6xl text-[#7bc55a]">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Second Row: 2 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { name: "Local Shifting", icon: <FaTruck />, desc: "Within city moves" },
                { name: "Domestic Moving", icon: <FaRoute />, desc: "Inter-city relocations" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-[#8ed26b] group"
                >
                  <div className="flex justify-center items-center h-20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-6xl text-[#7bc55a]">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#8ed26b] py-6 px-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Get Your Moving Quote
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
            {/* Customer Details */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Full Name" required>
                  <input
                    name="full_name"
                    required
                    className={input}
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                  />
                </Field>
                <Field label="Mobile Number" required>
                  <input
                    name="mobile_number"
                    required
                    className={input}
                    value={form.mobile_number}
                    onChange={handleChange}
                    placeholder="e.g., +91 9876543210"
                  />
                </Field>
                <Field label="Email ID" required>
                  <input
                    type="email"
                    name="email"
                    required
                    className={input}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g., john@example.com"
                  />
                </Field>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  ["flat_no", "Flat / House / Plot No", true],
                  ["floor", "Floor", true],
                  ["building_name", "Building / Apartment Name", true],
                  ["street", "Street / Locality", true],
                  ["area", "Area / Zone", true],
                  ["landmark", "Landmark (Optional)", false],
                  ["city", "City / Town", true],
                  ["state", "State", true],
                  ["pincode", "Pincode", true],
                ].map(([name, label, required]) => (
                  <Field key={name} label={label} required={required}>
                    <input
                      name={name}
                      required={required}
                      className={input}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </Field>
                ))}
              </div>
            </div>

            {/* Move Details */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Move Details
              </h3>
              <div className="space-y-8">
                <Field label="Move From (Pickup Location)" required>
                  <textarea
                    name="move_from_address"
                    required
                    className={`${input} h-32 resize-none`}
                    value={form.move_from_address}
                    onChange={handleChange}
                    placeholder="Enter full pickup address..."
                  />
                </Field>
                <Field label="Move To (Drop Location)" required>
                  <textarea
                    name="move_to_address"
                    required
                    className={`${input} h-32 resize-none`}
                    value={form.move_to_address}
                    onChange={handleChange}
                    placeholder="Enter full drop address..."
                  />
                </Field>
                <Field label="Property Details" required>
                  <textarea
                    name="property_details"
                    required
                    className={`${input} h-24 resize-none`}
                    value={form.property_details}
                    onChange={handleChange}
                    placeholder="e.g., 2BHK apartment, villa"
                  />
                </Field>
                <Field label="Moving Type Description" required>
                  <textarea
                    name="moving_type_description"
                    required
                    className={`${input} h-24 resize-none`}
                    value={form.moving_type_description}
                    onChange={handleChange}
                    placeholder="Describe the type of move..."
                  />
                </Field>
                <Field label="Preferred Moving Date / Time">
                  <input
                    type="date"
                    name="preferred_moving_date"
                    className={input}
                    value={form.preferred_moving_date}
                    onChange={handleChange}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  />
                </Field>
                <Field label="Items / Household Details" required>
                  <textarea
                    name="items_details"
                    required
                    className={`${input} h-24 resize-none`}
                    value={form.items_details}
                    onChange={handleChange}
                    placeholder="List items to be moved..."
                  />
                </Field>
                <Field label="Services Required" required>
                  <textarea
                    name="services_required"
                    required
                    className={`${input} h-24 resize-none`}
                    value={form.services_required}
                    onChange={handleChange}
                    placeholder="e.g., Packing, loading, unloading"
                  />
                </Field>
                <Field label="Special Handling Instructions">
                  <textarea
                    name="special_handling_instructions"
                    className={`${input} h-24 resize-none`}
                    value={form.special_handling_instructions}
                    onChange={handleChange}
                    placeholder="Any special care needed..."
                  />
                </Field>
                <Field label="Expected Completion Timeline">
                  <input
                    name="expected_completion_timeline"
                    className={input}
                    value={form.expected_completion_timeline}
                    onChange={handleChange}
                    placeholder="e.g., 1-2 days"
                  />
                </Field>
                <Field label="Additional Notes">
                  <textarea
                    name="additional_notes"
                    className={`${input} h-24 resize-none`}
                    value={form.additional_notes}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
                  />
                </Field>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-[#8ed26b] hover:bg-[#7bc55a] text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                "Request Moving Quote"
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
  <div className="flex flex-col gap-3">
    <label className="text-gray-700 font-semibold text-base">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

/* ================= INPUT STYLES ================= */
const input = `w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500`;