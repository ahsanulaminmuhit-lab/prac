import {
  ShieldCheck,
  BadgeCheck,
  Clock,
  Headphones,
  RotateCw,
  CreditCard,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
    title: "Certified Vehicles",
    description: "All our cars undergo a rigorous 150-point inspection",
  },
  {
    icon: <BadgeCheck className="w-10 h-10 text-blue-500" />,
    title: "Quality Guarantee",
    description:
      "We stand behind every vehicle we sell with a satisfaction guarantee",
  },
  {
    icon: <Clock className="w-10 h-10 text-blue-500" />,
    title: "Fast Delivery",
    description: "Enjoy quick delivery or pickup options for your convenience",
  },
  {
    icon: <Headphones className="w-10 h-10 text-blue-500" />,
    title: "24/7 Support",
    description: "Our customer service team is available around the clock",
  },
  {
    icon: <RotateCw className="w-10 h-10 text-blue-500" />,
    title: "Easy Returns",
    description: "7-day return policy if you're not completely satisfied",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-blue-500" />,
    title: "Secure Payment",
    description: "Multiple payment options with state-of-the-art security",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="mt-4 text-xl text-gray-600">
            Experience the CarShop difference with our premium services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-600 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready for your next car?</h3>
          <p className="text-lg mb-6">
            Join thousands of satisfied customers who found their perfect
            vehicle with us.
          </p>
          <button
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300"
            onClick={() => (window.location.href = "/allProducts")}
          >
            Browse Our Inventory
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
