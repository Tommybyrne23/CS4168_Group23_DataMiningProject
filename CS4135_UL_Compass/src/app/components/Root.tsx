import { Outlet, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import {
  Compass,
  Map as MapIcon,
  Search,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LoginDialog } from "./LoginDialog";
import { useState } from "react";

export function Root() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#00843D] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <Compass className="size-8" />
              <div>
                <h1 className="text-xl font-bold">UL Compass</h1>
                <p className="text-xs text-green-200">Campus Navigation</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "secondary" : "ghost"}
                  className={isActive("/") ? "" : "text-white hover:bg-green-700"}
                >
                  <Compass className="size-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  variant={isActive("/map") ? "secondary" : "ghost"}
                  className={isActive("/map") ? "" : "text-white hover:bg-green-700"}
                >
                  <MapIcon className="size-4 mr-2" />
                  Map
                </Button>
              </Link>
              <Link to="/search">
                <Button
                  variant={isActive("/search") ? "secondary" : "ghost"}
                  className={isActive("/search") ? "" : "text-white hover:bg-green-700"}
                >
                  <Search className="size-4 mr-2" />
                  Search
                </Button>
              </Link>
              {isAuthenticated && (
                <Link to="/favorites">
                  <Button
                    variant={isActive("/favorites") ? "secondary" : "ghost"}
                    className={
                      isActive("/favorites") ? "" : "text-white hover:bg-green-700"
                    }
                  >
                    <Heart className="size-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" className="text-white hover:bg-green-700">
                      <User className="size-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="size-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setShowLogin(true)}
                  className="text-white hover:bg-green-700"
                >
                  <User className="size-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/") ? "" : "text-white hover:bg-green-700"}
              >
                <Compass className="size-4" />
              </Button>
            </Link>
            <Link to="/map">
              <Button
                variant={isActive("/map") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/map") ? "" : "text-white hover:bg-green-700"}
              >
                <MapIcon className="size-4" />
              </Button>
            </Link>
            <Link to="/search">
              <Button
                variant={isActive("/search") ? "secondary" : "ghost"}
                size="sm"
                className={isActive("/search") ? "" : "text-white hover:bg-green-700"}
              >
                <Search className="size-4" />
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/favorites">
                <Button
                  variant={isActive("/favorites") ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive("/favorites") ? "" : "text-white hover:bg-green-700"
                  }
                >
                  <Heart className="size-4" />
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">UL Compass</h3>
              <p className="text-sm text-slate-300">
                Your digital guide to navigating the University of Limerick campus.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.ul.ie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white"
                  >
                    UL Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ul.ie/buildings/campus-maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white"
                  >
                    Campus Maps
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.timetable.ul.ie/UA/RoomDetails.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white"
                  >
                    Room Finder
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-sm text-slate-300">
                CS4135 Software Architectures Project
                <br />
                University of Limerick, 2026
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
            2026 UL Compass. 
            <br />
            <span className="mt-2 block">
              Created by Evan Ryan, Oisin Allen, Kyle Mullane-Ndu, Thomas Byrne
            </span>
          </div>
        </div>
      </footer>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}