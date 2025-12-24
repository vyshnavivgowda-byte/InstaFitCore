"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import {
  FaBed,
  FaArchive,
  FaTv,
  FaThLarge,
  FaUtensils,
} from "react-icons/fa";

export default function CustomizedModularFurniturePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    expected_timeline: "",
    approximate_budget_range: "",
    additional_notes: "",
    measurements_available: false,
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
        description: "Submission failed",
        variant: "destructive",
      });
    } else {
      toast({
        title: "✅ Submitted",
        description: "We will contact you shortly",
        variant: "success",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Customized <span className="text-[#8ed26b]">Modular</span> Furniture
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Share your requirements and our experts will assist you.
          </p>
        </div>

        {/* FURNITURE TYPES */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Popular Furniture Types
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Modular Bed", icon: <FaBed /> },
              { name: "Wardrobe", icon: <FaArchive /> },
              { name: "TV Unit", icon: <FaTv /> },
              { name: "Wall Unit", icon: <FaThLarge /> },
              { name: "Crockery Unit", icon: <FaUtensils /> },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 bg-[#8ed26b] px-4 py-2 rounded-lg text-sm font-medium"
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-[#8ed26b] py-5">
            <h2 className="text-2xl text-white text-center font-bold">
              Submit Your Requirements
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            {/* CUSTOMER DETAILS */}
            <Section title="Customer Details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Full Name" name="full_name" required form={form} onChange={handleChange} />
                <Input label="Mobile Number" name="mobile_number" required form={form} onChange={handleChange} />
                <Input label="Email" name="email" type="email" required form={form} onChange={handleChange} />
              </div>
            </Section>

            {/* ADDRESS DETAILS – 2 ROWS */}
            <Section title="Address Details">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input label="Flat / House No" name="flat_no" required form={form} onChange={handleChange} />
                <Input label="Floor" name="floor" required form={form} onChange={handleChange} />
                <Input label="Building Name" name="building_name" required form={form} onChange={handleChange} />
                <Input label="Street" name="street" required form={form} onChange={handleChange} />

                <Input label="Area" name="area" required form={form} onChange={handleChange} />
                <Input label="City" name="city" required form={form} onChange={handleChange} />
                <Input label="State" name="state" required form={form} onChange={handleChange} />
                <Input label="Pincode" name="pincode" required form={form} onChange={handleChange} />

                <div className="md:col-span-4">
                  <Input label="Landmark (Optional)" name="landmark" form={form} onChange={handleChange} />
                </div>
              </div>
            </Section>

            {/* REQUIREMENTS */}
           <Section title="Furniture Requirement">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Textarea
      label="Requirement Details"
      name="furniture_requirement_details"
      span={2}
      required
      form={form}
      onChange={handleChange}
    />
    <Input
      label="Material / Finish"
      name="material_finish_preference"
      form={form}
      onChange={handleChange}
    />
    <Input
      label="Expected Timeline"
      name="expected_timeline"
      type="date"
      form={form}
      onChange={handleChange}
    />
    
   {/* Budget + Additional Notes + Measurements row */}
<div className="md:col-span-4 flex items-start gap-4">
  <Input
    label="Budget Range"
    name="approximate_budget_range"
    form={form}
    onChange={handleChange}
    className="flex-1"
  />

  <Textarea
    label="Additional Notes"
    name="additional_notes"
    form={form}
    onChange={handleChange}
    className="flex-1"
  />

  <div className="flex items-center mt-6 gap-2">
    <input
      type="checkbox"
      name="measurements_available"
      checked={form.measurements_available}
      onChange={handleChange}
      className="w-5 h-5 accent-[#8ed26b]"
    />
    <span className="text-sm font-medium">Measurements Available</span>
  </div>
</div>

  </div>
</Section>


            <button
              disabled={loading}
              className="w-full py-4 bg-[#8ed26b] text-white font-bold text-lg rounded-xl"
            >
              {loading ? "Submitting..." : "Submit Requirement"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ================== REUSABLE UI ================== */

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-xl font-semibold border-b-2 border-[#8ed26b] pb-1 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const Input = ({ label, name, type = "text", required, form, onChange }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={form[name]}
      onChange={onChange}
      required={required}
      placeholder={`Enter ${label}`}
      className={input}
    />
  </div>
);

const Textarea = ({ label, name, span = 1, required, form, onChange }: any) => (
  <div className={`md:col-span-${span}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={form[name]}
      onChange={onChange}
      required={required}
      placeholder={`Enter ${label}`}
      className={`${input} h-20 resize-none`}
    />
  </div>
);

/* ================== STYLES ================== */

const input =
  "w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-[#8ed26b] focus:outline-none";
