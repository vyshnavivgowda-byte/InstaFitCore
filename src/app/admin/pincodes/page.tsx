"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Plus, Trash2, MapPin, Loader2, Search as SearchIcon, X, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

type Pincode = {
  id: number;
  pincode: string;
  city: string;
  state: string;
};

export default function AdminPincodes() {
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPincode, setNewPincode] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ total: number; inserted: number; errors: string[] } | null>(null);

  /* ================= FETCH ================= */
  const fetchPincodes = async (q = "") => {
    setLoading(true);
    let query = supabase.from("service_pincodes").select("*").order("pincode", { ascending: true });
    if (q.trim()) {
      query = query.or(`pincode.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`);
    }
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
    if (!newCity.trim() || !newState.trim()) {
      setError("Please enter city and state");
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
      .insert([{ pincode: newPincode, city: newCity.trim(), state: newState.trim() }]);

    if (insertError) setError("Failed to add pincode");
    else {
      setNewPincode("");
      setNewCity("");
      setNewState("");
      fetchPincodes(search);
    }
    setIsSubmitting(false);
  };

  /* ================= BULK UPLOAD (CSV/EXCEL) ================= */
  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploadResult(null);
    setUploading(true);

    const fileType = file.name.split('.').pop()?.toLowerCase();
    let rows: any[] = [];

    try {
      if (fileType === 'csv') {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        rows = parsed.data;
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      } else {
        setError("Unsupported file type. Please upload CSV or Excel.");
        setUploading(false);
        return;
      }

      const errors: string[] = [];
      const validRows: { pincode: string; city: string; state: string }[] = [];

      rows.forEach((row, index) => {
        const pincode = String(row.pincode || "").trim();
        const city = String(row.city || "").trim();
        const state = String(row.state || "").trim();

        if (!/^\d{6}$/.test(pincode)) {
          errors.push(`Row ${index + 1}: Invalid pincode "${pincode}" (must be 6 digits)`);
        } else if (!city) {
          errors.push(`Row ${index + 1}: Missing city`);
        } else if (!state) {
          errors.push(`Row ${index + 1}: Missing state`);
        } else {
          validRows.push({ pincode, city, state });
        }
      });

      if (validRows.length === 0) {
        setError("No valid rows found in file");
        setUploading(false);
        return;
      }

      const uniqueRows = validRows.filter((row, index, self) =>
        index === self.findIndex(r => r.pincode === row.pincode)
      );

      const { data: existing } = await supabase.from("service_pincodes").select("pincode");
      const existingSet = new Set(existing?.map((e) => e.pincode));
      const newRows = uniqueRows.filter((r) => !existingSet.has(r.pincode));

      if (newRows.length === 0) {
        setError("All pincodes already exist");
        setUploading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("service_pincodes")
        .insert(newRows);

      if (insertError) {
        setError("Failed to upload pincodes");
      } else {
        fetchPincodes(search);
        setUploadResult({ total: uniqueRows.length, inserted: newRows.length, errors });
      }
    } catch {
      setError("Invalid file format");
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

  /* ================= DOWNLOAD TEMPLATE ================= */
  const downloadTemplate = (format: 'csv' | 'xlsx') => {
    const headers = ['pincode', 'city', 'state'];
    const sampleData = [
      { pincode: '110001', city: 'New Delhi', state: 'Delhi' },
      { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    ];

    if (format === 'csv') {
      const csv = Papa.unparse({ fields: headers, data: sampleData });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pincode_template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
      XLSX.writeFile(workbook, "pincode_template.xlsx");
    }
  };

  /* ================= DOWNLOAD EXCEL ================= */
/* ================= DOWNLOAD EXCEL ================= */
const downloadExcel = () => {
  if (pincodes.length === 0) return;

  const exportData = pincodes.map(({ pincode, city, state }) => ({
    pincode,
    city,
    state,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData); // ✅ USE exportData
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
          <div className="flex gap-2">
            <button
              onClick={() => downloadTemplate('xlsx')}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-600"
            >
              <Download size={18} /> Template Excel
            </button>
            <button
              onClick={() => downloadTemplate('csv')}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-600"
            >
              <Download size={18} /> Template CSV
            </button>
            <button
              onClick={downloadExcel}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-600"
            >
              <Download size={18} /> Download Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8 space-y-6">
          {/* ADD PINCODE */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <input
              value={newPincode}
              onChange={(e) => {
                setNewPincode(e.target.value);
                setError(null);
              }}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
            />
            <input
              value={newCity}
              onChange={(e) => {
                setNewCity(e.target.value);
                setError(null);
              }}
              placeholder="Enter city"
              className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
            />
            <input
              value={newState}
              onChange={(e) => {
                setNewState(e.target.value);
                setError(null);
              }}
              placeholder="Enter state"
              className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
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
          </div>
          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

          <hr />

          {/* FILE UPLOAD */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Bulk Upload (CSV/Excel)</h3>
              <p className="text-sm text-slate-500">
                Upload a CSV or Excel file with columns: <b>pincode</b>, <b>city</b>, <b>state</b>
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="block text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-[#8ed26b] file:text-white hover:file:bg-[#76c65a]"
            />
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={16} /> Uploading pincodes...
            </div>
          )}

          {uploadResult && (
            <div className={`border rounded-xl p-4 text-sm ${uploadResult.errors.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`font-semibold ${uploadResult.errors.length > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                {uploadResult.errors.length > 0 ? '⚠️ Upload Partially Successful' : '✅ Upload Successful'}
              </p>
              <p className={`${uploadResult.errors.length > 0 ? 'text-yellow-600' : 'text-green-600'} mt-1`}>
                {uploadResult.inserted} new pincodes saved out of {uploadResult.total}
              </p>
              {uploadResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold text-yellow-700">Errors:</p>
                  <ul className="list-disc list-inside text-yellow-600">
                    {uploadResult.errors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <hr />

          {/* SEARCH */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by pincode, city, or state"
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
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-2xl border animate-pulse" />
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
                    <div>
                      <span className="font-bold text-lg">{p.pincode}</span>
                      <p className="text-sm text-slate-600">{p.city}, {p.state}</p>
                    </div>
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