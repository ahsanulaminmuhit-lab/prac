import { Link } from "react-router-dom";
import { FaTimesCircle, FaArrowLeft, FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OrderFailed = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="p-8">
        <div className="text-center">
          <div className="bg-red-100 inline-flex rounded-full p-4 mb-6">
            <FaTimesCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8">
            We couldn't process your payment. Please try again or contact
            support if the issue persists.
          </p>

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
};

export default OrderFailed;
