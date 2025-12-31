"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import { FaUtensils, FaRegSquare, FaThLarge, FaCoffee, FaWarehouse, FaTimes } from "react-icons/fa";

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
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  const handleChange = (e: any) => {
    let { name, value, type, checked } = e.target;

    // Only allow digits for mobile_number and pincode
    if (name === "mobile_number") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
    }

    if (name === "pincode") {
      value = value.replace(/\D/g, "");
      if (value.length > 6) value = value.slice(0, 6);
    }

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setReferenceImages([...referenceImages, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...referenceImages];
    // Revoke the object URL to release memory
    URL.revokeObjectURL(updated[index] as any);
    updated.splice(index, 1);
    setReferenceImages(updated);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
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
          title: "Consultation request submitted",
          variant: "success",
        });
        setForm(initialForm);

        // Revoke object URLs to clear previews
        referenceImages.forEach(file => URL.revokeObjectURL(file as any));
        setReferenceImages([]);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-4 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-5">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            Customized <span className="text-[#8ed26b]">Modular</span> Kitchen
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Design your dream kitchen with our customized modular solutions. Request a consultation and our experts will reach out to you.
          </p>
        </div>

        {/* Popular Kitchen Layouts */}
        <div className="mb-6 md:mb-12">
          <h2 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-3 md:mb-4">Popular Kitchen Layouts</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {[
              { name: "L-Shape Kitchen", icon: <FaUtensils /> },
              { name: "U Shape Kitchen", icon: <FaRegSquare /> },
              { name: "Parallel Kitchen", icon: <FaThLarge /> },
              { name: "Straight Kitchen", icon: <FaCoffee /> },
              { name: "Island Kitchen", icon: <FaWarehouse /> },
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

        {/* Consultation Form */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#8ed26b] py-3 md:py-6 px-4 md:px-8">
            <h2 className="text-lg md:text-xl font-bold text-white text-center">Request Your Consultation</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8">
            {/* Customer Details */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Field label="Full Name" required>
                  <input name="full_name" value={form.full_name} onChange={handleChange} required className={input} placeholder="e.g., John Doe" />
                </Field>
                <Field label="Mobile Number" required>
                  <input
                    name="mobile_number"
                    value={form.mobile_number}
                    onChange={handleChange}
                    required
                    className={input}
                    placeholder="9876543210"
                    pattern="\d{10}"
                    title="Please enter a valid 10-digit mobile number"
                  />
                </Field>
                <Field label="Email ID" required>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={input} placeholder="john@example.com" />
                </Field>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                    <input name={name} value={form[name]} onChange={handleChange} required={required} className={input} placeholder={`Enter ${label.toLowerCase()}`} />
                  </Field>
                ))}
              </div>
            </div>

            {/* Kitchen Details */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Kitchen / Furniture Details</h3>
              <div className="space-y-3 md:space-y-4">
                <Field label="Layout / Shape Description">
                  <textarea name="kitchen_layout_description" className={`${input} h-20 md:h-24 resize-none`} value={form.kitchen_layout_description} onChange={handleChange} placeholder="L-shape, U-shape, straight, island – describe in your own words" />
                </Field>
                <Field label="Space / Size Details">
                  <textarea name="kitchen_space_size_details" className={`${input} h-16 md:h-20 resize-none`} value={form.kitchen_space_size_details} onChange={handleChange} placeholder="Approximate size or description of available space" />
                </Field>
                <Field label="Property Type & Status" required>
                  <input name="property_type_status" value={form.property_type_status} onChange={handleChange} required className={input} placeholder="Apartment / Independent house / New or Renovation" />
                </Field>
                <Field label="Material & Finish Preference">
                  <input name="material_finish_preference" value={form.material_finish_preference} onChange={handleChange} className={input} placeholder="If any – customer can freely describe" />
                </Field>
                <Field label="Storage & Design Expectations">
                  <textarea name="storage_design_expectations" className={`${input} h-16 md:h-20 resize-none`} value={form.storage_design_expectations} onChange={handleChange} placeholder="Cabinets, drawers, pantry units, etc." />
                </Field>
                <Field label="Appliances to be Integrated">
                  <input name="appliances_to_be_integrated" value={form.appliances_to_be_integrated} onChange={handleChange} className={input} placeholder="Hob, chimney, oven, dishwasher..." />
                </Field>
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Timeline & Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Field label="Expected Timeline" required>
                  <input name="expected_timeline" value={form.expected_timeline} onChange={handleChange} required className={input} placeholder="e.g., Within 3 months" />
                </Field>
                <Field label="Budget Expectation" required>
                  <input type="number" name="budget_expectation" value={form.budget_expectation} onChange={handleChange} required className={input} placeholder="e.g., 50000" />
                </Field>
              </div>
            </div>

            {/* Site Visit */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Site Visit</h3>

              <label className="flex items-center gap-3 text-sm md:text-base font-semibold">
                <input
                  type="checkbox"
                  name="site_visit_required"
                  className="w-5 h-5 accent-[#8ed26b]"
                  checked={form.site_visit_required}
                  onChange={handleChange}
                />
                Site Visit Required
              </label>

              {form.site_visit_required && (
                <Field label="Preferred Site Visit Date">
                  <input
                    type="date"
                    name="site_visit_date"
                    value={form.site_visit_date}
                    onChange={handleChange}
                    className={input}
                    min={tomorrow}
                  />
                </Field>
              )}
            </div>

            {/* Reference Images */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Reference Images / Inspiration (Optional)</h3>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className={input} />
              {referenceImages.length > 0 && (
                <div className="flex flex-wrap gap-2 md:gap-4 mt-2">
                  {referenceImages.map((file, index) => (
                    <div key={index} className="relative w-20 h-20 md:w-24 md:h-24 border rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-1">Additional Notes</h3>
              <textarea name="additional_notes" className={`${input} h-16 md:h-20 resize-none`} value={form.additional_notes} onChange={handleChange} placeholder="Any special instructions or notes..." />
            </div>

            {/* Submit Button */}
            <button disabled={loading} className="w-full py-3 md:py-4 bg-[#8ed26b] hover:bg-[#7bc55a] text-white font-bold text-base md:text-lg rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]">
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
  <div className="flex flex-col gap-2 md:gap-3">
    <label className="text-gray-700 font-semibold text-sm md:text-base">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

/* ================= INPUT STYLES ================= */
const input = `w-full border border-gray-300 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base min-h-[40px] md:min-h-[44px]`;