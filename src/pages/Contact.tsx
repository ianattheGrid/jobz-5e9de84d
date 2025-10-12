import NavBar from "@/components/NavBar";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              We'd love to hear from you. Get in touch with us below.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Email Us</h2>
            <p className="text-muted-foreground mb-6">
              For inquiries, support, or feedback, reach out to us at:
            </p>
            <a
              href="mailto:holler@dgrid.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xl font-medium text-primary hover:text-primary/80 transition-colors"
            >
              holler@dgrid.co
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
