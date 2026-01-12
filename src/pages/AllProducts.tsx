import FeaturedCarCard from "@/components/cars/FeaturedCarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useGetAllCarQuery } from "@/redux/api/carApi";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

const AllProducts = () => {
  const { data } = useGetAllCarQuery(undefined);
  const cardata = data?.data;
  const navigate = useNavigate();

  // State for filters
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState(false);
  const [UnAvailability, setUnAvailability] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered data
  const filteredCars = cardata?.filter((car: any) => {
    const matchesPrice =
      car.price >= priceRange[0] && car.price <= priceRange[1];
    const matchesModel = model
      ? car.model.toLowerCase().includes(model.toLowerCase())
      : true;
    const matchesBrand = brand
      ? car.brand.toLowerCase() === brand.toLowerCase()
      : true;
    const matchesCategory = category
      ? car.category.toLowerCase() === category.toLowerCase()
      : true;
    const matchesAvailability = availability
      ? car.inStock === availability
      : true;
    const matchesUnAvailability = UnAvailability
      ? car.inStock !== UnAvailability
      : true;
    const matchesSearchQuery = searchQuery
      ? car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return (
      matchesPrice &&
      matchesModel &&
      matchesBrand &&
      matchesCategory &&
      matchesAvailability &&
      matchesUnAvailability &&
      matchesSearchQuery
    );
  });

  // Handle car click with authentication check
  const handleCarClick = (carId: string) => {
    if (isAuthenticated()) {
      navigate(`/cars/${carId}`);
    } else {
      navigate("/signin", { state: { from: `/cars/${carId}` } });
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-end mt-8 me-16">
        <div className="flex w-full max-w-sm items-center space-x-2 mb-8">
          <Input
            type="text"
            placeholder="Search by brand, model, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="button" onClick={() => setSearchQuery("")}>
            Clear
          </Button>
        </div>
      </div>

      <div className="flex px-16">
        {/* Filters Section */}
        <div className="flex justify-center md:flex-col md:justify-start gap-4 md:gap-8 pe-8 mb-8 w-2/12 ">
          {/* Price Range Filter */}
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Price Range</label>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
              min={0}
              max={100000}
              step={1000}
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Brand</label>
            <Select onValueChange={(value) => setBrand(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Ford">Ford</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Audi">Audi</SelectItem>
                <SelectItem value="Cadillac">Cadillac</SelectItem>
                <SelectItem value="Jaguar">Jaguar</SelectItem>
                <SelectItem value="Nissan">Nissan</SelectItem>
                <SelectItem value="Ferrari">Ferrari</SelectItem>
                <SelectItem value="Mercedes">Mercedes</SelectItem>
                {/* Add more brands as needed */}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Category</label>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Coupe">Truck</SelectItem>
                <SelectItem value="Convertible">Truck</SelectItem>
                {/* Add more categories as needed */}
              </SelectContent>
            </Select>
          </div>

          {/* Model Filter */}
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Model</label>
            <Input
              type="text"
              placeholder="Enter model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          {/* Availability Filter */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold">Availability</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={availability}
                onCheckedChange={(checked) =>
                  setAvailability(checked as boolean)
                }
              />
              <label className="font-bold">In stock</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={UnAvailability}
                onCheckedChange={(checked) =>
                  setUnAvailability(checked as boolean)
                }
              />
              <label className="font-bold">Up Coming</label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-10/12 pb-12">
          {filteredCars?.map((car: any) => (
            <FeaturedCarCard
              key={car._id}
              car={car}
              onViewDetails={handleCarClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
