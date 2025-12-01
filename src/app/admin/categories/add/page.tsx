"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

/**
 * AddCategoryPage
 *
 * - 3 step form:
 *   Step 1 -> Category (new or existing) + subcategory + image + description + location
 *   Step 2 -> Service details (name, desc, images 1-3, per-type prices, features)
 *   Step 3 -> Summary + submit
 *
 * - On submit:
 *   If new category -> insert categories row and get id
 *   If existing -> reuse selected id
 *   Then insert service into services table with category_id and JSON fields
 *
 * Notes:
 * - Uses Supabase Storage buckets "category-images" and "service-images".
 *   Change bucket names to match your project if different.
 * - Uses local placeholder preview path you uploaded:
 *   /mnt/data/51a9bf9e-ef2e-4271-a7a9-c1861a6d12f0.png
 */

export default function AddCategoryPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 states
  const [addType, setAddType] = useState<"new" | "existing">("new");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryPreview, setCategoryPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Step 2 states (service)
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceImageFiles, setServiceImageFiles] = useState<File[]>([]);
  const [serviceImagePreviews, setServiceImagePreviews] = useState<string[]>([]);
  const [installationPrice, setInstallationPrice] = useState("");
  const [dismantlingPrice, setDismantlingPrice] = useState("");
  const [reassemblyPrice, setReassemblyPrice] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");

  const [isActive, setIsActive] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Data lists
  const [recentCategories, setRecentCategories] = useState<any[]>([]);

  // Unique categories (after state exists)
  const uniqueCategories = Array.from(
    new Map(recentCategories.map((c: any) => [c.category, c])).values()
  );

  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories for "existing" dropdown
  useEffect(() => {
    fetchCategories();
  }, []);

  // Populate fields when selecting an existing category
  useEffect(() => {
    if (addType === "existing" && selectedCategoryId) {
      const cat = recentCategories.find(c => c.id === selectedCategoryId);
      if (cat) {
        // Only set if the input is empty (user hasn’t typed yet)
        setCategoryDescription((prev) => prev || cat.description || "");
        setCategoryPreview((prev) => prev || cat.image_url || null);
      }
    } else if (addType === "existing" && !selectedCategoryId) {
      // Only reset if addType just changed, not on every render
      setCategoryDescription("");
      setCategoryPreview(null);
    }
  }, [selectedCategoryId, addType, recentCategories]);

  async function fetchCategories() {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from("categories")
        .select("id, category, image_url, description, location, is_active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetchCategories error:", error);
        return;
      }
      if (data) {
        setRecentCategories(data);
      }
    } finally {
      setLoadingCategories(false);
    }
  }

  /* ---------- Helpers: upload file to storage and return public URL ---------- */
  async function uploadFileGetPublicUrl(bucket: string, file: File) {
    // create unique path
    const path = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    // upload
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadErr) {
      console.error("upload error", uploadErr);
      throw uploadErr;
    }

    // get public url
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
    return urlData.publicUrl;
  }

  /* ---------- Navigation ---------- */
  function nextStep() {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (addType === "new" && newCategoryName.trim() === "") {
        newErrors.newCategoryName = "Enter a category name.";
        valid = false;
      }
      if (addType === "existing" && !selectedCategoryId) {
        newErrors.selectedCategoryId = "Select an existing category.";
        valid = false;
      }

      if (categoryDescription.trim() === "") {
        newErrors.categoryDescription = "Enter description.";
        valid = false;
      }
      if (!categoryImageFile && addType === "new") {
        newErrors.categoryImageFile = "Upload a category image.";
        valid = false;
      }
    }

    if (currentStep === 2) {
      if (serviceName.trim() === "") {
        newErrors.serviceName = "Enter service name.";
        valid = false;
      }
      if (serviceDescription.trim() === "") {
        newErrors.serviceDescription = "Enter service description.";
        valid = false;
      }
      if (serviceImageFiles.length < 1 || serviceImageFiles.length > 3) {
        newErrors.serviceImageFiles = "Upload 1 to 3 images.";
        valid = false;
      }
      if (!installationPrice && !dismantlingPrice && !reassemblyPrice) {
        newErrors.prices = "Enter at least one price.";
        valid = false;
      }

    }

    setErrors(newErrors);

    if (valid) setCurrentStep((s) => Math.min(3, s + 1));
  }

  function prevStep() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  /* ---------- Submit ---------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Determine category id: insert a new category if necessary
      let categoryId: number | null = selectedCategoryId;

      // If new category -> upload image then insert into categories table and get id
      if (addType === "new") {
        // upload categoryImageFile (if provided)
        let categoryImageUrl = categoryPreview ?? null;
        if (categoryImageFile) {
          categoryImageUrl = await uploadFileGetPublicUrl("category-images", categoryImageFile);
        }

        // Insert category via API
        const res = await fetch("/api/categories/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: newCategoryName.trim(),
            description: categoryDescription.trim(),
            image_url: categoryImageUrl,
            location: serviceLocation.trim(),
            is_active: isActive,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Insert failed");

        categoryId = data.id;
      }
      else {
        // existing selected -> use selectedCategoryId
        if (!selectedCategoryId) {
          alert("Select an existing category before submitting.");
          return;
        }
        categoryId = selectedCategoryId;
      }

      if (!categoryId) {
        throw new Error("Category ID not available.");
      }

      // Upload service images and collect URLs
      const serviceImageUrls: string[] = [];
      for (const f of serviceImageFiles) {
        const url = await uploadFileGetPublicUrl("service-images", f);
        serviceImageUrls.push(url);
      }

      // service_type field: store as JSON string (installation/dismantling/reassembly prices)
      const serviceTypeJSON = JSON.stringify({
        installation: parseFloat(installationPrice || "0"),
        dismantling: parseFloat(dismantlingPrice || "0"),
        reassembly: parseFloat(reassemblyPrice || "0"),
      });

      // Insert service row
      const { error: insertSvcErr } = await supabase.from("services").insert([
        {
          category_id: categoryId,
          service_name: serviceName.trim(),
          price: null, // main price not used; per-type pricing stored in service_type
          description: serviceDescription.trim(),
          images: serviceImageUrls,
          service_type: serviceTypeJSON,
        },
      ]);

      if (insertSvcErr) {
        throw insertSvcErr;
      }

      setSuccessMessage("Category & Service saved successfully.");
      await fetchCategories(); // refresh dropdown / recent list
      resetAll();
    } catch (err: any) {
      console.error("submit error", err);
      alert("Error saving: " + (err.message || JSON.stringify(err)));
    }
  }

  function resetAll() {
    setCurrentStep(1);
    setAddType("new");
    setNewCategoryName("");
    setSelectedCategoryId(null);
    setCategoryDescription("");
    setCategoryImageFile(null);
    setCategoryPreview("/mnt/data/51a9bf9e-ef2e-4271-a7a9-c1861a6d12f0.png");
    setServiceName("");
    setServiceDescription("");
    setServiceImageFiles([]);
    setServiceImagePreviews([]);
    setInstallationPrice("");
    setDismantlingPrice("");
    setReassemblyPrice("");
    setIsActive(true);
  }

  /* ---------- UI Helpers for previews ---------- */
  function onCategoryImagePicked(file?: File | null) {
    if (!file) {
      setCategoryImageFile(null);
      setCategoryPreview(null);
      return;
    }
    setCategoryImageFile(file);
    setCategoryPreview(URL.createObjectURL(file));
  }

  function onServiceImagesPicked(files: File[]) {
    setServiceImageFiles(files);
    const pr = files.map((f) => URL.createObjectURL(f));
    setServiceImagePreviews(pr);
  }

  /* ---------- Render Steps ---------- */
  function Step1() {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Step 1 — Category</h3>

        <div>
          <label className="block text-sm font-medium">Category Type</label>
          <select
            value={addType}
            onChange={(e) => {
              const val = e.target.value === "existing" ? "existing" : "new";
              setAddType(val);
              // reset fields when switching
              setNewCategoryName("");
              setSelectedCategoryId(null);
              setCategoryDescription("");
              setCategoryImageFile(null);
              setCategoryPreview(null);
            }}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
          >
            <option value="new">New Category</option>
            <option value="existing">Existing Category</option>
          </select>
        </div>
        {addType === "new" ? (
          <div>
            <label className="block text-sm font-medium">New Category Name</label>
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              placeholder="e.g. Living Room"
            />
            {errors.newCategoryName && <p className="text-red-500 text-sm mt-1">{errors.newCategoryName}</p>}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium">Select Existing Category</label>
            <select
              value={selectedCategoryId ?? ""}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : null;
                setSelectedCategoryId(id);
              }}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Select Category --</option>
              {uniqueCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category}
                </option>
              ))}
            </select>
            {errors.selectedCategoryId && <p className="text-red-500 text-sm mt-1">{errors.selectedCategoryId}</p>}
          </div>
        )}

        {/* Category Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            className="mt-1 w-full px-4 py-3 border rounded-lg h-28"
            placeholder="Write description..."
            readOnly={addType === "existing"}
          />
          {errors.categoryDescription && <p className="text-red-500 text-sm mt-1">{errors.categoryDescription}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category Image</label>

          <label
            className="w-full h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg 
               flex justify-center items-center cursor-pointer overflow-hidden hover:border-gray-400 transition"
          >
            {/* If preview exists, show image */}
            {categoryPreview ? (
              <img
                src={categoryPreview}
                className="w-full h-full object-cover"
              />
            ) : (
              // Upload icon + text
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                  />
                </svg>
                <p className="text-gray-400 text-sm mt-1">Upload Image</p>
                {errors.categoryImageFile && <p className="text-red-500 text-sm mt-1">{errors.categoryImageFile}</p>}

              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => onCategoryImagePicked(e.target.files?.[0] || null)}
              className="hidden"
              disabled={addType === "existing"} // Disable upload for existing
            />
          </label>
        </div>

      </div>
    );
  }

  function Step2() {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Step 2 — Service</h3>

        {/* Service Name */}
        <div>
          <label className="block text-sm font-medium">Service Name</label>
          <input
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter service name"
          />
          {errors.serviceName && <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>}
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            className="mt-1 w-full px-4 py-3 border rounded-lg h-28"
            placeholder="Service description"
          />
          {errors.serviceDescription && <p className="text-red-500 text-sm mt-1">{errors.serviceDescription}</p>}
        </div>

        {/* Service Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            value={serviceLocation || ""}
            onChange={(e) => setServiceLocation(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter location"
          />
          {errors.serviceLocation && <p className="text-red-500 text-sm mt-1">{errors.serviceLocation}</p>}
        </div>

        {/* Service Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Service Images (1-3)</label>
          <label
            className="w-full h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg 
     flex flex-col justify-center items-center cursor-pointer overflow-hidden hover:border-gray-400 transition"
          >
            {serviceImagePreviews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 w-full h-full p-2">
                {serviceImagePreviews.map((src, idx) => (
                  <img key={idx} src={src} className="h-32 object-cover rounded" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                  />
                </svg>
                <p className="text-gray-400 text-sm mt-1">Upload 1 to 3 images</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const filesArray = Array.from(e.target.files).slice(0, 3); // limit 3
                  onServiceImagesPicked(filesArray);
                }
              }}
              className="hidden"
            />
          </label>
          {errors.serviceImageFiles && (
            <p className="text-red-500 text-sm mt-1">{errors.serviceImageFiles}</p>
          )}
        </div>

        {/* Prices */}
        <div>
          <label className="block text-sm font-medium mb-2">Prices (at least one required)</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <div>
              <label className="block text-xs font-semibold mb-1">Installation</label>
              <input
                type="number"
                value={installationPrice}
                onChange={(e) => setInstallationPrice(e.target.value)}
                className="px-3 py-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Dismantling</label>
              <input
                type="number"
                value={dismantlingPrice}
                onChange={(e) => setDismantlingPrice(e.target.value)}
                className="px-3 py-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Reassembly</label>
              <input
                type="number"
                value={reassemblyPrice}
                onChange={(e) => setReassemblyPrice(e.target.value)}
                className="px-3 py-2 border rounded w-full"
              />
            </div>
          </div>
          {errors.prices && <p className="text-red-500 text-sm mt-1">{errors.prices}</p>}
        </div>

      </div>
    );
  }

  function Step3() {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Step 3 — Summary</h3>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold">Category</h4>
          <p>Type: {addType === "new" ? "New" : "Existing"}</p>
          <p>Category: {addType === "new" ? newCategoryName : (recentCategories.find(c => c.id === selectedCategoryId)?.category ?? selectedCategoryId)}</p>
          <p>Description: {categoryDescription}</p>
          {categoryPreview && <img src={categoryPreview} className="mt-2 h-28 object-cover rounded" alt="cat-preview" />}
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold">Service</h4>
          <p>Name: {serviceName}</p>
          <p>Description: {serviceDescription}</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {serviceImagePreviews.map((src, idx) => (
              <img key={idx} src={src} className="h-24 object-cover rounded" alt={`service-${idx}`} />
            ))}
            {serviceImagePreviews.length === 0 && <p className="text-gray-500 text-sm">No images uploaded</p>}
          </div>
          <p>Installation: {installationPrice}</p>
          <p>Dismantling: {dismantlingPrice}</p>
          <p>Reassembly: {reassemblyPrice}</p>
        </div>

        <div className="flex items-center gap-3">
          <label>Category Active:</label>
          <input type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-8 w-full">
      <div className="w-full rounded-xl shadow-lg mb-8 p-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <h2 className="text-3xl font-extrabold">Add New Category & Service</h2>
        <p className="text-gray-300 mt-2">Three-step flow — Category → Service → Summary</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md border h-full">
          {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}

            <div className="flex justify-between mt-4">
              {currentStep > 1 ? (
                <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-600 text-white rounded">
                  Previous
                </button>
              ) : <div />}

              {currentStep < 3 ? (
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded">
                  Next
                </button>
              ) : (
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: recent categories */}
        <div className="bg-white p-6 rounded-xl shadow-md border h-full">
          <h3 className="text-xl font-semibold mb-4">Recent categories ({recentCategories.length})</h3>

          <div className="space-y-4">
            {recentCategories.slice(0, 8).map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                <img src={c.image_url || "/mnt/data/51a9bf9e-ef2e-4271-a7a9-c1861a6d12f0.png"} alt="cat" className="w-12 h-12 object-cover rounded" />
                <div>
                  <p className="font-semibold">{c.category}</p>
                </div>
              </div>
            ))}
            {recentCategories.length === 0 && <p className="text-sm text-gray-500">No categories yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
