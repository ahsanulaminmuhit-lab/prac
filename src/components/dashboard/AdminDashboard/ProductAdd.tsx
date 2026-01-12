import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Car, Upload, Save } from "lucide-react";
import axios from "axios";

const categories = ["Sedan", "SUV", "Truck", "Coupe", "Convertible"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const transmissions = ["Automatic", "Manual"];

export default function AddProducts() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    title: "",
    subtitle: "",
    image: null,
    year: "",
    price: "",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    category: "Sedan",
    location: "",
    color: "",
    features: "",
    description: "",
    quantity: "",
    inStock: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files?.[0] : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (form.image) {
        const formData = new FormData();
        formData.append("image", form.image);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=18f98d5fc654a620f944bea8182d6c6c`,
          formData
        );
        imageUrl = res.data.data.url;
      }

      const productData = {
        brand: form.brand,
        model: form.model,
        title: form.title,
        subtitle: form.subtitle,
        image: imageUrl,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
        fuelType: form.fuelType,
        transmission: form.transmission,
        category: form.category,
        location: form.location,
        color: form.color,
        features: form.features.split(",").map((f) => f.trim()),
        description: form.description,
        quantity: Number(form.quantity),
        inStock: form.inStock,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/cars`,
        productData
      );
      console.log("Backend Response:", response.data);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Something went wrong while submitting the product.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Car</h2>
          <p className="text-gray-600">
            Fill in the details to add a new car to your inventory
          </p>
        </div>

        <Card className="shadow-xl w-full">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Section */}
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Toyota"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Camry"
                  />
                </div>

                {/* Specifications Section */}
                <div className="col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Specifications
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2023"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 25000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select
                    name="fuelType"
                    value={form.fuelType}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: "fuelType", value },
                      } as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select
                    name="transmission"
                    value={form.transmission}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: "transmission", value },
                      } as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Details Section */}
                <div className="col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Additional Details
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., New York"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Silver"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Features (comma-separated)</Label>
                  <Input
                    name="features"
                    value={form.features}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Bluetooth, Navigation, Sunroof"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Enter detailed description of the car..."
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    checked={form.inStock}
                    onCheckedChange={(checked) =>
                      handleChange({
                        target: { name: "inStock", checked },
                      } as any)
                    }
                  />
                  <Label>In Stock</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Car</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
