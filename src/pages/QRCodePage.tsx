import NavBar from "@/components/NavBar";
import QRCode from "react-qr-code";
import { Briefcase, Smartphone, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRCodePage() {
  const appUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Smartphone className="h-16 w-16 mx-auto text-primary mb-6" />
              <h1 className="text-4xl font-bold mb-6 text-foreground">
                Get jobz on Your Phone
              </h1>
              <p className="text-xl text-muted-foreground mb-12">
                Scan the QR code below to access jobz instantly on your mobile device
              </p>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg inline-block mb-8">
                <QRCode
                  value={appUrl}
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-muted-foreground">Use your phone camera to scan the code above</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Access jobz</h3>
                  <p className="text-muted-foreground">Open jobz directly in your mobile browser</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Add to Home Screen</h3>
                  <p className="text-muted-foreground">Save jobz to your home screen for quick access</p>
                </div>
              </div>
              
              <div className="mt-12">
                <Button 
                  onClick={() => window.open(appUrl, '_blank')}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  Open jobz Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}