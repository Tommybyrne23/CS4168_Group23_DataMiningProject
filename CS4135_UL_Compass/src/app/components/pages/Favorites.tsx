import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart, MapPin, Building2, Users, Clock, Trash2 } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  getRoomById,
  getBuildingById,
  getServiceById,
} from "../../data/campusData";
import { toast } from "sonner";

export function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log("favorites:", favorites);

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

const parsedFavorites = safeFavorites
  .map((favoriteId: string) => {
    const [type, ...rest] = favoriteId.split(":");
    return { type, itemId: rest.join(":") };
  })
  .filter((item) => item.type && item.itemId);

const favoriteRooms = parsedFavorites
  .filter((item) => item.type === "room")
  .map((item) => getRoomById(item.itemId))
  .filter((room) => room !== undefined);

const favoriteBuildings = parsedFavorites
  .filter((item) => item.type === "building")
  .map((item) => getBuildingById(item.itemId))
  .filter((building) => building !== undefined);

const favoriteServices = parsedFavorites
  .filter((item) => item.type === "service")
  .map((item) => getServiceById(item.itemId))
  .filter((service) => service !== undefined);

  const totalFavorites =
    favoriteRooms.length +
    favoriteBuildings.length +
    favoriteServices.length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="size-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Login Required</h2>
            <p className="text-slate-600 mb-6">
              Please login to view and manage your favorite locations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRemove = (id: string, type: "room" | "building" | "service") => {
    removeFavorite(id, type);
    toast.success("Removed from favorites");
  };

  const handleViewOnMap = (
    id: string,
    type: "room" | "building" | "service"
  ) => {
    if (type === "building") {
      navigate("/map", { state: { selectedBuildingId: id } });
    } else if (type === "service") {
      navigate("/map", { state: { selectedServiceId: id } });
    } else {
      navigate("/map", { state: { selectedRoomId: id } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-[#00843D]">My Favorites</h1>
        <p className="text-slate-600">
          Quick access to your frequently visited locations
        </p>
      </div>

      {totalFavorites === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="size-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-slate-600 mb-6">
              Start adding buildings, rooms, or services to your favorites for
              quick access.
            </p>
            <Link to="/search">
              <Button className="bg-[#00843D] hover:bg-[#006B2D]">
                Search Campus
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Saved Locations ({totalFavorites})
            </h2>
          </div>

          {favoriteRooms.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="size-5" />
                Rooms ({favoriteRooms.length})
              </h3>
              <div className="grid gap-4">
                {favoriteRooms.map((room) => (
                  <Card key={room.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{room.name}</CardTitle>
                            <Badge>{room.type}</Badge>
                          </div>
                          <p className="text-slate-600">
                            {room.buildingFullName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(room.id, "room")}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Building2 className="size-4" />
                          {room.building} - {room.floor}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="size-4" />
                          Capacity: {room.capacity}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="size-4" />
                          {room.openingHours}
                        </div>
                      </div>

                      {room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 4 && (
                            <Badge variant="secondary">
                              +{room.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link to={`/room/${room.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewOnMap(room.id, "room")}
                        >
                          <MapPin className="size-4 mr-2" />
                          Show on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {favoriteBuildings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="size-5" />
                Buildings ({favoriteBuildings.length})
              </h3>
              <div className="grid gap-4">
                {favoriteBuildings.map((building) => (
                  <Card key={building.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle>{building.fullName}</CardTitle>
                            <Badge variant="outline">{building.type}</Badge>
                          </div>
                          <p className="text-slate-600">
                            {building.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(building.id, "building")}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewOnMap(building.id, "building")}
                      >
                        <MapPin className="size-4 mr-2" />
                        Show on Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {favoriteServices.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="size-5" />
                Services ({favoriteServices.length})
              </h3>
              <div className="grid gap-4">
                {favoriteServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle>{service.name}</CardTitle>
                            <Badge>{service.type}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(service.id, "service")}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="size-4" />
                        {service.openingHours}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewOnMap(service.id, "service")}
                      >
                        <MapPin className="size-4 mr-2" />
                        Show on Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-green-50 border-green-200 mt-6">
            <CardHeader>
              <CardTitle>Favorites Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                • Save your most visited buildings, rooms, and services for
                quick access
              </p>
              <p>
                • Your favorites are saved to your account and sync across
                devices
              </p>
              <p>• Click the heart icon on any item to add it to favorites</p>
              <p>• Remove items by clicking the trash icon</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}