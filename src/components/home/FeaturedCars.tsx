import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car } from "../../types";
import { Button } from "@/components/ui/button";
import FeaturedCarCard from "../cars/FeaturedCarCard";
import { axiosPublic } from "@/lib/axios";
import { isAuthenticated } from "@/lib/auth";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const FeaturedCars = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        const response = await axiosPublic.get("/v1/cars");
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          // Get all cars and randomly select 4
          const allCars = response.data.data;
          const randomCars = getRandomCars(allCars, 4);
          setFeaturedCars(randomCars);
        }
      } catch (err) {
        console.error("Error fetching featured cars:", err);
        setError("Failed to load featured cars");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  // Function to randomly select n cars from the array
  const getRandomCars = (cars: Car[], count: number): Car[] => {
    const shuffled = [...cars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Handle card click with authentication check
  const handleCarClick = (carId: string) => {
    if (isAuthenticated()) {
      navigate(`/cars/${carId}`);
    } else {
      navigate("/signin", { state: { from: `/cars/${carId}` } });
    }
  };

  return (
    <section className="py-16 bg-gray-50 relative">
      {loading && (
        <LoadingOverlay isLoading={loading} text="Loading featured cars..." />
      )}

      <div className="max-w-6xl xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover our hand-picked selection of premium vehicles
          </p>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredCars.map((car) => (
            <div key={car._id}>
              <FeaturedCarCard car={car} onViewDetails={handleCarClick} />
            </div>
          ))}

          {!loading && featuredCars.length === 0 && !error && (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">
                No featured cars available at the moment.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/allProducts">View All Cars</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
