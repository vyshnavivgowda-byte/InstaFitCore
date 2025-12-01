"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";

type Category = {
    id: number;
    category: string;
    subcategory: string;
    image_url: string | null;
    subcategory_image_url: string | null;
    description: string | null;
};

type Subcategory = {
    id: number;
    name: string;
    image_url: string | null;
    category_id: number;
    description: string | null;
};

export default function CategoryPage() {
    const params = useParams();
    const categoryId = Number(params.id);

    const [category, setCategory] = useState<Category | null>(null);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: cat } = await supabase
                .from("categories")
                .select("*")
                .eq("id", categoryId)
                .single();

            setCategory(cat);

            if (cat) {
                // Fetch subcategories from NEW subcategories table
                const { data: subs } = await supabase
                    .from("subcategories")
                    .select("*")
                    .eq("category", cat.category)
                    .order("id", { ascending: true });

                setSubcategories(
                    (subs || []).map((sub) => ({
                        id: sub.id,
                        name: sub.subcategory,
                        image_url: sub.image_url,
                        category_id: sub.id,
                        description: sub.description,
                    }))
                );
            } else {
                setSubcategories([]);
            }

            setLoading(false);
        }

        load();
    }, [categoryId]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                Loading...
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                Category Not Found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --------------------------------------------- */}
            {/* CATEGORY HEADER – NO TOP SPACE */}
            {/* --------------------------------------------- */}
            <div className="relative w-full bg-white">

                {/* TOP TEXT */}
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-0 pb-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                        {category.category}
                    </h1>

                    <p className="mt-2 text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
                        {category.description || "Inspired choices for all your needs."}
                    </p>
                </div>

                {/* BANNER */}
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pb-12">
                    <div className="relative w-full h-[300px] md:h-[480px] rounded-3xl overflow-hidden shadow-xl">

                        {category.image_url ? (
                            <Image
                                src={category.image_url}
                                alt={category.category}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Image Available</span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    </div>
                </div>

            </div>


            {/* --------------------------------------------- */}
            {/* SUBCATEGORIES GRID */}
            {/* --------------------------------------------- */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-10">
                    Explore Subcategories (Category - {category.category})
                </h2>

                {subcategories.length === 0 ? (
                    <p className="text-gray-500">No subcategories available.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
                        {subcategories.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/site/services/${sub.id}?category=${encodeURIComponent(
                                    category.category
                                )}&subcategory=${encodeURIComponent(sub.name)}`}
                                className="group block"
                            >

                                {/* IMAGE ONLY INSIDE CARD */}
                                <div className="relative h-48 rounded-xl overflow-hidden shadow-md bg-gray-100">
                                    {sub.image_url ? (
                                        <Image
                                            src={sub.image_url}
                                            alt={sub.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* NAME OUTSIDE CARD */}
                                <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">
                                    {sub.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
}
