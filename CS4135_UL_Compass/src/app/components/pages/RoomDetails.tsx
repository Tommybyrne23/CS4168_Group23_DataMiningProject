import { useParams, Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  MapPin,
  Building2,
  Users,
  Clock,
  ArrowLeft,
  Navigation,
  Heart,
  Monitor,
} from "lucide-react";
import { fetchRoomById } from "../../data/campusApi";
import type { Room } from "../../data/campusApi";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Simple route calculation (client-side utility — no API needed)
function calculateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): { distance: number; duration: number; steps: string[] } {
  const distance =
    Math.sqrt(
      Math.pow(to.lat - from.lat, 2) + Math.pow(to.lng - from.lng, 2)
    ) * 1000;

  const duration = Math.ceil(distance / 80);

  return {
    distance: Math.round(distance),
    duration,
    steps: [
      "Start at current location",
      "Head towards the main pathway",
      "Continue straight past the Living Bridge",
      "Turn right at the main courtyard",
      "Destination will be on your left",
    ],
  };
}

export function RoomDetails() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (roomId) {
      setLoading(true);
      fetchRoomById(roomId)
        .then((r) => setRoom(r))
        .catch(() => setRoom(null))
        .finally(() => setLoading(false));
    }
  }, [roomId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-600">
        Loading room details...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">Room Not Found</h2>
            <p className="text-slate-600 mb-6">
              The room you're looking for doesn't exist in our database.
            </p>
            <Link to="/search">
              <Button>Back to Search</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites");
      return;
    }

    if (isFavorite(room.id)) {
      removeFavorite(room.id);
      toast.success("Removed from favorites");
    } else {
      addFavorite(room.id);
      toast.success("Added to favorites");
    }
  };

  const route = calculateRoute(
    { lat: 52.674, lng: -8.574 }, // Mock current location
    room.coordinates
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/search">
        <Button variant="ghost">
          <ArrowLeft className="size-4 mr-2" />
          Back to Search
        </Button>
      </Link>

      {/* Room Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <CardTitle className="text-3xl">{room.name}</CardTitle>
                <Badge className="text-base">{room.type}</Badge>
              </div>
              <p className="text-xl text-slate-600">{room.buildingFullName}</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleFavoriteToggle}
              className={isFavorite(room.id) ? "text-red-500" : ""}
            >
              <Heart
                className={`size-5 ${isFavorite(room.id) ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="size-5 text-[#00843D]" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Building</div>
                <div className="font-semibold">
                  {room.building} - {room.floor}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="size-5 text-[#00843D]" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Capacity</div>
                <div className="font-semibold">{room.capacity} people</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="size-5 text-[#00843D]" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Opening Hours</div>
                <div className="font-semibold">{room.openingHours}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="size-5 text-[#00843D]" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Coordinates</div>
                <div className="font-semibold text-sm">
                  {room.coordinates.lat.toFixed(4)}, {room.coordinates.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Software */}
      {room.software && room.software.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="size-5" />
              Available Software
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.software.map((software) => (
                <Badge key={software} variant="outline" className="text-sm">
                  {software}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Get Directions</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowRoute(!showRoute)}
              className="gap-2"
            >
              <Navigation className="size-4" />
              {showRoute ? "Hide Route" : "Show Route"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-sm text-slate-600">Distance</div>
              <div className="text-xl font-semibold">{route.distance}m</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Walking Time</div>
              <div className="text-xl font-semibold">{route.duration} min</div>
            </div>
          </div>

          {showRoute && (
            <div className="space-y-3">
              <h4 className="font-semibold">Step-by-step directions:</h4>
              <ol className="space-y-2">
                {route.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex items-center justify-center size-6 bg-[#00843D] text-white rounded-full text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="pt-0.5">{step}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <Link to="/map">
            <Button className="w-full bg-[#00843D] hover:bg-[#006B2D]">
              <MapPin className="size-4 mr-2" />
              View on Map
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
