"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil } from "lucide-react";

/**
 * Services Admin Page (final working)
 *
 * Important DB column assumptions:
 * - categories table: id, category, subcategory, image_url
 * - services table: id, category_id, service_name, price, description, images jsonb, features jsonb, created_at
 *
 * SQL for services (if you haven't run it):
 * create table services (
 *   id bigint generated always as identity primary key,
 *   category_id bigint not null references categories(id) on delete cascade,
 *   service_name text not null,
 *   price numeric,
 *   description text,
 *   images jsonb default '[]',
 *   features jsonb default '[]',
 *   created_at timestamp default now()
 * );
 *
 * Images are stored as base64 data URLs in the `images` jsonb array.
 */

/* local uploaded doc path (available to you) */
const uploadedDocPath = "/mnt/data/InstaFitCore Solutions Private Limited ( Website Content ).docx";

type CategoryRow = {
  id: number;
  category: string;
  subcategory: string;
  image_url?: string | null;
};

type ServiceRow = {
  id: number;
  category_id: number;
  service_name: string;
  price?: number | null;
  description?: string | null;
  images?: string[]; // multiple images stored here (base64 or URL)
  features?: Array<{ name: string; value: string }>;
  created_at?: string | null;
};

export default function ServicesAdminPage() {
  // lists
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);

  // selects
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [subcategoriesForSelected, setSubcategoriesForSelected] = useState<CategoryRow[]>([]);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string>("");

  // add form
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]); // new files chosen
  const [previews, setPreviews] = useState<string[]>([]); // object URLs for preview

  // features
  const [features, setFeatures] = useState<Array<{ name: string; value: string }>>([{ name: "", value: "" }]);

  // ui
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editService, setEditService] = useState<ServiceRow | null>(null);
  const [editServiceName, setEditServiceName] = useState("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editDescription, setEditDescription] = useState("");
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]); // images already in DB for the service
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]); // new files chosen during edit
  const [editPreviews, setEditPreviews] = useState<string[]>([]); // object URLs for newly chosen edit files
  const [editFeatures, setEditFeatures] = useState<Array<{ name: string; value: string }>>([]);
  const [serviceType, setServiceType] = useState("");

  // helpers
  const convertToBase64 = (file: File | null) =>
    new Promise<string | null>((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string | null);
      reader.onerror = (err) => reject(err);
    });

  // load initial data
  useEffect(() => {
    loadCategories();
    loadServices();
    // cleanup object URLs on unmount
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u));
      editPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from<CategoryRow>("categories").select("*").order("id", { ascending: false });
      if (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // load services
  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from<ServiceRow>("services").select("*").order("id", { ascending: false });
      if (error) {
        console.error("Error loading services:", error);
        setServices([]);
      } else {
        const normalized = (data || []).map((s: any) => ({
          ...s,
          images: s.images ?? [],
          features: s.features ?? [],
        })) as ServiceRow[];
        setServices(normalized);
      }
    } finally {
      setLoading(false);
    }
  };

  // when category name changes, set subcategories
  useEffect(() => {
    if (!selectedCategoryName) {
      setSubcategoriesForSelected([]);
      setSelectedSubcategoryName("");
      return;
    }
    const filtered = categories.filter((c) => c.category === selectedCategoryName);
    setSubcategoriesForSelected(filtered);
    setSelectedSubcategoryName("");
  }, [selectedCategoryName, categories]);

  // features helpers
  const addFeatureRow = () => setFeatures((p) => [...p, { name: "", value: "" }]);
  const removeFeatureRow = (index: number) => {
    if (features.length === 1) {
      alert("At least one feature is required");
      return;
    }
    setFeatures((p) => p.filter((_, i) => i !== index));
  };
  const updateFeature = (index: number, key: "name" | "value", val: string) =>
    setFeatures((p) => p.map((f, i) => (i === index ? { ...f, [key]: val } : f)));

  // reset add form - FIXED (no undefined references)
  const resetAddForm = () => {
    setSelectedCategoryName("");
    setSelectedSubcategoryName("");
    setServiceName("");
    setPrice("");
    setDescription("");
    setImageFiles([]);
    setPreviews([]);
    setFeatures([{ name: "", value: "" }]);
  };

  // add service submit
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryName || !selectedSubcategoryName) {
      alert("Please select Category and Subcategory.");
      return;
    }
    if (!serviceName.trim()) {
      alert("Please enter Service Name.");
      return;
    }

    // enforce images 1..7
    if (imageFiles.length < 1) {
      alert("Please select at least 1 image.");
      return;
    }
    if (imageFiles.length > 7) {
      alert("Maximum 7 images allowed.");
      return;
    }

    setSubmitting(true);
    try {
      const categoryRow = categories.find((c) => c.category === selectedCategoryName && c.subcategory === selectedSubcategoryName);
      if (!categoryRow) {
        alert("Selected category/subcategory not found.");
        setSubmitting(false);
        return;
      }

      // convert images to base64
      const base64Images = await Promise.all(imageFiles.map((f) => convertToBase64(f)));
      const preparedImages = base64Images.filter(Boolean) as string[];

      // prepare features
      const preparedFeatures = features.filter((f) => f.name.trim()).map((f) => ({ name: f.name.trim(), value: f.value.trim() }));
      const { error } = await supabase.from("services").insert([
        {
          category_id: categoryRow.id,
          service_name: serviceName.trim(),
          service_type: serviceType || null,   // <-- ADD THIS
          price: price ? Number(price) : null,
          description: description.trim() || null,
          images: preparedImages,
          features: preparedFeatures,
        },
      ]);

      if (error) {
        console.error("Insert service error:", error);
        alert("Failed to add service. See console for details.");
      } else {
        await loadServices();
        resetAddForm();
      }
    } catch (err) {
      console.error("Error while adding service:", err);
      alert("Error while adding service.");
    } finally {
      setSubmitting(false);
    }
  };

  // open edit modal
  const openEdit = (s: ServiceRow) => {
    setEditService(s);
    setEditServiceName(s.service_name);
    setEditPrice(s.price != null ? String(s.price) : "");
    setEditDescription(s.description || "");
    setEditExistingImages(s.images ? [...s.images] : []);
    setServiceType(s.service_type || "");
    setEditNewFiles([]);
    setEditPreviews([]);
    setEditFeatures(s.features && s.features.length ? JSON.parse(JSON.stringify(s.features)) : [{ name: "", value: "" }]);
    setEditOpen(true);
  };

  // handle save edit
  const handleSaveEdit = async () => {
    if (!editService) return;
    if (!editServiceName.trim()) {
      alert("Please enter service name.");
      return;
    }

    // combine retained existing images + newly added images
    // enforce 1..7 total
    const totalImagesCount = editExistingImages.length + editNewFiles.length;
    if (totalImagesCount < 1) {
      alert("At least one image is required.");
      return;
    }
    if (totalImagesCount > 7) {
      alert("Maximum 7 images allowed.");
      return;
    }

    setSubmitting(true);
    try {
      // convert new files to base64
      const newBase64 = await Promise.all(editNewFiles.map((f) => convertToBase64(f)));
      const preparedNew = newBase64.filter(Boolean) as string[];

      const finalImages = [...editExistingImages, ...preparedNew];

      const preparedFeatures = (editFeatures || []).filter((f) => f.name.trim()).map((f) => ({ name: f.name.trim(), value: f.value.trim() }));

      const { error } = await supabase.from("services").update({
        service_name: editServiceName.trim(),
        service_type: serviceType,  // <--- added
        price: editPrice ? Number(editPrice) : null,
        description: editDescription.trim() || null,
        images: finalImages,
        features: preparedFeatures,
      }).eq("id", editService.id);


      if (error) {
        console.error("Update error:", error);
        alert("Failed to update service. See console for details.");
      } else {
        await loadServices();
        setEditOpen(false);
      }
    } catch (err) {
      console.error("Error while updating service:", err);
      alert("Error while updating service.");
    } finally {
      setSubmitting(false);
    }
  };

  // delete service
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete.");
    } else {
      await loadServices();
    }
  };

  // UI helpers for editing images: remove existing or remove new preview
  const removeExistingEditImage = (index: number) => {
    setEditExistingImages((p) => p.filter((_, i) => i !== index));
  };
  const removeNewEditFile = (index: number) => {
    // revoke URL
    URL.revokeObjectURL(editPreviews[index]);
    setEditNewFiles((p) => p.filter((_, i) => i !== index));
    setEditPreviews((p) => p.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Services Management</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-6">
          {/* LEFT: Add Service Form */}
          <div className="bg-white w-[500px] rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Service</h3>

            <form onSubmit={handleAddService} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={selectedCategoryName}
                  onChange={(e) => setSelectedCategoryName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {[...new Set(categories.map((c) => c.category))].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={selectedSubcategoryName}
                  onChange={(e) => setSelectedSubcategoryName(e.target.value)}
                  disabled={!selectedCategoryName}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm"
                >
                  <option value="">Select Subcategory</option>
                  {subcategoriesForSelected.map((r) => <option key={r.id} value={r.subcategory}>{r.subcategory}</option>)}
                </select>
              </div>

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
                <input value={serviceName} onChange={(e) => setServiceName(e.target.value)} type="text" placeholder="e.g., TV Mounting" className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Installation">Installation</option>
                  <option value="Dismantling">Dismantling</option>
                  <option value="Reassembly">Reassembly</option>
                </select>
              </div>


              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (optional)</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="e.g., 499" className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description of the service" className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm" />
              </div>

              {/* Images multi */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Images</label>
                <label htmlFor="service-images" className="mt-2 relative cursor-pointer block w-full rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:bg-gray-50">
                  {previews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {previews.map((src, i) => <img key={i} src={src} className="h-24 w-full object-cover rounded-md" />)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Choose 1–7 Images (Click or Drag & Drop)</div>
                  )}

                  <input id="service-images" type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length < 1) { alert("You must select at least 1 image."); return; }
                      if (files.length > 7) { alert("Maximum allowed is 7 images."); return; }
                      setImageFiles(files);
                      const urls = files.map((f) => URL.createObjectURL(f));
                      // revoke previous previews
                      previews.forEach((u) => URL.revokeObjectURL(u));
                      setPreviews(urls);
                    }}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-400">Allows minimum 1 and maximum 7 images.</p>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <div className="mt-2 space-y-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={f.name} onChange={(e) => updateFeature(i, "name", e.target.value)} placeholder="Feature name (e.g., Warranty)" className="flex-1 px-3 py-2 border rounded-lg" />
                      <input value={f.value} onChange={(e) => updateFeature(i, "value", e.target.value)} placeholder="Value (e.g., 6 months)" className="flex-1 px-3 py-2 border rounded-lg" />
                      <button type="button" onClick={() => removeFeatureRow(i)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg">Remove</button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <button type="button" onClick={addFeatureRow} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">+ Add Feature</button>
                  </div>
                </div>
              </div>

              {/* Submit + Reset */}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">{submitting ? "Saving..." : "Save Service"}</button>
                <button type="button" onClick={resetAddForm} className="px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-50">Reset</button>
              </div>
            </form>
          </div>

          {/* RIGHT: Services list */}
          {/* RIGHT: Services list */}
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <input
                  placeholder="Search services by name..."
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={async (e) => {
                    const q = e.target.value.trim();
                    if (!q) {
                      await loadServices();
                      return;
                    }
                    setLoading(true);
                    const { data, error } = await supabase.from<ServiceRow>("services").select("*").ilike("service_name", `%${q}%`).order("id", { ascending: false });
                    if (!error) setServices((data || []).map((s: any) => ({ ...s, images: s.images ?? [], features: s.features ?? [] })));
                    setLoading(false);
                  }}
                />
              </div>
              <div className="ml-4 text-sm text-gray-600">
                <span>{loading ? "Loading..." : `${services.length} services`}</span>
              </div>
            </div>

            {/* cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {services.length === 0 && !loading ? (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border">No services found.</div>
              ) : (
                services.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col">
                    <div className="w-full h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {s.images && s.images.length > 0 ? (
                        // show first image
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.images[0]} alt={s.service_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400">No Image</div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{s.service_name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Price: {s.price != null ? `₹${s.price}` : "N/A"}</p>
                          <p className="text-xs text-gray-400 mt-2">Category ID: {s.category_id}</p>

                          {/* compact features preview */}
                          {s.features && s.features.length > 0 && (
                            <div className="text-xs text-gray-500 mt-2 leading-tight">
                              <div className="truncate"><strong>{s.features[0].name}:</strong> {s.features[0].value}</div>
                              {s.features.length > 1 && <div className="text-gray-400 truncate">+{s.features.length - 1} more</div>}
                            </div>
                          )}
                        </div>

                        <div className="text-right text-xs text-gray-400">
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <button onClick={() => openEdit(s)} className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm hover:bg-blue-200 flex items-center gap-1">
                          <Pencil size={16} /> Edit
                        </button>

                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(s.id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && editService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[800px] relative max-h-[90vh] overflow-auto">
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setEditOpen(false)}>✖</button>
            <h2 className="text-xl font-bold mb-4">Edit Service</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Service Name</label>
                <input value={editServiceName} onChange={(e) => setEditServiceName(e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Price</label>
                  <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" className="mt-1 w-full px-4 py-2 border rounded-lg" />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium">Category ID</label>
                  <input value={String(editService.category_id)} readOnly className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg" />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Installation">Installation</option>
                  <option value="Dismantling">Dismantling</option>
                  <option value="Reassembly">Reassembly</option>
                </select>
              </div>


              {/* Existing images (from DB) */}
              <div>
                <label className="block text-sm font-medium">Existing Images</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {editExistingImages.length === 0 && <div className="text-gray-500">No images</div>}
                  {editExistingImages.map((src, i) => (
                    <div key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} className="h-28 w-full object-cover rounded-md" />
                      <button type="button" onClick={() => removeExistingEditImage(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600">✖</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new images in edit */}
              <div>
                <label className="block text-sm font-medium">Add More Images (will append)</label>
                <label className="mt-2 relative cursor-pointer block w-full rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:bg-gray-50">
                  {editPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {editPreviews.map((src, i) => <img key={i} src={src} className="h-24 w-full object-cover rounded-md" />)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Choose 1–7 images in total (existing + new must be ≤ 7)</div>
                  )}

                  <input type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      // check combined count
                      if (editExistingImages.length + files.length > 7) {
                        alert("Maximum allowed images in total is 7.");
                        return;
                      }
                      // append
                      const newPreviews = files.map((f) => URL.createObjectURL(f));
                      setEditNewFiles((p) => [...p, ...files]);
                      setEditPreviews((p) => [...p, ...newPreviews]);
                    }}
                  />
                </label>
              </div>

              {/* Edit features */}
              <div>
                <label className="block text-sm font-medium">Features</label>
                <div className="mt-2 space-y-2">
                  {editFeatures.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={f.name} onChange={(e) => setEditFeatures((prev) => prev.map((p, idx) => idx === i ? { ...p, name: e.target.value } : p))} placeholder="Feature name" className="flex-1 px-3 py-2 border rounded-lg" />
                      <input value={f.value} onChange={(e) => setEditFeatures((prev) => prev.map((p, idx) => idx === i ? { ...p, value: e.target.value } : p))} placeholder="Value" className="flex-1 px-3 py-2 border rounded-lg" />
                      <button type="button" onClick={() => setEditFeatures((p) => p.filter((_, j) => j !== i))} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg">Remove</button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <button type="button" onClick={() => setEditFeatures((p) => [...p, { name: "", value: "" }])} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">+ Add Feature</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</button>
                <button onClick={() => setEditOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
