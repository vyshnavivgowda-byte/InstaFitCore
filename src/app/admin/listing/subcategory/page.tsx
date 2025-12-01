"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil, Trash2 } from "lucide-react";

type SubcategoryItem = {
    id: number;
    category: string;
    subcategory: string;
    description?: string | null;
    image_url?: string | null;
};

export default function SubcategoryAdminPage() {
    const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    const [categoryName, setCategoryName] = useState("");
    const [subcatName, setSubcatName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [filterSubcategory, setFilterSubcategory] = useState("All");

    // Derived list of unique subcategory names for the filter dropdown
    const uniqueSubcategories = Array.from(
        new Set(subcategories.map((sc) => sc.subcategory))
    );

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<SubcategoryItem | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Fetch subcategories
    const fetchSubcategories = async (q: string = "", categoryFilter: string = "All", subcatFilter: string = "All") => {
        setLoading(true);

        let query = supabase.from("subcategories").select("*").order("id", { ascending: false });

        if (q.trim()) query = query.ilike("subcategory", `%${q}%`);
        if (categoryFilter !== "All") query = query.eq("category", categoryFilter);
        if (subcatFilter !== "All") query = query.eq("subcategory", subcatFilter);

        const { data } = await query;
        setSubcategories(data || []);
        setLoading(false);
    };

    // Fetch categories for dropdown
    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("category");
        setCategories(data?.map(c => c.category) || []);
    };

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
    }, []);

    const convertToBase64 = (file: File) =>
        new Promise<string | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string | null);
            reader.onerror = reject;
        });

    const handleAddSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName || !subcatName) {
            alert("Category and Subcategory name are required!");
            return;
        }
        setSubmitting(true);
        try {
            const img = imageFile ? await convertToBase64(imageFile) : preview;

            // Check duplicate subcategory under same category
            const { data: existing } = await supabase
                .from("subcategories")
                .select("*")
                .eq("category", categoryName)
                .eq("subcategory", subcatName)
                .limit(1);

            if (existing && existing.length > 0) {
                alert("Subcategory already exists under this category!");
                setSubmitting(false);
                return;
            }

            const { error } = await supabase.from("subcategories").insert([
                {
                    category: categoryName,
                    subcategory: subcatName,
                    description,
                    image_url: img,
                },
            ]);

            if (error) {
                alert(`Failed to add subcategory: ${error.message}`);
                return;
            }

            setCategoryName("");
            setSubcatName("");
            setDescription("");
            setImageFile(null);
            setPreview(null);

            fetchSubcategories();
            alert("Subcategory added successfully!");
        } catch (err) {
            console.error(err);
            alert("Unexpected error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (item: SubcategoryItem) => {
        setEditItem(item);
        setPreview(item.image_url || null);
        setEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Subcategory Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: List + Search + Filter */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div className="flex items-center gap-3 mb-4">

                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search subcategories..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    fetchSubcategories(e.target.value, filterCategory, filterSubcategory);
                                }}
                                className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 w-[300px]"
                            />

                            {/* Category Filter */}
                            <select
                                value={filterCategory}
                                onChange={(e) => {
                                    setFilterCategory(e.target.value);
                                    fetchSubcategories(search, e.target.value, filterSubcategory);
                                }}
                                className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 bg-white flex-1 min-w-[200px]"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Subcategory Filter */}
                            <select
                                value={filterSubcategory}
                                onChange={(e) => {
                                    setFilterSubcategory(e.target.value);
                                    fetchSubcategories(search, filterCategory, e.target.value);
                                }}
                                className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 bg-white flex-1 min-w-[200px]"
                            >
                                <option value="All">All Subcategories</option>
                                {Array.from(new Set(subcategories.map(sc => sc.subcategory))).map((sub, idx) => (
                                    <option key={idx} value={sub}>{sub}</option>
                                ))}
                            </select>

                        </div>

                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            Total: {loading ? "..." : subcategories.length}
                        </span>
                    </div>

                    {/* Subcategory cards */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : subcategories.length === 0 ? (
                        <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-md">
                            No subcategories found.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {subcategories.map((sc) => (
                                <div key={sc.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                        {sc.image_url ? (
                                            <img src={sc.image_url} className="w-full h-full object-cover" alt={sc.subcategory} />
                                        ) : (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <h2 className="text-lg font-semibold text-gray-800">{sc.subcategory}</h2>
                                        <p className="text-gray-500 text-sm">Category: {sc.category}</p>
                                        {sc.description && <p className="text-gray-600">{sc.description}</p>}
                                        <div className="flex mt-3 justify-between">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(sc)}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                            >
                                                <Pencil size={16} /> Edit
                                            </button>

                                            <button
                                                type="button"
                                                disabled={deletingId === sc.id}
                                                onClick={async () => {
                                                    if (confirm("Delete this subcategory?")) {
                                                        setDeletingId(sc.id);
                                                        try {
                                                            const { error } = await supabase
                                                                .from("subcategories")
                                                                .delete()
                                                                .eq("id", sc.id);
                                                            if (error) throw error;
                                                            fetchSubcategories(search, filterCategory);
                                                            alert("Subcategory deleted successfully!");
                                                        } catch (err: any) {
                                                            alert(`Delete failed: ${err.message}`);
                                                        } finally {
                                                            setDeletingId(null);
                                                        }
                                                    }
                                                }}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
                                            >
                                                <Trash2 size={16} /> {deletingId === sc.id ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Add Subcategory Form */}
                <form
                    onSubmit={handleAddSubcategory}
                    className="bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-4 h-[600px] overflow-y-auto"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Subcategory</h2>

                    {/* Category */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700">Category</label>
                        <select
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Name */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700">Subcategory Name</label>
                        <input
                            type="text"
                            value={subcatName}
                            onChange={(e) => setSubcatName(e.target.value)}
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700">Subcategory Image</label>
                        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-500 transition">
                            {preview ? (
                                <img src={preview} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
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
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Add Subcategory"}
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

                            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Subcategory</h2>

                            {/* Category */}
                            <label className="font-medium text-gray-700">Category</label>
                            <select
                                value={editItem.category}
                                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Subcategory Name */}
                            <label className="font-medium text-gray-700">Subcategory Name</label>
                            <input
                                type="text"
                                value={editItem.subcategory}
                                onChange={(e) => setEditItem({ ...editItem, subcategory: e.target.value })}
                                className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
                            />

                            {/* Description */}
                            <label className="font-medium text-gray-700">Description</label>
                            <textarea
                                value={editItem.description ?? ""}
                                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                rows={3}
                                className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
                            ></textarea>

                            {/* Image Upload */}
                            <label className="font-medium text-gray-700">Subcategory Image</label>
                            <label className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 mb-3 cursor-pointer hover:border-blue-500 transition">
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
                                        if (!editItem) return;
                                        setSubmitting(true);
                                        try {
                                            let updatedImage = editItem.image_url;

                                            if (imageFile) {
                                                updatedImage = await convertToBase64(imageFile);
                                            }

                                            // Check duplicate subcategory under same category
                                            const { data: existing } = await supabase
                                                .from("subcategories")
                                                .select("*")
                                                .eq("category", editItem.category)
                                                .eq("subcategory", editItem.subcategory)
                                                .neq("id", editItem.id)
                                                .limit(1);

                                            if (existing && existing.length > 0) {
                                                alert("Subcategory already exists under this category!");
                                                setSubmitting(false);
                                                return;
                                            }

                                            const { error } = await supabase
                                                .from("subcategories")
                                                .update({
                                                    category: editItem.category,
                                                    subcategory: editItem.subcategory,
                                                    description: editItem.description,
                                                    image_url: updatedImage,
                                                })
                                                .eq("id", editItem.id);

                                            if (error) throw error;

                                            setEditModalOpen(false);
                                            setImageFile(null);
                                            setPreview(null);
                                            fetchSubcategories(search, filterCategory);
                                            alert("Subcategory updated successfully!");
                                        } catch (err: any) {
                                            console.error(err);
                                            alert(`Update failed: ${err.message}`);
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                >
                                    {submitting ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
