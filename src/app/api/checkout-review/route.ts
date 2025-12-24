// ------------------ Checkout: ONE payment for entire cart ------------------
const handleCheckout = useCallback(() => {
    setSubmitAttempted(true);

    if (cartItems.length === 0) {
        toast({ title: "Cart empty", description: "Add items before checkout.", variant: "destructive" });
        return;
    }

    // Validate address
    const errors = validateAddress(addressFields);
    setAddressErrors(errors); // <-- make sure errors state is updated
    const hasAddressErrors = Object.keys(errors).length > 0;

    // Validate service selection
    const invalidItems = cartItems.filter(it => !it.service || !it.selected_services?.length);
    const hasInvalidItems = invalidItems.length > 0;

    // If any errors, show messages and stop
    if (hasAddressErrors || hasInvalidItems) {
        // Show toast for missing service selections
        if (hasInvalidItems) {
            toast({ title: "Selection missing", description: "Please select service options for all items.", variant: "destructive" });
        }
        return; // Stop checkout
    }

    // All validations passed → proceed
    // Assuming "/checkout-review" is a page route (change if needed)
    router.push(`/checkout-review?cartTotal=${cartTotal.toFixed(2)}`);
}, [cartItems, cartTotal, router, toast, addressFields]);