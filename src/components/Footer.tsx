import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="border-t border-border pt-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Jobz. All rights reserved.
            </p>
            <p className="text-sm">
              <a 
                href="mailto:holler@dgrid.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                holler@dgrid.co
              </a>
            </p>
            <p className="text-sm">
              <a 
                href="https://dgrid.co/contribute" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contribute to theGrid
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
