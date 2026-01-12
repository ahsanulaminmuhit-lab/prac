
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { useGetCarQuery } from "../../redux/api/carApi";
export default function CarCard() {
    // const {car} = useAppSelector((state) => state.car);
    // console.log(car);
     const { data,  isLoading } = useGetCarQuery(undefined);
      console.log(data?.data,);
    return (

    <div className="flex flex-wrap gap-4 justify-center mt-4">   
            {
                data?.data?.map((data:any) => (
                    <Card className="w-full max-w-xs rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all ease-in-out duration-300">
      <img src="im" alt="images not font" className="h-48 w-full object-cover rounded-t-lg" />
      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold text-gray-800">{data.brand} {data.model}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{data.year} - ${data.price}</CardDescription>
        <CardDescription className="text-sm text-gray-500 mt-2">Category: {data.category}</CardDescription>
        <CardDescription className="text-sm text-gray-500 mt-2">{data.description}</CardDescription>
        <CardDescription className="text-sm text-gray-500 mt-2">Available: {data.quantity}</CardDescription>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <p className={`text-sm font-semibold ${data.inStock ? 'text-green-500' : 'text-red-500'}`}>
          {data.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </CardFooter>
    </Card>
                ))
            }
        </div>
    );
};
