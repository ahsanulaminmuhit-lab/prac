import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { axiosProtected } from "@/lib/axios";
import { Order } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  DollarSign,
  Calendar,
  Package,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[] | undefined>();
  const [revenue, setRevenue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchRevenue();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // This will use the baseURL from axiosProtected configuration
      const res = await axiosProtected.get(`/v1/orders/all`);

      console.log("API Response:", res);

      if (res.data && res.data.data) {
        console.log("Orders data:", res.data.data);
        setOrders(res.data.data);
      } else {
        setError("Unexpected response format from server");
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      if (err.response?.status === 404) {
        setError(
          "Orders endpoint not found. Please check your API configuration."
        );
      } else {
        setError(err.response?.data?.message || "Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    try {
      // This will use the baseURL from axiosProtected configuration
      const res = await axiosProtected.get(`/v1/orders/revenue`);
      if (res.data && res.data.data !== undefined) {
        setRevenue(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch revenue:", err);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      // This will use the baseURL from axiosProtected configuration
      await axiosProtected.patch(`/v1/orders/${orderId}`, {
        status,
      });

      setOrders((prev) =>
        prev
          ? prev.map((order) =>
              order._id === orderId ? { ...order, status } : order
            )
          : []
      );
    } catch (err: any) {
      console.error("Failed to update order status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-600">Loading order data...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Orders Dashboard
        </h2>
        <p className="text-gray-600">
          Manage and track all your orders in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Revenue</p>
                <h3 className="text-2xl font-bold">${revenue}</h3>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Orders</p>
                <h3 className="text-2xl font-bold">{orders?.length || 0}</h3>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Active Customers</p>
                <h3 className="text-2xl font-bold">
                  {new Set(orders?.map((order) => order.email)).size || 0}
                </h3>
              </div>
              <Mail className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && orders?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No orders found.</p>
          </CardContent>
        </Card>
      )}

      {orders && orders.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((sale, index) => (
                    <motion.tr
                      key={sale._id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.carId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${sale.totalprice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            sale.paymentStatus === "paid"
                              ? "success"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {sale.paymentStatus || "pending"}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
