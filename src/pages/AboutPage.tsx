import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Main Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-12 text-white">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">About Us</h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Welcome to DriveLux Motors – where quality, trust, and performance
            meet. We’re passionate about helping you find your dream car.
          </p>
        </div>

        {/* Shop Info */}
        <Card className="bg-white/10 border-white/20 text-white shadow-xl">
          <CardHeader>
            <CardTitle>Who We Are</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-base">
              DriveLux Motors is a premium car dealership with over a decade of
              experience in providing high-quality new and pre-owned vehicles.
              Our dedicated team is here to ensure a transparent, smooth, and
              personalized car buying experience.
            </p>
          </CardContent>
        </Card>

        {/* Mission Statement */}
        <Card className="bg-white/10 border-white/20 text-white shadow-xl">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-base">
              Our mission is simple: to redefine your car buying journey. We
              strive to deliver not only the best vehicles but also the best
              customer service — honesty, transparency, and satisfaction are our
              guiding values.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">
            Ready to find your perfect ride?
          </h2>
          <p className="text-slate-200">
            Explore our latest listings or get in touch with our friendly team
            today.
          </p>
          <Button size="lg" className="px-8 py-5 text-lg">
            <Link to={`/allProducts`}>Browse Inventory</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
