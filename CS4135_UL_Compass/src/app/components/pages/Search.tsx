import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Search as SearchIcon, MapPin, Building2, Clock, Users, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { fetchSearch } from "../../data/campusApi";
import type { Room, Building, Service } from "../../data/campusApi";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

export function Search() {
  const [query, setQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomResults, setRoomResults] = useState<Room[]>([]);
  const [buildingResults, setBuildingResults] = useState<Building[]>([]);
  const [serviceResults, setServiceResults] = useState<Service[]>([]);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await fetchSearch(query);
      setRoomResults(results.rooms);
      setBuildingResults(results.buildings);
      setServiceResults(results.services);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Search failed. Please try again.");
      setRoomResults([]);
      setBuildingResults([]);
      setServiceResults([]);
    } finally {
      setLoading(false);
      setSearchPerformed(true);
    }
  };

  const handleFavoriteToggle = (itemId: string, type: "room" | "building" | "service") => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites");
      return;
    }

    if (isFavorite(itemId, type)) {
      removeFavorite(itemId, type);
      toast.success(`Removed from favorites`);
    } else {
      addFavorite(itemId, type);
      toast.success(`Added to favorites`);
    }
  };

  const totalResults =
    roomResults.length + buildingResults.length + serviceResults.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-[#00843D]">Search Campus</h1>
        <p className="text-slate-600">
          Find buildings, rooms, or services across the University of Limerick campus
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search for buildings, rooms, or services (e.g., CS3004-a, Kemmy, cafe)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchPerformed(false);
            }}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-[#00843D] hover:bg-[#006B2D]" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* Results */}
      {searchPerformed && query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Search Results ({totalResults})
            </h2>
          </div>

          {totalResults === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <SearchIcon className="size-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-slate-600">
                  Try searching for a different building, room code, or service
                </p>
              </CardContent>
            </Card>
          )}

          {/* Room Results */}
          {roomResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="size-5" />
                Rooms ({roomResults.length})
              </h3>
              <div className="grid gap-4">
                {roomResults.map((room) => (
                  <Card key={room.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{room.name}</CardTitle>
                            <Badge>{room.type}</Badge>
                          </div>
                          <p className="text-slate-600">{room.buildingFullName}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFavoriteToggle(room.id, "room")}
                          className={
                            isFavorite(room.id, "room") ? "text-red-500" : "text-slate-400"
                          }
                        >
                          <Heart
                            className={`size-5 ${
                              isFavorite(room.id, "room") ? "fill-current" : ""
                            }`}
                          />
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
                          onClick={() => navigate("/map", { state: { selectedRoomId: room.id } })}
                        >
                          <MapPin className="size-4 mr-2" />
                          View on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Building Results */}
          {buildingResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="size-5" />
                Buildings ({buildingResults.length})
              </h3>
              <div className="grid gap-4">
                {buildingResults.map((building) => (
                  <Card key={building.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle>{building.fullName}</CardTitle>
                            <Badge variant="outline">{building.type}</Badge>
                          </div>
                          <p className="text-slate-600">{building.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFavoriteToggle(building.id, "building")}
                          className={
                            isFavorite(building.id, "building") ? "text-red-500" : "text-slate-400"
                          }
                        >
                          <Heart
                            className={`size-5 ${
                              isFavorite(building.id, "building") ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link to="/map" state={{ selectedBuildingId: building.id }}>
                        <Button variant="outline" className="w-full">
                          View on Map
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Service Results */}
          {serviceResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="size-5" />
                Services ({serviceResults.length})
              </h3>
              <div className="grid gap-4">
                {serviceResults.map((service) => (
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
                          onClick={() => handleFavoriteToggle(service.id, "service")}
                          className={
                            isFavorite(service.id, "service") ? "text-red-500" : "text-slate-400"
                          }
                        >
                          <Heart
                            className={`size-5 ${
                              isFavorite(service.id, "service") ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="size-4" />
                        {service.openingHours}
                      </div>
                      <Link to="/map" state={{ selectedServiceId: service.id }}>
                        <Button variant="outline" className="w-full">
                          View on Map
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions when no search performed */}
      {!searchPerformed && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {["CS3004-a", "Kemmy", "Library", "CSIS", "cafe", "Engineering"].map(
              (suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  onClick={() => {
                    setQuery(suggestion);
                    // Trigger search immediately
                    setLoading(true);
                    fetchSearch(suggestion)
                      .then((results) => {
                        setRoomResults(results.rooms);
                        setBuildingResults(results.buildings);
                        setServiceResults(results.services);
                      })
                      .catch(() => {
                        setRoomResults([]);
                        setBuildingResults([]);
                        setServiceResults([]);
                      })
                      .finally(() => {
                        setLoading(false);
                        setSearchPerformed(true);
                      });
                  }}
                >
                  {suggestion}
                </Button>
              )
            )}
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Search by room code (e.g., CS3004-a, KB118, ER2-011)</p>
              <p>• Search by building name (e.g., Kemmy, CSIS, Foundation)</p>
              <p>• Search by type (e.g., lecture hall, lab, cafe)</p>
              <p>• Search for services (e.g., restaurant, cafe, sports)</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
