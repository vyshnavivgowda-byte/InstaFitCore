"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Plus, Trash2, MapPin, Loader2, Search as SearchIcon, X } from "lucide-react";

type Pincode = {
  id: number;
  pincode: string;
};

export default function AdminPincodes() {
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPincode, setNewPincode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchPincodes = async (q = "") => {
    setLoading(true);
    let query = supabase.from("service_pincodes").select("*").order("pincode", { ascending: true });

    if (q.trim()) {
      query = query.ilike("pincode", `%${q}%`);
    }

    const { data } = await query;
    setPincodes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPincodes();
  }, []);

  /* ================= ADD ================= */
  const addPincode = async () => {
    setError(null);

    if (!/^\d{6}$/.test(newPincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsSubmitting(true);

    // Check duplicate
    const { data: existing } = await supabase
      .from("service_pincodes")
      .select("id")
      .eq("pincode", newPincode)
      .single();

    if (existing) {
      setError("This pincode already exists");
      setIsSubmitting(false);
      return;
    }

    // Insert
    const { error: insertError } = await supabase
      .from("service_pincodes")
      .insert([{ pincode: newPincode }]);

    if (insertError) {
      setError("Failed to add pincode");
    } else {
      setNewPincode("");
      fetchPincodes(search);
    }

    setIsSubmitting(false);
  };

  /* ================= DELETE ================= */
  const deletePincode = async (id: number) => {
    setDeletingId(id);
    await supabase.from("service_pincodes").delete().eq("id", id);
    fetchPincodes(search);
    setDeletingId(null);
  };

  /* ================= HANDLE SEARCH ================= */
  const handleSearch = () => {
    fetchPincodes(search);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">Service Pincodes</h1>
          <p className="text-slate-500 mt-1">Manage serviceable delivery locations</p>
        </div>

        {/* ADD + SEARCH ROW */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Add Pincode */}
          <div className="flex-1 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <input
              value={newPincode}
              onChange={(e) => {
                setNewPincode(e.target.value);
                setError(null);
              }}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              className="w-full sm:w-48 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
            />
            <button
              onClick={addPincode}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#8ed26b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#76c65a] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Adding
                </>
              ) : (
                <>
                  <Plus size={18} /> Add
                </>
              )}
            </button>
            {error && <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p>}
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search pincode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="inline-flex items-center gap-2 bg-[#8ed26b] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#76c65a]"
            >
              <SearchIcon size={16} /> Search
            </button>
          </div>
        </div>

        {/* PINCODE GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white rounded-2xl border animate-pulse"
              />
            ))
          ) : pincodes.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-400">
              No pincodes found
            </div>
          ) : (
            pincodes.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#8ed26b]" size={18} />
                  <span className="font-bold text-lg">{p.pincode}</span>
                </div>

                <button
                  onClick={() => deletePincode(p.id)}
                  disabled={deletingId === p.id}
                  className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl disabled:opacity-50"
                >
                  {deletingId === p.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
