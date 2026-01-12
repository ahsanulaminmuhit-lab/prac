import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { axiosProtected } from "@/lib/axios";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/features/cart/cartSlice";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaHome,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageLoading } from "@/components/ui/page-loading";

const OrderSuccess = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [orderProcessingWarning, setOrderProcessingWarning] = useState<
    string | null
  >(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosProtected.get(
          `/v1/orders/verify-payment/${sessionId}`
        );

        if (response.data.data.verified) {
          setVerified(true);

          // Check if there was an error creating orders
          if (response.data.data.orderError) {
            setOrderProcessingWarning(
              response.data.message ||
                "Your payment was successful, but there was an issue processing your order. Our team has been notified."
            );
          }

          setOrders(response.data.data.orders || []);

          // Clear the cart after successful purchase
          dispatch(clearCart());
        } else {
          setError("Payment verification failed");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to verify payment status"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, dispatch]);

  if (loading) {
    return <PageLoading message="Verifying your payment..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8">
          <div className="text-center">
            <div className="bg-red-100 inline-flex rounded-full p-4 mb-6">
              <FaCheckCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/cart">
                  <FaArrowLeft className="mr-2" /> Return to Cart
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">
                  <FaHome className="mr-2" /> Go to Homepage
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="p-8">
        <div className="text-center">
          <div className="bg-green-100 inline-flex rounded-full p-4 mb-6">
            <FaCheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your order has been confirmed.
          </p>

          {orderProcessingWarning && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-yellow-500" />
                <p className="font-semibold text-yellow-700">
                  Order Processing Notice
                </p>
              </div>
              <p className="text-yellow-700 text-sm">
                {orderProcessingWarning}
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                {orders.map((order, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order._id}</p>
                        <p className="text-gray-500">
                          Quantity: {order.quantity}
                        </p>
                        {order.notes && (
                          <p className="text-yellow-600 text-xs mt-1">
                            {order.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-bold">
                        ${order.totalprice.toLocaleString()}
                      </p>
                    </div>
                    {index < orders.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/allProducts">
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">
                <FaBoxOpen className="mr-2" /> View My Orders
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
