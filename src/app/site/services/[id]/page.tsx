"use client";

import BookServiceModal from "@/components/BookServiceModal";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";

type Subcategory = {
  id: number;
  subcategory: string;
  description: string | null;
  image_url: string | null;
  category: string;
};

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

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = Number(params.id);

  const [service, setService] = useState<Subcategory | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch logged-in user via API
  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) return;

      const res = await fetch("/api/user/details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user) setUserEmail(data.user.email);
    };
    fetchUser();
  }, []);

  const handleBookClick = (service: ServiceItem) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  useEffect(() => {
    async function load() {
      // Fetch Subcategory
      const { data: subData } = await supabase
        .from("subcategories")
        .select("*")
        .eq("id", serviceId)
        .single();

      setService(subData);

      // Fetch all services under this subcategory
      if (subData) {
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("subcategory", subData.subcategory);

        setServices(servicesData || []);
      }

      setLoading(false);
    }

    load();
  }, [serviceId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center">Service Not Found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* HERO SECTION */}
      <div
        className="relative text-white overflow-hidden h-96 md:h-[500px]"
        style={{
          backgroundImage: `url(${service.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 h-full flex flex-col justify-center">
          <nav className="text-sm mb-4 opacity-80">
            <span className="hover:text-yellow-300 cursor-pointer transition">{service.category}</span>
            <span className="mx-2">/</span>
            <span className="font-medium">{service.subcategory}</span>
          </nav>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">{service.subcategory}</h1>
          <p className="text-white text-lg leading-relaxed mb-8">
            {service.description || "We provide professional services with quality and efficiency."}
          </p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">All Available Services</h2>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                  <div className="relative w-full h-48 bg-gradient-to-br from-indigo-200 to-purple-200">
                    {item.image_url ? <Image src={item.image_url} alt={item.service_name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{item.service_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      {item.installation_price != null && item.installation_price > 0 && <p>Install: ₹{item.installation_price}</p>}
                      {item.dismantling_price != null && item.dismantling_price > 0 && <p>Dismantle: ₹{item.dismantling_price}</p>}
                      {item.repair_price != null && item.repair_price > 0 && <p>Repair: ₹{item.repair_price}</p>}
                    </div>

                    <button onClick={() => handleBookClick(item)} className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedService && userEmail && (
        <BookServiceModal
          service={selectedService}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userEmail={userEmail}
          isLoading={false}
        />
      )}
    </div>
  );
}
