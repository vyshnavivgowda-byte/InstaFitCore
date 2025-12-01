"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";

type Service = {
  id: number;
  service_name: string;
  price: number | null;
  description: string | null;
  features: any[] | null;
  images: string[] | null;
  service_type: string | null;
  category_id: number; // Needed for related services
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = Number(params.id);

  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Load main service
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();

      setService(data);
      setLoading(false);
    }

    load();
  }, [serviceId]);

  // Load Related services
  useEffect(() => {
    if (!service?.category_id) return;

    async function loadRelated() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("category_id", service.category_id)
        .neq("id", serviceId) // Exclude current service
        .limit(6);

      setRelated(data || []);
    }

    loadRelated();
  }, [service?.category_id]);

  // Slideshow Auto Change
  useEffect(() => {
    if (!service?.images || service.images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % service.images!.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [service?.images]);

  // Lightbox ESC close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Service Not Found
      </div>
    );
  }

  const images = service.images || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 max-w-7xl mx-auto">

      {/* TOP: SERVICE DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT IMAGES */}
        <div>
          <div
            className="relative w-full h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-gray-200"
            onClick={() => setShowLightbox(true)}
          >
            {images.length > 0 ? (
              <Image
                src={images[currentIndex]}
                alt="service image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-4 mt-4">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border ${
                  i === currentIndex ? "border-green-600" : "border-transparent"
                }`}
                onClick={() => setCurrentIndex(i)}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {service.service_name}
          </h1>

          {service.price && (
            <p className="text-3xl font-bold text-green-700 mt-3">₹{service.price}</p>
          )}

          <p className="text-gray-700 mt-5 leading-relaxed text-lg">
            {service.description}
          </p>

          {service.features?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <ul className="space-y-2 text-gray-700">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✔</span>
                    <span>{typeof f === "string" ? f : f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 mt-10">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition">
              Add to Cart
            </button>

            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl text-lg font-semibold shadow-md transition">
              Wishlist
            </button>

            <button
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: service.service_name,
                    text: "Check out this service!",
                    url: window.location.href,
                  });
                } else {
                  alert("Sharing is not supported on this browser.");
                }
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative w-11/12 md:w-3/4 h-3/4">
            <Image
              src={images[currentIndex]}
              alt="big"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* RELATED SERVICES BELOW */}
    {/* RELATED SERVICES BELOW */}
<div className="mt-20">
  <h2 className="text-3xl font-bold mb-8">More Services You May Like</h2>

  {related.length === 0 ? (
    <p className="text-gray-500">No related services available.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {related.map((s) => (
        <div key={s.id} className="bg-white rounded-xl shadow p-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
            {s.images?.length ? (
              <Image
                src={s.images[0]}
                alt={s.service_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold mt-4">{s.service_name}</h3>

          {/* ⭐ ADDED DESCRIPTION HERE */}
          {s.description && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {s.description}
            </p>
          )}

          {s.price && (
            <p className="text-green-600 font-bold mt-2">₹{s.price}</p>
          )}

          <Link
            href={`/site/services/view/${s.id}`}
            className="block mt-4 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
}
