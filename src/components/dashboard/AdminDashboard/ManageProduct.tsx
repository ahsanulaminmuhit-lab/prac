import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, ChangeEvent } from "react";
import { axiosProtected } from "@/lib/axios";
import { Car } from "@/types";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

// Adjusted Car interface to match the backend expectations

export default function ManageProducts() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      // Use axiosProtected for authenticated requests
      const res = await axiosProtected.get("/v1/cars");

      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCars(data);
    } catch (err) {
      toast.error("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setCarToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!carToDelete) return;

    try {
      setLoading(true);
      const response = await axiosProtected.delete(`/v1/cars/${carToDelete}`);

      if (response.data && response.status === 200) {
        toast.success("Car deleted successfully");
        await fetchCars(); // Refresh the list after delete
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      // Get the error message from the response if possible
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete car. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };

  const handleUpdate = (car: Car) => {
    setSelectedCar(car);
    setEditModalOpen(true);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (selectedCar) {
      // Convert numeric fields to numbers
      if (
        name === "year" ||
        name === "price" ||
        name === "mileage" ||
        name === "quantity"
      ) {
        const numValue = parseFloat(value) || 0;
        setSelectedCar((prev) => (prev ? { ...prev, [name]: numValue } : null));
      } else {
        setSelectedCar((prev) => (prev ? { ...prev, [name]: value } : null));
      }
    }
  };

  // Type-safe handler for category changes
  const handleCategoryChange = (
    value: "Sedan" | "SUV" | "Truck" | "Coupe" | "Convertible"
  ) => {
    if (selectedCar) {
      setSelectedCar((prev) => (prev ? { ...prev, category: value } : null));
    }
  };

  const submitUpdate = async () => {
    if (!selectedCar) return;
    setIsSubmitting(true);

    try {
      // Ensure numeric fields are numbers before sending to the backend
      const carData = {
        ...selectedCar,
        year:
          typeof selectedCar.year === "string"
            ? parseInt(selectedCar.year as string, 10)
            : selectedCar.year,
        price:
          typeof selectedCar.price === "string"
            ? parseFloat(selectedCar.price as string)
            : selectedCar.price,
        mileage:
          typeof selectedCar.mileage === "string"
            ? parseFloat(selectedCar.mileage as string)
            : selectedCar.mileage,
        quantity:
          typeof selectedCar.quantity === "string"
            ? parseInt(selectedCar.quantity as string, 10)
            : selectedCar.quantity,
      };

      // Use PUT since the server doesn't support PATCH
      const response = await axiosProtected.put(
        `/v1/cars/${selectedCar._id}`,
        carData
      );

      if (response.data && response.status === 200) {
        toast.success("Car updated successfully");
        setEditModalOpen(false);
        await fetchCars(); // Refresh the list after update
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      // Get the error message from the response if possible
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update car. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <LoadingOverlay isLoading={loading} text="Loading cars..." />

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Manage Cars
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Add, edit, or remove cars from your inventory
      </p>
      <Card className="shadow-xl w-full">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {cars.map((car) => (
                  <tr
                    key={car._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                      ${car.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {car.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {car.inStock ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />{" "}
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-4 w-4 mr-1 text-red-500" /> Out
                          of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <Button
                        onClick={() => handleUpdate(car)}
                        variant="outline"
                        className="text-blue-600 hover:bg-blue-100"
                        size="icon"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => confirmDelete(car._id)}
                        variant="destructive"
                        className="hover:bg-red-100"
                        size="icon"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Car Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-700">
              Edit Car Details
            </DialogTitle>
          </DialogHeader>
          {selectedCar && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Brand</Label>
                  <Input
                    name="brand"
                    value={selectedCar.brand}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    name="model"
                    value={selectedCar.model}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    name="year"
                    value={selectedCar.year}
                    onChange={handleEditChange}
                    type="number"
                    min="1886"
                    max={new Date().getFullYear().toString()}
                    step="1"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    name="price"
                    value={selectedCar.price}
                    onChange={handleEditChange}
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={selectedCar.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Stock</Label>
                  <Select
                    value={selectedCar.inStock ? "true" : "false"}
                    onValueChange={(value) =>
                      setSelectedCar((prev) =>
                        prev ? { ...prev, inStock: value === "true" } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">In Stock</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 text-right">
                <Button
                  onClick={submitUpdate}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-700">
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this car? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* For the edit modal - show a loading overlay when submitting */}
      {isSubmitting && (
        <LoadingOverlay isLoading={true} text="Updating car..." />
      )}
    </div>
  );
}
