"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil } from "lucide-react";

type CategoryItem = {
  id: number;
  category: string;
  subcategory: string;
  created_at?: string;
  image_url?: string | null;
  subcategory_image_url?: string | null;
  description?: string | null;
};

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [addType, setAddType] = useState("new");
  const [selectedExisting, setSelectedExisting] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [subcategoryImageFile, setSubcategoryImageFile] = useState<File | null>(null);
  const [subcategoryPreview, setSubcategoryPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editSubcategoryPreview, setEditSubcategoryPreview] = useState<string | null>(null);
  const [editSubcategoryImageFile, setEditSubcategoryImageFile] = useState<File | null>(null);
  const [editDescription, setEditDescription] = useState("");

  // Fetch categories
  const fetchCategories = async (q = "", filter = filterCategory) => {
    try {
      setLoading(true);

      let query = supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: false });

      // SEARCH
      if (q.trim().length > 0) {
        query = query.or(`category.ilike.%${q}%,subcategory.ilike.%${q}%`);
      }

      // FILTER CATEGORY
      if (filter !== "All") {
        query = query.eq("category", filter);
      }

      const { data, error } = await query;

      if (!error) {
        setCategories(data || []);

        if (q === "" && filter === "All") {
          setAllCategories(data || []);
        }
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const uniqueCategories = Array.from(
    new Set(allCategories.map((item) => item.category))
  );

  const openEditModal = (item: CategoryItem) => {
    setEditId(item.id);
    setEditCategoryName(item.category);
    setEditSubcategoryName(item.subcategory);
    setEditPreview(item.image_url ?? null);
    setEditImageFile(null);
    setEditSubcategoryPreview(item.subcategory_image_url ?? null);
    setEditSubcategoryImageFile(null);
    setEditDescription(item.description ?? "");
    setEditModalOpen(true);
  };

  const convertToBase64 = (file: File) =>
    new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string | null);
      reader.onerror = reject;
    });

  // Update Category
  const handleUpdateCategory = async () => {
    if (!editId) return;

    try {
      let updatedImage = editPreview;
      let updatedSubcategoryImage = editSubcategoryPreview;

      if (editImageFile) {
        updatedImage = await convertToBase64(editImageFile);
      }

      if (editSubcategoryImageFile) {
        updatedSubcategoryImage = await convertToBase64(editSubcategoryImageFile);
      }

      const { error } = await supabase
        .from("categories")
        .update({
          category: editCategoryName,
          subcategory: editSubcategoryName,
          image_url: updatedImage,
          subcategory_image_url: updatedSubcategoryImage,
          description: editDescription,
        })
        .eq("id", editId);

      if (error) {
        console.error("Error updating category:", error);
        alert("Error updating category: " + error.message);
      } else {
        setEditModalOpen(false);
        fetchCategories(search);
      }
    } catch (err) {
      console.error("Unexpected error updating:", err);
      alert("Unexpected error updating category");
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subcategoryName.trim()) {
      alert("Please enter subcategory");
      return;
    }

    setSubmitting(true);

    try {
      let base64Image = preview;
      let base64SubcategoryImage = subcategoryPreview;

      if (imageFile) {
        base64Image = await convertToBase64(imageFile);
      }

      if (subcategoryImageFile) {
        base64SubcategoryImage = await convertToBase64(subcategoryImageFile);
      }

      const { error } = await supabase.from("categories").insert([
        {
          category: categoryName.trim(),
          subcategory: subcategoryName.trim(),
          image_url: base64Image,
          subcategory_image_url: base64SubcategoryImage,
          description: description.trim(),
        },
      ]);

      if (error) {
        console.error("Error adding category:", error);
        alert("Error adding category: " + error.message);
      } else {
        await fetchCategories(search);

        // Reset
        setCategoryName("");
        setSubcategoryName("");
        setImageFile(null);
        setPreview(null);
        setSubcategoryImageFile(null);
        setSubcategoryPreview(null);
        setDescription("");
        setSelectedExisting(null);
        setAddType("new");
      }
    } catch (err) {
      console.error("Unexpected error adding:", err);
      alert("Unexpected error adding category");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category: " + error.message);
      } else {
        fetchCategories(search);
      }
    } catch (err) {
      console.error("Unexpected error deleting:", err);
      alert("Unexpected error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Categories Management
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex flex-wrap items-center gap-3">

              {/* 🔍 Search Input */}
              <div className="relative flex-1 min-w-[220px]">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    fetchCategories(e.target.value, filterCategory);
                  }}
                  placeholder="Search categories or subcategories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 🏷 Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  fetchCategories(search, e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[180px]"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* 🧮 Count Badge */}
              <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                {loading ? "Loading..." : `${categories.length} results`}
              </span>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {categories.length === 0 && !loading ? (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border">
                  No categories found.
                </div>
              ) : (
                categories.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col"
                  >
                    <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                      {c.image_url ? (
                        <img
                          src={c.image_url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {c.category}
                      </h3>
                      <p className="text-sm text-gray-500">{c.subcategory}</p>
                      {c.description && (
                        <p className="text-sm text-gray-600 mt-2">{c.description}</p>
                      )}

                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg flex items-center gap-1"
                        >
                          <Pencil size={16} /> Edit
                        </button>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE: ADD CATEGORY */}
          <form onSubmit={handleAddCategory} className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>

            {/* SELECT NEW OR EXISTING */}
            <div className="mb-4">
              <label className="text-sm font-medium">Select Type</label>
              <select
                className="mt-1 w-full px-4 py-2 border rounded-lg"
                value={addType}
                onChange={(e) => {
                  setAddType(e.target.value);
                  // Reset form
                  setCategoryName("");
                  setSubcategoryName("");
                  setImageFile(null);
                  setPreview(null);
                  setSubcategoryImageFile(null);
                  setSubcategoryPreview(null);
                  setDescription("");
                  setSelectedExisting(null);
                }}
              >
                <option value="new">New Category</option>
                <option value="existing">Existing Category</option>
              </select>
            </div>

            {/* EXISTING CATEGORY DROPDOWN */}
            {addType === "existing" && (
              <div className="mb-4">
                <label className="text-sm font-medium">Choose Existing Category</label>
                <select
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                  value={selectedExisting || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedExisting(id);

                    const item = categories.find((c) => c.id === id);
                    if (item) {
                      setCategoryName(item.category);
                      setPreview(item.image_url || null);
                      setSubcategoryPreview(item.subcategory_image_url || null);
                      setDescription(item.description || "");
                    }
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* CATEGORY NAME (NEW) */}
            {addType === "new" && (
              <div className="mb-4">
                <label className="text-sm font-medium">Category Name</label>
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Living Room"
                  required={addType === "new"}
                />
              </div>
            )}

            {/* SUBCATEGORY INPUT (BOTH MODES) */}
            <div className="mb-4">
              <label className="text-sm font-medium">Subcategory</label>
              <input
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Sofa Installation"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg"
                placeholder="Description about the subcategory"
                rows={3}
              />
            </div>

            {/* CATEGORY IMAGE */}
            <div className="mb-4">
              <label className="text-sm font-medium">Category Image</label>
              <label className="block cursor-pointer border-2 border-dashed p-4 text-center rounded-lg mt-2">
                {preview ? (
                  <img src={preview} className="mx-auto h-36 object-cover rounded-md" />
                ) : (
                  <span className="text-sm text-gray-500">Choose Category Image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setImageFile(file);
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                  required={addType === "new"}
                />
              </label>
            </div>

            {/* SUBCATEGORY IMAGE */}
            <div className="mb-4">
              <label className="text-sm font-medium">Subcategory Image</label>
              <label className="block cursor-pointer border-2 border-dashed p-4 text-center rounded-lg mt-2">
                {subcategoryPreview ? (
                  <img src={subcategoryPreview} className="mx-auto h-36 object-cover rounded-md" />
                ) : (
                  <span className="text-sm text-gray-500">Choose Subcategory Image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setSubcategoryImageFile(file);
                    if (file) setSubcategoryPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategoryName("");
                  setSubcategoryName("");
                  setPreview(null);
                  setImageFile(null);
                  setSubcategoryPreview(null);
                  setSubcategoryImageFile(null);
                  setDescription("");
                  setSelectedExisting(null);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Reset
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setEditModalOpen(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Edit Category</h2>

            {/* CATEGORY IMAGE */}
            <div className="mb-4">
              <label className="block border p-2 mb-3 rounded-lg text-center cursor-pointer">
                {editPreview ? (
                  <img
                    src={editPreview}
                    className="h-40 w-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Choose Category Image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setEditImageFile(file);
                    if (file) setEditPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>

            {/* SUBCATEGORY IMAGE */}
            <div className="mb-4">
              <label className="block border p-2 mb-3 rounded-lg text-center cursor-pointer">
                {editSubcategoryPreview ? (
                  <img
                    src={editSubcategoryPreview}
                    className="h-40 w-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">Choose Subcategory Image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setEditSubcategoryImageFile(file);
                    if (file) setEditSubcategoryPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>

            <input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3"
              placeholder="Category Name"
            />

            <input
              value={editSubcategoryName}
              onChange={(e) => setEditSubcategoryName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3"
              placeholder="Subcategory"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Description"
              rows={3}
            />

            <button
              onClick={handleUpdateCategory}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
