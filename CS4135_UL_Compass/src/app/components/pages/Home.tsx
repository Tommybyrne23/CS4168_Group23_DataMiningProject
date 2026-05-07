import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  MapPin,
  Search,
  Heart,
  Building2,
  Navigation,
  Info,
  ArrowRight,
} from "lucide-react";

export function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-[#00843D]">
            Welcome to UL Compass
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your digital guide to navigating the University of Limerick campus.
            Find buildings, rooms, and services with ease.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/search">
            <Button size="lg" className="bg-[#00843D] hover:bg-[#006B2D]">
              <Search className="size-5 mr-2" />
              Search Campus
            </Button>
          </Link>
          <Link to="/map">
            <Button size="lg" variant="outline">
              <MapPin className="size-5 mr-2" />
              View Map
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-[#00843D]">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-[#00843D] hover:shadow-lg transition">
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="size-6 text-[#00843D]" />
              </div>
              <CardTitle>Interactive Maps</CardTitle>
              <CardDescription>
                Explore UL's campus with detailed interactive maps showing all
                buildings and facilities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-[#00843D] hover:shadow-lg transition">
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Search className="size-6 text-[#00843D]" />
              </div>
              <CardTitle>Smart Search</CardTitle>
              <CardDescription>
                Quickly find any building, room, or service by name, code, or type
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-[#00843D] hover:shadow-lg transition">
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Navigation className="size-6 text-[#00843D]" />
              </div>
              <CardTitle>Route Finder</CardTitle>
              <CardDescription>
                Get step-by-step directions between any two locations on campus
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-[#00843D] hover:shadow-lg transition">
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Heart className="size-6 text-[#00843D]" />
              </div>
              <CardTitle>Save Favorites</CardTitle>
              <CardDescription>
                Bookmark frequently visited locations for quick access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-[#00843D] hover:shadow-lg transition">
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Info className="size-6 text-[#00843D]" />
              </div>
              <CardTitle>Detailed Information</CardTitle>
              <CardDescription>
                View capacity, amenities, opening hours, and available software for rooms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-t-4 border-t-[#00843D] hover:shadow-lg transition">
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Building2 className="size-6 text-[#00843D]" />
              </div>
              <CardTitle>Building Directory</CardTitle>
              <CardDescription>
                Browse all campus buildings with descriptions and locations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-[#00843D]">
          How UL Compass Helps You
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600">
                Find your classrooms quickly during orientation week. Search for
                rooms like "CS3004-a" and get instant directions.
              </p>
              <Link to="/search">
                <Button variant="link" className="p-0 h-auto text-[#00843D]">
                  Start exploring <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600">
                Save your office, lecture halls, and favorite cafe to quickly
                navigate your daily routine.
              </p>
              <Link to="/favorites">
                <Button variant="link" className="p-0 h-auto text-[#00843D]">
                  Manage favorites <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600">
                Discover nearby restaurants, cafes, and facilities with opening
                hours and distances.
              </p>
              <Link to="/map">
                <Button variant="link" className="p-0 h-auto text-[#00843D]">
                  View map <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl font-semibold text-[#00843D]">
          Ready to Navigate UL?
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Start exploring the University of Limerick campus today. Search for any
          location, view the interactive map, or save your favorite spots.
        </p>
        <Link to="/search">
          <Button size="lg" className="bg-[#00843D] hover:bg-[#006B2D]">
            Get Started
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}