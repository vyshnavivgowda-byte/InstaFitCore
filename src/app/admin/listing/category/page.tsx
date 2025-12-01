"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil, Trash2 } from "lucide-react";

type CategoryItem = {
  id: number;
  category: string;
  description?: string | null;
  image_url?: string | null;
};

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [errors, setErrors] = useState<{ category?: string; description?: string; image?: string }>({});

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CategoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); // For delete loading state

  // Fetch categories
  const fetchCategories = async (q: string = "", filter: string = "All") => {
    setLoading(true);
    let query = supabase.from("categories").select("*").order("id", { ascending: false });

    if (q.trim()) {
      query = query.ilike("category", `%${q}%`);
    }

    if (filter !== "All") {
      query = query.eq("category", filter);
    }

    const { data } = await query;
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const uniqueCategories = Array.from(new Set(categories.map(c => c.category)));

  const convertToBase64 = (file: File) =>
    new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string | null);
      reader.onerror = reject;
    });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({}); // reset errors

    // Front-end validation
    if (!categoryName.trim()) {
      setErrors(prev => ({ ...prev, category: "Category name is required." }));
      setSubmitting(false);
      return;
    }
    if (!description.trim()) {
      setErrors(prev => ({ ...prev, description: "Description is required." }));
      setSubmitting(false);
      return;
    }
    if (!imageFile && !preview) {
      setErrors(prev => ({ ...prev, image: "Category image is required." }));
      setSubmitting(false);
      return;
    }

    // Check if category already exists
    const existing = categories.find(c => c.category.toLowerCase() === categoryName.trim().toLowerCase());
    if (existing) {
      setErrors(prev => ({ ...prev, category: "Category already exists." }));
      setSubmitting(false);
      return;
    }

    try {
      const catImage = imageFile ? await convertToBase64(imageFile) : preview;

      const { error } = await supabase.from("categories").insert([
        { category: categoryName, description, image_url: catImage },
      ]);

      if (error) {
        console.error("Add failed:", error);
        alert(`Failed to add category: ${error.message}`);
        return;
      }

      // Reset form
      setCategoryName("");
      setDescription("");
      setImageFile(null);
      setPreview(null);

      fetchCategories();
      alert("Category added successfully!");
    } catch (err) {
      console.error("Unexpected error during add:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const openEditModal = (item: CategoryItem) => {
    setEditItem(item);
    setPreview(item.image_url || null);
    setEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE: Search + Filter + Count + Cards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-4 gap-2">

            {/* Left Section */}
            <div className="flex items-center gap-3">

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  fetchCategories(e.target.value, filterCategory);
                }}
                className="w-[450px] px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
              />

              {/* Filter Dropdown */}
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  fetchCategories(search, e.target.value);
                }}
                className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 bg-white min-w-[250px] w-[250px]"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>

            </div>

            {/* Total Count */}
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
              Total: {loading ? "..." : categories.length}
            </span>
          </div>

          {/* CATEGORIES */}
          {loading ? (
            <p>Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-md">
              No categories found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                >
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        className="w-full h-full object-cover"
                        alt={c.category}
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">{c.category}</h2>
                    {c.description && <p className="text-gray-600">{c.description}</p>}
                    <div className="flex mt-3 justify-between">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        <Pencil size={16} /> Edit
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === c.id}
                        onClick={async () => {
                          if (confirm("Delete this category?")) {
                            setDeletingId(c.id);
                            try {
                              const { error } = await supabase
                                .from("categories")
                                .delete()
                                .eq("id", c.id);

                              if (error) {
                                alert(`Failed to delete category: ${error.message}`);
                                return;
                              }
                              fetchCategories(search, filterCategory);
                              alert("Category deleted successfully!");
                            } catch (err) {
                              alert("An unexpected error occurred. Please try again.");
                            } finally {
                              setDeletingId(null);
                            }
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
                      >
                        <Trash2 size={16} /> {deletingId === c.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Add Category Form */}
        <form
          onSubmit={handleAddCategory}
          className="bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-4 h-[600px] overflow-y-auto"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Category</h2>

          {/* Category Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category Image */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Category Image</label>
            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-500 transition">
              {preview ? (
                <img src={preview} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l3.293-3.293a1 1 0 011.414 0L12 7l4.293-4.293a1 1 0 011.414 0L21 7M3 7h18" />
                  </svg>
                  <p className="text-gray-500 text-sm mt-2">Upload Category Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add Category"}
          </button>
        </form>



        {/* ================= EDIT MODAL ================= */}
        {editModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">

              {/* Close Button */}
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Category</h2>

              {/* Category Name */}
              <label className="font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
                className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
              />

              {/* Description */}
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                value={editItem.description ?? ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
                rows={3}
                className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
              ></textarea>

              {/* Image Upload */}
              <label className="font-medium text-gray-700">Category Image</label>
              <label
                className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 mb-3 cursor-pointer hover:border-blue-500 transition"
              >
                {preview ? (
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-gray-400">Upload Image</span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] ?? null;
                    setImageFile(file);
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      let updatedImage = editItem.image_url;

                      // Convert new image if uploaded
                      if (imageFile) {
                        updatedImage = await convertToBase64(imageFile);
                      }

                      const { error } = await supabase
                        .from("categories")
                        .update({
                          category: editItem.category,
                          description: editItem.description,
                          image_url: updatedImage,
                        })
                        .eq("id", editItem.id);

                      if (error) {
                        console.error("Update failed:", error);
                        alert(`Failed to update category: ${error.message}`);
                        return;
                      }

                      setEditModalOpen(false);
                      fetchCategories(search, filterCategory);
                      alert("Category updated successfully!");
                    } catch (err) {
                      console.error("Unexpected error during update:", err);
                      alert("An unexpected error occurred. Please try again.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
