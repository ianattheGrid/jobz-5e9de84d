import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[hsl(var(--surface-2))]/70 backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="container mx-auto px-5 py-14 sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-foreground"
          >
            Jobz
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <Link
              to="/how-hiring-really-works"
              className="text-foreground/70 transition-colors hover:text-primary"
            >
              How hiring really works
            </Link>
            <a
              href="mailto:holler@dgrid.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-primary"
            >
              holler@dgrid.co
            </a>
            <a
              href="https://dgrid.co/contribute"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-primary"
            >
              Contribute to theGrid
            </a>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jobz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
