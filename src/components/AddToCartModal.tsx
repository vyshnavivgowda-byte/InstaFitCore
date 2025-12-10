// src/components/AddToCartModal.tsx
import React, { useState } from "react";
import { Wrench, Package, X } from "lucide-react";

// Assuming you keep the same types defined in ServicesPage
type ServiceItem = {
    id: number;
    service_name: string;
    installation_price: number | null;
    dismantling_price: number | null;
    repair_price: number | null;
};

const formatPrice = (price: number | null) =>
    price && price > 0 ? `₹${Math.floor(price)}` : null;

const PRIMARY_COLOR = "#8ED26B";
const HOVER_COLOR = "#72b852";

type AddToCartModalProps = {
    service: ServiceItem;
    isOpen: boolean;
    onClose: () => void;
    currentCartItem: { quantity: number; selected_services: string[] | null } | undefined;
    onAddToCart: (
        serviceId: number,
        selectedServices: string[],
        quantity: number
    ) => void;
};

const AddToCartModal: React.FC<AddToCartModalProps> = ({
    service,
    isOpen,
    onClose,
    currentCartItem,
    onAddToCart,
}) => {
    if (!isOpen) return null;

    // Initialize state with current cart values or defaults
    const initialServices = currentCartItem?.selected_services || [];
    const initialQuantity = currentCartItem?.quantity || 1;

    const [selectedServices, setSelectedServices] = useState<string[]>(initialServices);
    const [quantity, setQuantity] = useState<number>(initialQuantity);

    const availableServices = [
        {
            key: "installation",
            label: "Installation",
            price: service.installation_price,
            icon: Wrench,
        },
        {
            key: "dismantling",
            label: "Dismantling",
            price: service.dismantling_price,
            icon: Package,
        },
        {
            key: "repair",
            label: "Repair",
            price: service.repair_price,
            icon: Wrench, // Reuse icon
        },
    ];

    const toggleService = (key: string) => {
        setSelectedServices((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const handleSave = () => {
        if (selectedServices.length === 0) {
            alert("Please select at least one service type.");
            return;
        }
        if (quantity <= 0) {
             alert("Quantity must be at least 1.");
             return;
        }
        
        // Pass the updated selection and quantity back to the parent component
        onAddToCart(service.id, selectedServices, quantity);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Customize Services for:
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <h4 className="text-xl font-semibold mb-4 text-[${PRIMARY_COLOR}]">
                    {service.service_name}
                </h4>

                {/* Service Type Selection */}
                <div className="mb-6 space-y-3">
                    <p className="font-medium text-gray-700">Select Service Type(s):</p>
                    {availableServices.map((item) => {
                        // Only show options that have a price defined
                        if (!item.price) return null;

                        const isSelected = selectedServices.includes(item.key);
                        return (
                            <div
                                key={item.key}
                                onClick={() => toggleService(item.key)}
                                className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                    isSelected
                                        ? `border-[${PRIMARY_COLOR}] bg-[${PRIMARY_COLOR}]/10`
                                        : "border-gray-200 hover:border-gray-400"
                                }`}
                            >
                                <span className="flex items-center gap-2 font-medium">
                                    <item.icon className="w-5 h-5 text-blue-500" />
                                    {item.label}
                                </span>
                                <span className="font-bold text-lg text-green-600">
                                    {formatPrice(item.price)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Quantity Selector */}
                <div className="flex justify-between items-center mb-6 pt-4 border-t">
                    <label htmlFor="quantity" className="font-medium text-gray-700">
                        Quantity:
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={handleSave}
                    className={`w-full p-3 rounded-xl text-white font-semibold flex items-center justify-center shadow-md transition-colors ${
                        selectedServices.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : `bg-[${PRIMARY_COLOR}] hover:bg-[${HOVER_COLOR}]`
                    }`}
                    disabled={selectedServices.length === 0 || quantity <= 0}
                >
                    {currentCartItem ? "Update Cart Item" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default AddToCartModal;