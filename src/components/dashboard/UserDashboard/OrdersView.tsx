import { useEffect, useState } from "react";
import { axiosProtected } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FaCar, FaCalendar, FaMoneyBillWave, FaTag } from "react-icons/fa";

// Define the Order type based on the backend interface
interface Order {
  _id: string;
  email: string;
  carId: {
    _id: string;
    title: string;
    brand: string;
    model: string;
    image: string;
    price: number;
  };
  quantity: number;
  totalprice: number;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt: string;
  notes?: string;
}

export default function OrderView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const email = user?.email;
      if (!email) return;

      const res = await axiosProtected.get(`/v1/orders/user/${email}`);
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="p-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center">
          My Orders
        </CardTitle>
      </CardHeader>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-4">
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="border-dashed border-2 mt-4">
          <CardContent className="p-10 text-center">
            <div className="text-gray-500 mb-2">
              You haven't placed any orders yet
            </div>
            <a
              href="/allProducts"
              className="text-blue-600 hover:underline font-medium"
            >
              Browse Cars
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <div className="md:flex">
                  {order.carId?.image && (
                    <div className="md:w-1/4 h-auto">
                      <img
                        src={order.carId.image}
                        alt={order.carId.title || "Car"}
                        className="h-full w-full object-cover md:max-h-40"
                      />
                    </div>
                  )}

                  <div className="p-6 md:w-3/4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">
                        {order.carId?.title || "Car Order"}
                      </h3>
                      <Badge
                        variant={
                          order.paymentStatus === "completed"
                            ? "success"
                            : "default"
                        }
                      >
                        {order.paymentStatus || "Processed"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCar className="text-gray-400" />
                        <span>
                          {order.carId?.brand} {order.carId?.model}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaTag className="text-gray-400" />
                        <span>Quantity: {order.quantity}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-gray-400" />
                        <span className="font-semibold">
                          ${order.totalprice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {order.notes && (
                      <p className="text-yellow-600 text-sm border-t pt-2 mt-2">
                        {order.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
