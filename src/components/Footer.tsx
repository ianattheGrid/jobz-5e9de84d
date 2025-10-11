import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-primary [&]:!text-primary text-xl font-bold">Jobz</h3>
            <p className="text-sm text-muted-foreground">
              The future of hiring. No per-hire gravity.
            </p>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/employer" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/employer" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/employer" className="text-muted-foreground hover:text-primary transition-colors">
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* For Candidates */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">For Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/candidate" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/candidate" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/candidate" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Jobz. All rights reserved.
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
