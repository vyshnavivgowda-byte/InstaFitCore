"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import BookServiceModal from "@/components/BookServiceModal";

type ServiceItem = {
  id: number;
  category: string;
  subcategory: string;
  service_name: string;
  image_url: string | null;
  installation_price: number | null;
  dismantling_price: number | null;
  repair_price: number | null;
};

type Subcategory = {
  id: number;
  category: string;
  subcategory: string;
  description: string | null;
  image_url: string | null;
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: subData, error: subError } = await supabase
      .from("subcategories")
      .select("*")
      .eq("is_active", true)
      .order("subcategory", { ascending: true });

    if (subError) console.error("Error fetching subcategories:", subError.message);
    else setSubcategories(subData || []);

    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("*")
      .order("service_name", { ascending: true });

    if (serviceError) console.error("Error fetching services:", serviceError.message);
    else setServices(serviceData || []);

    setFilteredServices(serviceData || []);
    setLoading(false);
  };

  const handleSubcategoryClick = (subcat: string) => {
    setSelectedSubcategory(subcat);
    const filtered = services.filter(s => s.subcategory === subcat);
    setFilteredServices(filtered);
  };

  const handleBookClick = (service: ServiceItem) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-12 px-6 text-center">
        <h1 className="text-5xl font-black">Our Services</h1>
        <p className="mt-3 text-lg opacity-90">
          Explore our wide range of professional services tailored to your needs
        </p>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 py-10 px-5">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
          <ul className="space-y-2">
            {subcategories.map(subcat => (
              <li key={subcat.id}>
                <button
                  onClick={() => handleSubcategoryClick(subcat.subcategory)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition hover:bg-indigo-100 ${
                    selectedSubcategory === subcat.subcategory ? "bg-indigo-200 font-semibold" : "bg-white"
                  }`}
                >
                  {subcat.subcategory}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setSelectedSubcategory(null); setFilteredServices(services); }}
                className={`w-full text-left px-3 py-2 rounded-lg transition hover:bg-indigo-100 ${
                  selectedSubcategory === null ? "bg-indigo-200 font-semibold" : "bg-white"
                }`}
              >
                All Services
              </button>
            </li>
          </ul>
        </aside>

        {/* SERVICES GRID */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {loading ? (
            <p className="text-center text-gray-600 col-span-full">Loading services...</p>
          ) : filteredServices.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No services found.</p>
          ) : (
            filteredServices.map(service => (
              <div key={service.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4">
                <div className="w-full h-40 bg-gray-200 rounded-xl overflow-hidden">
                  {service.image_url ? (
                    <img src={service.image_url} className="w-full h-full object-cover" alt={service.service_name} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                  )}
                </div>

                <h2 className="text-lg font-semibold mt-4 text-gray-800">{service.service_name}</h2>
                <p className="text-sm text-gray-500 mt-1">{service.category} → {service.subcategory}</p>

                <div className="mt-4 text-gray-700 text-sm space-y-1">
                  {service.installation_price && <p><span className="font-medium">Installation:</span> ₹{service.installation_price}</p>}
                  {service.dismantling_price && <p><span className="font-medium">Dismantling:</span> ₹{service.dismantling_price}</p>}
                  {service.repair_price && <p><span className="font-medium">Repair:</span> ₹{service.repair_price}</p>}
                </div>

                <button
                  onClick={() => handleBookClick(service)}
                  className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
                >
                  Book Now
                </button>
              </div>
            ))
          )}
        </main>
      </div>

      {selectedService && (
        <BookServiceModal
          service={selectedService}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
