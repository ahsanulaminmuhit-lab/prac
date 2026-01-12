import { Car } from "../../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeaturedCarCardProps {
  car: Car;
  onViewDetails?: (carId: string) => void;
}

const FeaturedCarCard = ({ car, onViewDetails }: FeaturedCarCardProps) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(car._id);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div
        className="aspect-video relative overflow-hidden"
        onClick={handleViewDetails}
      >
        <img
          src={car.image}
          alt={car.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader onClick={handleViewDetails}>
        <CardTitle>{car.title}</CardTitle>
        <CardDescription>{car.subtitle}</CardDescription>
      </CardHeader>
      <CardContent onClick={handleViewDetails}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">${car.price}</span>
            <div className="space-x-2">
              <span className="text-sm text-gray-500">{car.mileage} miles</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{car.transmission}</span>
            </div>
          </div>
          <div className="h-14">
            <div className="flex flex-wrap gap-2  ">
              {car.features &&
                car.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-sm rounded-md"
                  >
                    {feature}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedCarCard;
