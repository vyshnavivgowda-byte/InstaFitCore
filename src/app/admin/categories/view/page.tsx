"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil, Trash2, Loader2, X } from "lucide-react";

type CategoryItem = {
    id: number;
    category: string;
    subcategory: string;
    created_at?: string;
    image_url?: string | null;
    description?: string | null;
    location?: string | null;
    service_images?: any; // JSONB
    service_prices?: any; // JSONB
    is_active?: boolean;
};


export default function ViewCategoriesPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [sortFilter, setSortFilter] = useState("recent");

    // ✅ Edit Modal States
    const [editItem, setEditItem] = useState<CategoryItem | null>(null);

    // ✅ Original item for change detection
    const [originalItem, setOriginalItem] = useState<CategoryItem | null>(null);

    const [editUploading, setEditUploading] = useState(false);

    const fetchCategories = async (q = "", filter = "All", sort = "recent") => {
        try {
            setLoading(true);

            let query = supabase.from("categories").select("*");

            if (q) {
                query = query.or(`category.ilike.%${q}%,subcategory.ilike.%${q}%`);
            }

            if (filter !== "All") {
                query = query.eq("category", filter);
            }

            switch (sort) {
                case "recent":
                    query = query.order("id", { ascending: false });
                    break;
                case "early":
                    query = query.order("id", { ascending: true });
                    break;
                case "atoz":
                    query = query.order("subcategory", { ascending: true });
                    break;
            }

            const { data } = await query;
            setCategories(data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        await supabase.from("categories").delete().eq("id", id);
        setCategories(categories.filter((item) => item.id !== id));
    };

    const updateCategory = async () => {
        if (!editItem) return;

        const { id, category, subcategory, description, image_url } = editItem;

        await supabase
            .from("categories")
            .update({
                category: editItem.category,
                subcategory: editItem.subcategory,
                description: editItem.description,
                image_url: editItem.image_url,
                location: editItem.location,
                is_active: editItem.is_active,
                service_images: editItem.service_images,
                service_prices: editItem.service_prices
            })
            .eq("id", editItem.id);


        setEditItem(null);
        setOriginalItem(null);
        fetchCategories(search, filterCategory, sortFilter);
    };

    const uniqueCategories = Array.from(new Set(categories.map((i) => i.category)));

    const uploadNewImage = async (file: File) => {
        if (!editItem) return;
        const fileName = `category_${Date.now()}.jpg`;

        setEditUploading(true);

        const { data, error: uploadErr } = await supabase.storage
            .from("category-images")
            .upload(fileName, file);

        if (uploadErr) {
            console.error(uploadErr);
            setEditUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("category-images")
            .getPublicUrl(fileName);

        setEditItem({ ...editItem, image_url: urlData.publicUrl });
        setEditUploading(false);
    };

    // ✅ Check if changes were made
    const hasChanges = () => {
        if (!editItem || !originalItem) return false;

        return (
            editItem.category !== originalItem.category ||
            editItem.subcategory !== originalItem.subcategory ||
            editItem.description !== originalItem.description ||
            editItem.image_url !== originalItem.image_url
        );
    };

    return (
        <div className="py-6 px-0 max-w-7xl mx-auto">
            {/* HERO HEADER MATCHING SIDEBAR */}
            <div className="
    w-full rounded-xl shadow-lg mt-6 mb-10 p-7
    bg-gradient-to-r from-gray-800 to-gray-900 
    text-white border border-gray-700
">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* LEFT SIDE */}
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Manage Categories
                        </h2>
                        <p className="text-gray-300 mt-1 text-sm">
                            Add, edit, organize and manage all your service categories easily.
                        </p>
                    </div>

                    {/* RIGHT SIDE BADGE */}
                    <div className="flex items-center gap-3">
                        <span className="
                px-4 py-2 text-sm font-semibold rounded-lg shadow-md
                bg-white text-gray-900
            ">
                            {loading ? "Loading..." : `${categories.length} results`}
                        </span>
                    </div>

                </div>
            </div>


            {/* FILTERS */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        fetchCategories(e.target.value, filterCategory, sortFilter);
                    }}
                    placeholder="Search category or subcategory..."
                    className="flex-1 pl-4 pr-3 py-2 border rounded-xl shadow"
                />

                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        fetchCategories(search, e.target.value, sortFilter);
                    }}
                    className="px-4 py-2 border rounded-xl shadow"
                >
                    <option value="All">All Categories</option>
                    {uniqueCategories.map((cat, i) => (
                        <option key={i} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <select
                    value={sortFilter}
                    onChange={(e) => {
                        setSortFilter(e.target.value);
                        fetchCategories(search, filterCategory, e.target.value);
                    }}
                    className="px-4 py-2 border rounded-xl shadow"
                >
                    <option value="recent">Recent</option>
                    <option value="early">Early</option>
                    <option value="atoz">A → Z</option>
                </select>
            </div>

            {/* LIST */}
            {loading ? (
                <div className="text-center py-20">
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 border rounded-xl shadow-md bg-white transition hover:shadow-lg"
                        >
                            <img
                                src={item.image_url || "/no-image.png"}
                                alt="Category"
                                className="w-full h-32 object-cover rounded-lg mb-3"
                            />

                            <h3 className="font-semibold text-gray-800">
                                {item.subcategory}{" "}
                                <span className="text-gray-500">({item.category})</span>
                            </h3>

                            {item.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {item.description}
                                </p>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        setEditItem(item);
                                        setOriginalItem(item); // ✅ store original copy
                                    }}
                                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => deleteCategory(item.id)}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✏️ EDIT MODAL */}
            {editItem && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl border border-gray-200 overflow-y-auto max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-5 pb-2 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Edit Category</h3>
                            <button
                                onClick={() => {
                                    setEditItem(null);
                                    setOriginalItem(null);
                                }}
                                className="text-gray-500 hover:text-red-500 transition"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Category */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Category</label>
                                    <input
                                        value={editItem.category}
                                        onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                        className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Category name"
                                    />
                                </div>

                                {/* Subcategory */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Subcategory</label>
                                    <input
                                        value={editItem.subcategory}
                                        onChange={(e) => setEditItem({ ...editItem, subcategory: e.target.value })}
                                        className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Subcategory name"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Description</label>
                                    <textarea
                                        value={editItem.description || ""}
                                        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                        className="mt-1 w-full border border-gray-300 p-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Write description..."
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Location</label>
                                    <input
                                        value={editItem.location || ""}
                                        onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                                        className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Location"
                                    />
                                </div>

                                {/* Active */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editItem.is_active ?? true}
                                        onChange={() => setEditItem({ ...editItem, is_active: !editItem.is_active })}
                                    />
                                    <label className="text-sm font-medium text-gray-600">Active</label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Main Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files && uploadNewImage(e.target.files[0])}
                                        className="mt-2 w-full text-sm"
                                    />
                                    {editUploading && <p className="text-sm text-blue-600 mt-1">Uploading new image…</p>}
                                    {editItem.image_url && (
                                        <img
                                            src={editItem.image_url}
                                            className="w-full h-40 object-cover rounded-lg mt-3 border"
                                        />
                                    )}
                                </div>

                                {/* Service Images JSON */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Service Images (JSON)</label>
                                    <textarea
                                        value={JSON.stringify(editItem.service_images || [], null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setEditItem({ ...editItem, service_images: parsed });
                                            } catch { }
                                        }}
                                        className="mt-1 w-full border border-gray-300 p-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>

                                {/* Service Prices JSON */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Service Prices (JSON)</label>
                                    <textarea
                                        value={JSON.stringify(editItem.service_prices || {}, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setEditItem({ ...editItem, service_prices: parsed });
                                            } catch { }
                                        }}
                                        className="mt-1 w-full border border-gray-300 p-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Update Button */}
                        <button
                            onClick={updateCategory}
                            disabled={!hasChanges()}
                            className={`mt-6 w-full py-3 rounded-lg text-lg font-semibold transition-all
          ${hasChanges()
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                        >
                            Update Category
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}
