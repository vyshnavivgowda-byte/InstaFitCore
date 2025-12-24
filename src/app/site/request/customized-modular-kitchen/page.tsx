"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import { FaUtensils, FaHome, FaBuilding, FaShapes } from "react-icons/fa";
type AddressField = [string, string, boolean];

export default function CustomizedModularKitchenPage() {
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
    kitchen_layout_description: "",
    kitchen_space_size_details: "",
    property_type_status: "",
    material_finish_preference: "",
    storage_design_expectations: "",
    appliances_to_be_integrated: "",
    expected_timeline: "",
    budget_expectation: "",
    site_visit_required: false,
    site_visit_date: "",
    additional_notes: "",
  };

  const [form, setForm] = useState<any>(initialForm);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("customized_modular_kitchen_requests")
      .insert([{ ...form, budget_expectation: Number(form.budget_expectation) }]);

    setLoading(false);

    if (error) {
      console.error(error);
      toast({
        title: "❌ Error submitting request",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Kitchen consultation request submitted",
        variant: "success",
      });
      setForm(initialForm);
    }
  };

  // Minimum date = tomorrow
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Customized <span className="text-[#8ed26b]">Modular</span> Kitchen
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Design your dream kitchen with our customized modular solutions. 
            Request a consultation and our experts will reach out to you.
          </p>
        </div>

        {/* Kitchen Types Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Popular Kitchen Layouts
          </h2>
          <div className="space-y-4">
            {/* First Row: 2 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { name: "L-Shape Kitchen", icon: <FaUtensils />, desc: "Efficient corner layout" },
                { name: "U Shape Kitchen", icon: <FaHome />, desc: "Versatile U-shaped design" },
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

            {/* Second Row: 3 items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { name: "Parallel Kitchen", icon: <FaBuilding />, desc: "Side-by-side counters" },
                { name: "Straight Kitchen", icon: <FaShapes />, desc: "Linear single-wall setup" },
                { name: "Island Kitchen", icon: <FaUtensils />, desc: "Central island feature" },
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
              Request Your Consultation
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
  <Field key={name} label={label} required={required}>
    <input
      name={name}
      required={required}
      value={form[name]}
      onChange={handleChange}
      className={input}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </Field>
))}

              </div>
            </div>

            {/* Kitchen Details */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Kitchen Details
              </h3>
              <div className="space-y-8">
                <Field label="Kitchen Layout / Shape Description">
                  <textarea
                    name="kitchen_layout_description"
                    className={`${input} h-32 resize-none`}
                    value={form.kitchen_layout_description}
                    onChange={handleChange}
                    placeholder="Describe your preferred kitchen layout..."
                  />
                </Field>
                <Field label="Kitchen Space / Size Details">
                  <textarea
                    name="kitchen_space_size_details"
                    className={`${input} h-24 resize-none`}
                    value={form.kitchen_space_size_details}
                    onChange={handleChange}
                    placeholder="e.g., Dimensions, area in sq ft"
                  />
                </Field>
                <Field label="Property Type & Status" required>
                  <input
                    name="property_type_status"
                    required
                    className={input}
                    value={form.property_type_status}
                    onChange={handleChange}
                    placeholder="e.g., Apartment, under construction"
                  />
                </Field>
                <Field label="Material & Finish Preference">
                  <input
                    name="material_finish_preference"
                    className={input}
                    value={form.material_finish_preference}
                    onChange={handleChange}
                    placeholder="e.g., Wood, laminate, colors"
                  />
                </Field>
                <Field label="Storage & Design Expectations">
                  <textarea
                    name="storage_design_expectations"
                    className={`${input} h-24 resize-none`}
                    value={form.storage_design_expectations}
                    onChange={handleChange}
                    placeholder="Describe storage needs and design preferences..."
                  />
                </Field>
                <Field label="Appliances to be Integrated">
                  <input
                    name="appliances_to_be_integrated"
                    className={input}
                    value={form.appliances_to_be_integrated}
                    onChange={handleChange}
                    placeholder="e.g., Refrigerator, oven, dishwasher"
                  />
                </Field>
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Timeline & Budget
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Expected Timeline" required>
                  <input
                    name="expected_timeline"
                    required
                    className={input}
                    value={form.expected_timeline}
                    onChange={handleChange}
                    placeholder="e.g., Within 3 months"
                  />
                </Field>
                <Field label="Budget Expectation" required>
                  <input
                    type="number"
                    name="budget_expectation"
                    required
                    className={input}
                    value={form.budget_expectation}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                  />
                </Field>
              </div>
            </div>

            {/* Site Visit */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Site Visit
              </h3>
              <div className="space-y-8">
                <label className="flex items-center gap-3 text-base text-gray-700 font-semibold">
                  <input
                    type="checkbox"
                    name="site_visit_required"
                    className="w-5 h-5 accent-[#8ed26b]"
                    checked={form.site_visit_required}
                    onChange={handleChange}
                  />
                  Site Visit Required
                </label>
                <Field label="Preferred Site Visit Date">
                  <input
                    type="date"
                    name="site_visit_date"
                    className={input}
                    value={form.site_visit_date}
                    onChange={handleChange}
                    min={tomorrow}
                  />
                </Field>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Additional Notes
              </h3>
              <textarea
                name="additional_notes"
                className={`${input} h-24 resize-none`}
                value={form.additional_notes}
                onChange={handleChange}
                placeholder="Any special instructions or notes..."
              />
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
                "Request Modular Kitchen Consultation"
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