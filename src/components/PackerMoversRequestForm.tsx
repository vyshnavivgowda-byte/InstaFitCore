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

                {/* ROW 1 */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Move From (Pickup Location)
                  </label>
                  <textarea
                    name="move_from_address"
                    value={form.move_from_address}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Enter pickup location"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Move To (Drop Location)
                  </label>
                  <textarea
                    name="move_to_address"
                    value={form.move_to_address}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Enter drop location"
                  />
                </div>

                {/* ROW 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Details
                  </label>
                  <textarea
                    name="property_details"
                    value={form.property_details}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Example: 1BHK apartment, 2BHK villa, floor number, lift availability, etc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moving Type Description
                  </label>
                  <textarea
                    name="moving_type_description"
                    value={form.moving_type_description}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Local / intercity / within same building – describe in words"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Moving Date
                  </label>
                  <input
                    type="date"
                    name="preferred_moving_date"
                    value={form.preferred_moving_date}
                    onChange={handleChange}
                    className={`${input} h-12`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Completion Timeline
                  </label>
                  <textarea
                    name="expected_completion_timeline"
                    value={form.expected_completion_timeline}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Same day, 2–3 days, flexible"
                  />
                </div>

                {/* ROW 3 */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Items / Household Details
                  </label>
                  <textarea
                    name="items_details"
                    value={form.items_details}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Furniture, appliances, fragile items"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Services Required
                  </label>
                  <textarea
                    name="services_required"
                    value={form.services_required}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Packing, loading, transportation, unloading, unpacking, dismantling & installation – describe required services"
                  />
                </div>

                {/* ROW 4 */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Handling Instructions
                  </label>
                  <textarea
                    name="special_handling_instructions"
                    value={form.special_handling_instructions}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Fragile items, heavy items, piano, glass, antique, etc.)"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="additional_notes"
                    value={form.additional_notes}
                    onChange={handleChange}
                    className={`${input} h-24 resize-none`}
                    placeholder="Any other information"
                  />
                </div>

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
