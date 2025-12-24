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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            B2B Services <span className="text-[#8ed26b]">Requirement</span> Request
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tailored solutions for Brands, Retailers, Corporates & Enterprises.
            Let us handle your logistics and service needs with precision and care.
          </p>
        </div>

        {/* Services Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Delivery", icon: <FaTruck />, desc: "Fast and reliable delivery services" },
              { name: "Installation", icon: <FaWrench />, desc: "Professional assembly and setup" },
              { name: "Reverse Pickup", icon: <FaArrowLeft />, desc: "Efficient return and pickup" },
              { name: "Store Display Setup", icon: <FaCouch />, desc: "Expert furniture arrangement" },
            ].map((service, index) => (
              <div
                key={service.name}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-[#8ed26b] group"
              >
                <div className="flex justify-center items-center h-20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-6xl text-[#7bc55a]">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#8ed26b] py-6 px-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Submit Your Requirements
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
            {/* Company Details */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Company / Brand Name" required>
                  <input
                    name="company_name"
                    required
                    value={form.company_name}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., ABC Furniture Co."
                  />
                </Field>
                <Field label="Contact Person Name" required>
                  <input
                    name="contact_person_name"
                    required
                    value={form.contact_person_name}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., John Doe"
                  />
                </Field>
                <Field label="Mobile Number" required>
                  <input
                    name="mobile_number"
                    required
                    value={form.mobile_number}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., +91 9876543210"
                  />
                </Field>
                <Field label="Official Email ID">
                  <input
                    type="email"
                    name="official_email"
                    value={form.official_email}
                    onChange={handleChange}
                    className={input}
                    placeholder="e.g., contact@company.com"
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

            {/* Service Details */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Service Details
              </h3>
              <div className="space-y-8">
                <Field label="Service Location / Coverage Area" required>
                  <input
                    name="service_coverage_area"
                    placeholder="e.g., Mumbai, PAN-India, specific locations"
                    required
                    value={form.service_coverage_area}
                    onChange={handleChange}
                    className={input}
                  />
                </Field>
                <Field label="Type of Business">
                  <input
                    name="business_type"
                    placeholder="e.g., Retail brand, corporate office"
                    value={form.business_type}
                    onChange={handleChange}
                    className={input}
                  />
                </Field>
                <Field label="Service Requirement Description" required>
                  <textarea
                    name="service_requirement_description"
                    required
                    className={`${input} h-32 resize-none`}
                    value={form.service_requirement_description}
                    onChange={handleChange}
                    placeholder="Describe your requirements in detail..."
                  />
                </Field>
                <Field label="Volume / Scale of Work">
                  <textarea
                    name="volume_scale_of_work"
                    placeholder="e.g., 100 orders per month"
                    className={`${input} h-24 resize-none`}
                    value={form.volume_scale_of_work}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Furniture / Product Details">
                  <textarea
                    name="furniture_product_details"
                    placeholder="e.g., Beds, sofas, wardrobes"
                    className={`${input} h-24 resize-none`}
                    value={form.furniture_product_details}
                    onChange={handleChange}
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
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#8ed26b] pb-2">
                Additional Notes
              </h3>
              <textarea
                name="additional_notes"
                value={form.additional_notes}
                onChange={handleChange}
                className={`${input} h-24 resize-none`}
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
                "Submit B2B Services "
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