import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/redux/features/cart/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { axiosProtected } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaCreditCard,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

// Use environment variable for the Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  // Using the typed hooks instead of the regular ones
  const { items, totalItems, totalAmount } = useAppSelector(
    (state) => state.cart
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to checkout");
      navigate("/signin");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Call your backend to create a checkout session
      const response = await axiosProtected.post(
        "/v1/orders/create-checkout-session",
        {
          items: items.map((item) => ({
            carId: item.id,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            image: item.image, // Include image for Stripe display
          })),
          email: user.email,
        }
      );

      // Access the sessionId from the correct location in the response
      const { sessionId } = response.data.data;

      if (!sessionId) {
        throw new Error("No session ID returned from the server");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        toast.error(error.message as string);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to initiate checkout"
      );
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Add some items to your cart to continue shopping.
          </p>
          <Button onClick={() => navigate("/allProducts")}>
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <LoadingOverlay
        isLoading={isProcessing}
        text="Processing your order..."
      />
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {!user && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            Please{" "}
            <Button
              variant="link"
              className="p-0 text-yellow-700 underline"
              onClick={() => navigate("/signin")}
            >
              sign in
            </Button>{" "}
            to complete your purchase.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({totalItems})</CardTitle>
              <CardDescription>
                Review your cart before checkout
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.map((item) => (
                <div key={item.id} className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                    <div className="sm:w-3/4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600">
                          {item.brand} {item.model}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <FaMinus className="h-3 w-3" />
                          </Button>
                          <Input
                            className="w-12 h-8 text-center"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                handleUpdateQuantity(item.id, value);
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <FaPlus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/allProducts")}
              >
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Button>
              <Button
                variant="destructive"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(totalAmount * 0.05).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(totalAmount * 1.05).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout}>
                <FaCreditCard className="mr-2" /> Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
