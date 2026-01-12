import { Search, Car, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-12 h-12 text-blue-500" />,
    title: "Browse",
    description: "Search through our extensive inventory of quality vehicles",
  },
  {
    icon: <Car className="w-12 h-12 text-blue-500" />,
    title: "Select",
    description: "Choose your perfect car and customize options",
  },
  {
    icon: <CreditCard className="w-12 h-12 text-blue-500" />,
    title: "Pay",
    description: "Secure payment process with multiple options available",
  },
  {
    icon: <Truck className="w-12 h-12 text-blue-500" />,
    title: "Receive",
    description: "Fast delivery to your location or pickup from our dealership",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">
            Your journey to a new car in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="rounded-full bg-blue-100 p-4 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-4 font-bold text-blue-500">
                Step {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
