"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  Search,
  FileText,
  Trash2,
  Mail,
  User,
  Calendar,
  Download,
  X,
} from "lucide-react";
import { useAdminToast } from "@/components/AdminToast";

type CareerApplication = {
  id: number;
  name: string;
  email: string;
  message: string | null;
  resume_url: string;
  created_at: string;
};

export default function AdminCareersPage() {
  const { addToast } = useAdminToast();

  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<CareerApplication | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ================= FETCH ================= */
  const fetchApplications = async (q = "") => {
    setLoading(true);
    try {
      let query = supabase
        .from("career_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (q.trim()) {
        query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setApplications(data || []);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    const { error } = await supabase
      .from("career_applications")
      .delete()
      .eq("id", id);

    if (error) {
      addToast(error.message, "error");
    } else {
      addToast("Application deleted", "success");
      fetchApplications(search);
    }
    setDeleteId(null);
  };

  /* ================= CLEAR SEARCH ================= */
  const clearSearch = () => {
    setSearch("");
    fetchApplications("");
  };

  /* ================= EXPORT EXCEL ================= */
  const exportToExcel = () => {
    if (applications.length === 0) {
      addToast("No data to export", "error");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Message",
      "Resume URL",
      "Created At",
    ];

    const rows = applications.map((app) => [
      app.id,
      app.name,
      app.email,
      app.message ?? "",
      app.resume_url,
      new Date(app.created_at).toLocaleString(),
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `career_applications_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Career Applications
        </h1>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-[#8ed26b] text-white px-4 py-2 rounded-xl hover:bg-[#6ebb53] shadow"
        >
          <Download size={18} />
          Export Excel
        </button>
      </div>

      {/* SEARCH + CLEAR */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchApplications(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
            />
          </div>

          <button
            onClick={clearSearch}
            disabled={!search}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <X size={16} />
            Clear
          </button>
        </div>

        <div className="text-right text-sm text-gray-600 mt-2">
          Total: {loading ? "..." : applications.length}
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-gray-500" />
                <h3 className="text-lg font-semibold">{app.name}</h3>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Mail size={16} /> {app.email}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size={16} />
                {new Date(app.created_at).toLocaleString()}
              </div>

              {app.message && (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-4 line-clamp-4">
                  {app.message}
                </p>
              )}

              <div className="mt-auto flex gap-2">
                <a
                  href={app.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#8ed26b]/20 text-[#8ed26b] px-3 py-2 rounded-lg hover:bg-[#8ed26b]/30 flex items-center justify-center gap-1"
                >
                  <FileText size={16} /> Resume
                </a>

                <button
                  onClick={() => setSelected(app)}
                  className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(app.id)}
                  disabled={deleteId === app.id}
                  className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No applications found.
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Application Details</h2>

            <p className="mb-2">
              <strong>Name:</strong> {selected.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {selected.email}
            </p>

            {selected.message && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700">{selected.message}</p>
              </div>
            )}

            <a
              href={selected.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-[#8ed26b] text-white px-4 py-2 rounded-xl hover:bg-[#6ebb53]"
            >
              <FileText size={18} />
              Open Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
