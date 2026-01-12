import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { axiosPublic } from "@/lib/axios";
import {
  FaCar,
  FaGasPump,
  FaRoad,
  FaCalendarAlt,
  FaPalette,
  FaCog,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCartPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { PageLoading } from "@/components/ui/page-loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axiosPublic.get(`/v1/cars/${id}`);
        setCar(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch car details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (car?.data) {
      setAddingToCart(true);

      setTimeout(() => {
        const { _id, title, brand, model, price, image } = car.data;
        dispatch(
          addToCart({
            id: _id,
            title,
            brand,
            model,
            image,
            price,
            quantity: 1,
          })
        );
        setAddingToCart(false);
        toast.success("Added to cart!");
      }, 500);
    }
  };

  const handleBuyNow = () => {
    if (car?.data) {
      setAddingToCart(true);

      const { _id, title, brand, model, price, image } = car.data;

      // Directly dispatch without the timeout to ensure it happens before navigation
      dispatch(
        addToCart({
          id: _id,
          title,
          brand,
          model,
          image,
          price,
          quantity: 1,
        })
      );

      setAddingToCart(false);
      toast.success("Added to cart!");

      // Now navigate to the cart page
      navigate("/cart");
    }
  };

  if (loading) {
    return <PageLoading message="Loading car details..." />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">Error</div>
        <p className="text-gray-600">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const {
    title,
    subtitle,
    description,
    price,
    image,
    features,
    brand,
    model,
    year,
    mileage,
    fuelType,
    transmission,
    location,
    color,
    inStock,
    quantity,
  } = car.data;

  const isOutOfStock = !inStock || quantity === 0;

  return (
    <div className="pt-12 pb-16 bg-gray-100">
      <LoadingOverlay isLoading={addingToCart} text="Adding to cart..." />

      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <Card className="overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src={image}
                  alt={title}
                  className={`w-full h-auto object-cover border-8 rounded-3xl rounded-tl-none ${
                    isOutOfStock ? "opacity-70" : ""
                  }`}
                />
                {isOutOfStock && (
                  <Badge
                    variant="destructive"
                    className="absolute top-4 right-4 text-white font-bold px-3 py-2 text-lg"
                  >
                    Out of Stock
                  </Badge>
                )}
              </div>
              <div className="p-10">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{description}</p>
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {title}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {isOutOfStock && (
                  <Alert variant="destructive" className="mb-4">
                    <FaExclamationTriangle className="h-4 w-4" />
                    <AlertTitle>Out of Stock</AlertTitle>
                    <AlertDescription>
                      This item is currently unavailable for purchase. Please
                      check back later or browse other vehicles.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center space-x-2">
                  <FaCar className="text-gray-500" />
                  <span className="font-semibold">
                    {brand} {model}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>Year: {year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRoad className="text-gray-500" />
                  <span>Mileage: {mileage}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGasPump className="text-gray-500" />
                  <span>Fuel Type: {fuelType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCog className="text-gray-500" />
                  <span>Transmission: {transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaPalette className="text-gray-500" />
                  <span>Color: {color}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span>Location: {location}</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mt-2 mb-2">Features</h3>
                  <ScrollArea className="max-h-32 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500 rounded-md p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {features &&
                        features.map((feature: string, index: number) => (
                          <Badge key={index} className="gap-2">
                            <FaCheckCircle className="text-green-500" />
                            {feature}
                          </Badge>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-3xl font-semibold">${price}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <FaCartPlus className="mr-2" /> Add to Cart
                  </Button>
                  <Button onClick={handleBuyNow} disabled={isOutOfStock}>
                    {isOutOfStock ? "Out of Stock" : "Buy Now"}
                  </Button>
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
