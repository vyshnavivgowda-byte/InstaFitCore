"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";
import { FaTruck, FaWrench, FaArrowLeft, FaCouch } from "react-icons/fa";

type AddressField = [string, string, boolean];

export default function B2BServiceRequirementPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initialForm = {
    company_name: "",
    contact_person_name: "",
    mobile_number: "",
    official_email: "",
    flat_no: "",
    floor: "",
    building_name: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    service_coverage_area: "",
    business_type: "",
    service_requirement_description: "",
    volume_scale_of_work: "",
    furniture_product_details: "",
    preferred_service_date: "",
    additional_notes: "",
  };

  const [form, setForm] = useState<any>(initialForm);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("b2b_service_requirement_requests")
      .insert([form]);

    setLoading(false);

    if (error) {
      toast({
        title: "❌ Submission Failed",
        description: "Error submitting B2B request",
        variant: "destructive",
      });
      console.error(error);
    } else {
      toast({
        title: "Request Submitted",
        description: "B2B services requirement submitted successfully",
        variant: "success",
      });
      setForm(initialForm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            B2B Services <span className="text-[#8ed26b]">Requirement</span> Request
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Tailored solutions for Brands, Retailers, Corporates & Enterprises.
            Let us handle your logistics and service needs with precision and care.
          </p>
        </div>

        {/* Services Showcase */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-4">Our Services</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {[
              { name: "Delivery", icon: <FaTruck /> },
              { name: "Installation", icon: <FaWrench /> },
              { name: "Reverse Pickup", icon: <FaArrowLeft /> },
              { name: "Store Display Furniture Setup", icon: <FaCouch /> },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 bg-[#8ed26b] text-black rounded-lg px-3 md:px-4 py-2 text-sm font-medium min-h-[40px]"
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

            {/* Company Details */}
            <Section title="Company Details">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Field label="Company / Brand Name" required>
                  <input name="company_name" required value={form.company_name} onChange={handleChange} className={input} placeholder="e.g., ABC Furniture Co." />
                </Field>
                <Field label="Contact Person Name" required>
                  <input name="contact_person_name" required value={form.contact_person_name} onChange={handleChange} className={input} placeholder="e.g., John Doe" />
                </Field>
                <Field label="Mobile Number" required>
                  <input name="mobile_number" required value={form.mobile_number} onChange={handleChange} className={input} placeholder="e.g., +91 9876543210" />
                </Field>
                <Field label="Official Email ID">
                  <input type="email" name="official_email" value={form.official_email} onChange={handleChange} className={input} placeholder="e.g., contact@company.com" />
                </Field>
              </div>
            </Section>

            {/* Address Details */}
            <Section title="Address Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {([
                  ["flat_no", "Flat / House / Plot No", true],
                  ["floor", "Floor", true],
                  ["building_name", "Building Name", true],
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
            </Section>

           {/* Service Details */}
<Section title="Service Details">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

    {/* FIRST ROW */}
    <Field label="Service Location / Coverage Area" required>
      <input
        name="service_coverage_area"
        required
        value={form.service_coverage_area}
        onChange={handleChange}
        className={input}
        placeholder="City, multiple locations, PAN-India, etc."
      />
    </Field>

    <Field label="Type of Business">
      <input
        name="business_type"
        value={form.business_type}
        onChange={handleChange}
        className={input}
        placeholder="Retail brand, furniture brand, builder, corporate office, warehouse, etc."
      />
    </Field>

    <Field label="Preferred Service Date">
      <input
        type="date"
        name="preferred_service_date"
        value={form.preferred_service_date}
        onChange={handleChange}
        className={input}
        min={getTomorrowDate()}
      />
    </Field>

    {/* spacer to complete row on lg */}
    <div className="hidden lg:block" />

    {/* SECOND ROW — TEXTAREAS */}
    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Field label="Service Requirement Description" required>
        <textarea
          name="service_requirement_description"
          required
          value={form.service_requirement_description}
          onChange={handleChange}
          className={`${input} h-28 resize-none`}
          placeholder="Delivery, delivery-cum-installation, installation only, reverse pickup, repair, store setup, relocation, etc. – describe in detail"
        />
      </Field>

      <Field label="Volume / Scale of Work">
        <textarea
          name="volume_scale_of_work"
          value={form.volume_scale_of_work}
          onChange={handleChange}
          className={`${input} h-28 resize-none`}
          placeholder="Number of orders, stores, locations, or approximate monthly volume."
        />
      </Field>

      <Field label="Furniture / Product Details">
        <textarea
          name="furniture_product_details"
          value={form.furniture_product_details}
          onChange={handleChange}
          className={`${input} h-28 resize-none`}
          placeholder="Type of products involved – beds, wardrobes, sofas, modular units, etc."
        />
      </Field>
    </div>

  </div>
</Section>


            {/* Additional Notes */}
            <Section title="Additional Notes">
              <textarea name="additional_notes" value={form.additional_notes} onChange={handleChange} className={`${input} h-20 md:h-24 resize-none`} placeholder="Any special instructions or notes..." />
            </Section>

            <button disabled={loading} className="w-full py-4 md:py-5 bg-[#8ed26b] hover:bg-[#7bc55a] text-white font-bold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]">
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : "Submit B2B Services"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
const Section = ({ title, children }: any) => (
  <div className="space-y-4 md:space-y-6">
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, required, children }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-gray-700 font-semibold text-sm md:text-base">{label} {required && <span className="text-red-500">*</span>}</label>
    {children}
  </div>
);

const input = `w-full border border-gray-300 rounded-xl px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base min-h-[44px]`;