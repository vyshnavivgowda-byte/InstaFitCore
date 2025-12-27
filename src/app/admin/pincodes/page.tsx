"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Plus, Trash2, MapPin, Loader2, Search as SearchIcon, X, Download } from "lucide-react";
import * as XLSX from "xlsx";

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
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ total: number; inserted: number } | null>(null);

  /* ================= FETCH ================= */
  const fetchPincodes = async (q = "") => {
    setLoading(true);
    let query = supabase.from("service_pincodes").select("*").order("pincode", { ascending: true });
    if (q.trim()) query = query.ilike("pincode", `%${q}%`);
    const { data } = await query;
    setPincodes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPincodes();
  }, []);

  /* ================= ADD SINGLE PINCODE ================= */
  const addPincode = async () => {
    setError(null);
    if (!/^\d{6}$/.test(newPincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }
    setIsSubmitting(true);

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

    const { error: insertError } = await supabase
      .from("service_pincodes")
      .insert([{ pincode: newPincode }]);

    if (insertError) setError("Failed to add pincode");
    else {
      setNewPincode("");
      fetchPincodes(search);
    }
    setIsSubmitting(false);
  };

  /* ================= BULK EXCEL UPLOAD ================= */
  const handleExcelUpload = async (file: File) => {
    setError(null);
    setUploadResult(null);
    setUploading(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      const pincodesFromExcel = rows
        .map((r) => String(r.pincode || "").trim())
        .filter((p) => /^\d{6}$/.test(p));

      if (pincodesFromExcel.length === 0) {
        setError("No valid 6-digit pincodes found in Excel");
        setUploading(false);
        return;
      }

      const uniquePincodes = [...new Set(pincodesFromExcel)];

      const { data: existing } = await supabase.from("service_pincodes").select("pincode");
      const existingSet = new Set(existing?.map((e) => e.pincode));
      const newPincodes = uniquePincodes.filter((p) => !existingSet.has(p));

      if (newPincodes.length === 0) {
        setError("All pincodes already exist");
        setUploading(false);
        return;
      }

      const { error } = await supabase
        .from("service_pincodes")
        .insert(newPincodes.map((p) => ({ pincode: p })));

      if (error) setError("Failed to upload pincodes");
      else {
        fetchPincodes(search);
        setUploadResult({ total: uniquePincodes.length, inserted: newPincodes.length });
      }
    } catch {
      setError("Invalid Excel file");
    }
    setUploading(false);
  };

  /* ================= DELETE ================= */
  const deletePincode = async (id: number) => {
    setDeletingId(id);
    await supabase.from("service_pincodes").delete().eq("id", id);
    fetchPincodes(search);
    setDeletingId(null);
  };

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    fetchPincodes(search);
  };

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    if (pincodes.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(pincodes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pincodes");
    XLSX.writeFile(workbook, "pincodes.xlsx");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Service Pincodes</h1>
            <p className="text-slate-500 mt-1">Manage serviceable delivery locations</p>
          </div>
          <button
            onClick={downloadExcel}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-600"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8 space-y-6">
          {/* ADD PINCODE */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              value={newPincode}
              onChange={(e) => {
                setNewPincode(e.target.value);
                setError(null);
              }}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              className="w-full sm:w-56 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
            />
            <button
              onClick={addPincode}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#8ed26b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#76c65a] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} /> Add Pincode
                </>
              )}
            </button>
            {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
          </div>

          <hr />

          {/* EXCEL UPLOAD */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Bulk Upload (Excel)</h3>
              <p className="text-sm text-slate-500">
                Upload an Excel file with a <b>pincode</b> column
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleExcelUpload(e.target.files[0])}
              className="block text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-[#8ed26b] file:text-white hover:file:bg-[#76c65a]"
            />
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={16} /> Uploading pincodes...
            </div>
          )}

          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-green-700">✅ Upload Successful</p>
              <p className="text-green-600 mt-1">
                {uploadResult.inserted} new pincodes saved out of {uploadResult.total}
              </p>
            </div>
          )}

          <hr />

          {/* SEARCH */}
          <div className="flex items-center gap-2">
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
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 bg-white rounded-2xl border animate-pulse" />
              ))
            : pincodes.length === 0
            ? <div className="col-span-full text-center py-20 text-slate-400">No pincodes found</div>
            : pincodes.map((p) => (
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
                    {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
