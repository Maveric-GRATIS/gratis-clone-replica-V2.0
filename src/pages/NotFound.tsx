import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, Droplets, HelpCircle } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Explore GRATIS products or return home."
      />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4 max-w-lg">
          {/* Large 404 */}
          <h1 className="text-[120px] md:text-[180px] font-bold leading-none text-primary/20 select-none">
            404
          </h1>
          
          {/* Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground -mt-8 mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            Looks like this page took a wrong turn. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/rig-store">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop Products
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">Popular destinations</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/water" 
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <Droplets className="h-4 w-4" />
                Our Water
              </Link>
              <Link 
                to="/tribe" 
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
