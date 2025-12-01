"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil, Trash2 } from "lucide-react";

type ServiceItem = {
    id: number;
    category: string;
    subcategory: string;
    service_name: string;
    image_url?: string | null;
    installation_price?: number | null;
    dismantling_price?: number | null;
    repair_price?: number | null;
};

type Subcategory = {
    id: number;
    category: string;
    subcategory: string;
};

export default function ServicesAdminPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterSubcategory, setFilterSubcategory] = useState("All");

    const [serviceName, setServiceName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subcatName, setSubcatName] = useState("");
    const [installationPrice, setInstallationPrice] = useState<number | "">(0);
    const [dismantlingPrice, setDismantlingPrice] = useState<number | "">(0);
    const [repairPrice, setRepairPrice] = useState<number | "">(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ServiceItem | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [serviceCategory, setServiceCategory] = useState("");
    const [serviceSubcategory, setServiceSubcategory] = useState("");
    const [serviceImage, setServiceImage] = useState<File | null>(null);

    // Fetch services
    const fetchServices = async (
        q: string = "",
        catFilter: string = "All",
        subFilter: string = "All"
    ) => {
        setLoading(true);
        let query = supabase.from("services").select("*").order("id", { ascending: false });

        if (q.trim()) query = query.ilike("service_name", `%${q}%`);
        if (catFilter !== "All") query = query.eq("category", catFilter);
        if (subFilter !== "All") query = query.eq("subcategory", subFilter);

        const { data } = await query;
        setServices(data || []);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("category");
        setCategories(data?.map((c) => c.category) || []);
    };

    const fetchSubcategories = async () => {
        const { data } = await supabase.from("subcategories").select("id, category, subcategory");
        setSubcategories(data || []);
    };

    useEffect(() => {
        fetchServices();
        fetchCategories();
        fetchSubcategories();
    }, []);

    const convertToBase64 = (file: File) =>
        new Promise<string | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string | null);
            reader.onerror = reject;
        });

    // Add new service
    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName || !subcatName || !serviceName) {
            alert("Category, Subcategory, and Service name are required!");
            return;
        }
        setSubmitting(true);
        try {
            const img = imageFile ? await convertToBase64(imageFile) : preview;

            // Check duplicate
            const { data: existing } = await supabase
                .from("services")
                .select("*")
                .eq("category", categoryName)
                .eq("subcategory", subcatName)
                .eq("service_name", serviceName)
                .limit(1);

            if (existing && existing.length > 0) {
                alert("Service already exists under this subcategory!");
                setSubmitting(false);
                return;
            }

            const { error } = await supabase.from("services").insert([
                {
                    category: categoryName,
                    subcategory: subcatName,
                    service_name: serviceName,
                    image_url: img,
                    installation_price: installationPrice,
                    dismantling_price: dismantlingPrice,
                    repair_price: repairPrice,
                },
            ]);

            if (error) throw error;

            setCategoryName("");
            setSubcatName("");
            setServiceName("");
            setInstallationPrice(0);
            setDismantlingPrice(0);
            setRepairPrice(0);
            setImageFile(null);
            setPreview(null);

            fetchServices();
            alert("Service added successfully!");
        } catch (err: any) {
            console.error(err);
            alert(`Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (item: ServiceItem) => {
        setEditItem(item);
        setPreview(item.image_url || null);
        setEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>

                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition"
                >
                    + Add New Service
                </button>
            </div>

            {/* FILTERS + SEARCH */}
            <div className="flex items-center gap-3 mb-6 w-full flex-wrap">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        fetchServices(e.target.value, filterCategory, filterSubcategory);
                    }}
                    className="flex-1 min-w-[150px] px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                />

                {/* Category Filter */}
                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        fetchServices(search, e.target.value, filterSubcategory);
                    }}
                    className="flex-1 min-w-[150px] px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="All">All Categories</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Subcategory Filter */}
                <select
                    value={filterSubcategory}
                    onChange={(e) => {
                        setFilterSubcategory(e.target.value);
                        fetchServices(search, filterCategory, e.target.value);
                    }}
                    className="flex-1 min-w-[150px] px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="All">All Subcategories</option>
                    {Array.from(new Set(subcategories.map((sc) => sc.subcategory))).map((sub, idx) => (
                        <option key={idx} value={sub}>
                            {sub}
                        </option>
                    ))}
                </select>

                {/* Total Services Count */}
                <span className="flex-1 min-w-[150px] px-3 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-center">
                    Total: {loading ? "..." : services.length}
                </span>
            </div>



            {/* SERVICES TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Category</th>
                            <th className="border px-4 py-2">Subcategory</th>
                            <th className="border px-4 py-2">Service Name</th>
                            <th className="border px-4 py-2">Installation Price</th>
                            <th className="border px-4 py-2">Dismantling Price</th>
                            <th className="border px-4 py-2">Repair Price</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                            <tr key={s.id}>
                                <td className="border px-4 py-2">{s.category}</td>
                                <td className="border px-4 py-2">{s.subcategory}</td>
                                <td className="border px-4 py-2">{s.service_name}</td>
                                <td className="border px-4 py-2">{s.installation_price || "-"}</td>
                                <td className="border px-4 py-2">{s.dismantling_price || "-"}</td>
                                <td className="border px-4 py-2">{s.repair_price || "-"}</td>
                                <td className="border px-4 py-2 flex justify-between items-center">
                                    <button
                                        onClick={() => openEditModal(s)}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    >
                                        <Pencil size={16} /> Edit
                                    </button>

                                    <button
                                        onClick={async () => {
                                            if (!confirm("Delete this service?")) return;
                                            setDeletingId(s.id);
                                            try {
                                                const { error } = await supabase.from("services").delete().eq("id", s.id);
                                                if (error) throw error;
                                                fetchServices(search, filterCategory, filterSubcategory);
                                                alert("Deleted successfully!");
                                            } catch (err: any) {
                                                alert(`Delete failed: ${err.message}`);
                                            } finally {
                                                setDeletingId(null);
                                            }
                                        }}
                                        disabled={deletingId === s.id}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
                                    >
                                        <Trash2 size={16} /> {deletingId === s.id ? "Deleting..." : "Delete"}
                                    </button>
                                </td>

                            </tr>
                        ))}
                        {services.length === 0 && !loading && (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">
                                    No services found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {addModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setAddModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Service</h2>

                        {/* Category */}
                        <div className="flex gap-4 mb-3">
                            {/* Category */}
                            <div className="flex-1 flex flex-col">
                                <label className="font-medium text-gray-700">Category</label>
                                <select
                                    value={serviceCategory}
                                    onChange={(e) => setServiceCategory(e.target.value)}
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory */}
                            <div className="flex-1 flex flex-col">
                                <label className="font-medium text-gray-700">Subcategory</label>
                                <select
                                    value={serviceSubcategory}
                                    onChange={(e) => setServiceSubcategory(e.target.value)}
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Subcategory</option>
                                    {subcategories
                                        .filter((sc) => sc.category === serviceCategory)
                                        .map((sc) => (
                                            <option key={sc.id} value={sc.subcategory}>{sc.subcategory}</option>
                                        ))}
                                </select>
                            </div>
                        </div>


                        {/* Service Name */}
                        <label className="font-medium text-gray-700">Service Name</label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Prices */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                                <label className="font-medium text-gray-700">Installation</label>
                                <input
                                    type="number"
                                    value={installationPrice}
                                    onChange={(e) => setInstallationPrice(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700">Dismantling</label>
                                <input
                                    type="number"
                                    value={dismantlingPrice}
                                    onChange={(e) => setDismantlingPrice(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700">Repair</label>
                                <input
                                    type="number"
                                    value={repairPrice}
                                    onChange={(e) => setRepairPrice(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <label className="font-medium text-gray-700">Service Image</label>
                        <label className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 mb-3 cursor-pointer hover:border-blue-500 transition">
                            {preview ? (
                                <img src={preview} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                            ) : (
                                <span className="text-gray-400">Upload Image</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setServiceImage(file);
                                    if (file) setPreview(URL.createObjectURL(file));
                                }}
                            />
                        </label>

                        {/* Submit Button */}
                        <button
                            onClick={async () => {
                                if (!serviceCategory || !serviceSubcategory || !serviceName) {
                                    alert("Please fill required fields!");
                                    return;
                                }
                                setSubmitting(true);
                                try {
                                    const img = serviceImage ? await convertToBase64(serviceImage) : null;
                                    const { error } = await supabase.from("services").insert([
                                        {
                                            category: serviceCategory,
                                            subcategory: serviceSubcategory,
                                            service_name: serviceName,
                                            installation_price: installationPrice,
                                            dismantling_price: dismantlingPrice,
                                            repair_price: repairPrice,
                                            image_url: img,
                                        },
                                    ]);
                                    if (error) throw error;

                                    alert("Service added successfully!");
                                    setAddModalOpen(false);
                                    fetchServices(); // fetch updated list
                                } catch (err: any) {
                                    alert(err.message);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            {submitting ? "Saving..." : "Add Service"}
                        </button>
                    </div>
                </div>
            )}

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

                        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Service</h2>

                        {/* Category & Subcategory */}
                        <div className="flex gap-4 mb-3">
                            <div className="flex-1 flex flex-col">
                                <label className="font-medium text-gray-700">Category</label>
                                <select
                                    value={editItem.category}
                                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="font-medium text-gray-700">Subcategory</label>
                                <select
                                    value={editItem.subcategory}
                                    onChange={(e) => setEditItem({ ...editItem, subcategory: e.target.value })}
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    {subcategories.map((sc) => (
                                        <option key={sc.id} value={sc.subcategory}>{sc.subcategory}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Service Name */}
                        <label className="font-medium text-gray-700">Service Name</label>
                        <input
                            type="text"
                            value={editItem.service_name}
                            onChange={(e) => setEditItem({ ...editItem, service_name: e.target.value })}
                            className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Prices in grid */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700">Installation</label>
                                <input
                                    type="number"
                                    value={editItem.installation_price || 0}
                                    onChange={(e) => setEditItem({ ...editItem, installation_price: Number(e.target.value) })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700">Dismantling</label>
                                <input
                                    type="number"
                                    value={editItem.dismantling_price || 0}
                                    onChange={(e) => setEditItem({ ...editItem, dismantling_price: Number(e.target.value) })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700">Repair</label>
                                <input
                                    type="number"
                                    value={editItem.repair_price || 0}
                                    onChange={(e) => setEditItem({ ...editItem, repair_price: Number(e.target.value) })}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <label className="font-medium text-gray-700">Service Image</label>
                        <label className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 mb-3 cursor-pointer hover:border-blue-500 transition">
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
                                        if (imageFile) updatedImage = await convertToBase64(imageFile);

                                        const { error } = await supabase
                                            .from("services")
                                            .update({
                                                category: editItem.category,
                                                subcategory: editItem.subcategory,
                                                service_name: editItem.service_name,
                                                image_url: updatedImage,
                                                installation_price: editItem.installation_price,
                                                dismantling_price: editItem.dismantling_price,
                                                repair_price: editItem.repair_price,
                                            })
                                            .eq("id", editItem.id);

                                        if (error) throw error;

                                        setEditModalOpen(false);
                                        setImageFile(null);
                                        setPreview(null);
                                        fetchServices(search, filterCategory, filterSubcategory);
                                        alert("Service updated successfully!");
                                    } catch (err: any) {
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
    );
}