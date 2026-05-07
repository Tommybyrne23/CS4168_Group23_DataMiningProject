import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Home as HomeIcon } from "lucide-react";

export function NotFound() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-6xl font-bold text-[#003d7a] mb-4">404</div>
          <h1 className="text-3xl font-semibold mb-3">Page Not Found</h1>
          <p className="text-slate-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-[#003d7a] hover:bg-[#002d5a]">
              <HomeIcon className="size-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
