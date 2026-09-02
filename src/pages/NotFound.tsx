import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn't find that page.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
