import QRCode from "react-qr-code";
import { Smartphone, Download, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QRCodeSection = () => {
  const appUrl = window.location.origin;

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Smartphone className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Take jobz With You
            </h2>
            <p className="text-xl text-muted-foreground">
              Scan the QR code to access jobz on your mobile device
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-semibold mb-6">Get instant access to:</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg">Browse jobs on the go</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg">Apply instantly from anywhere</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg">Receive real-time notifications</span>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={() => window.open('/qr-code', '_blank')}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                >
                  Get QR Code
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                <QRCode
                  value={appUrl}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Scan with your phone camera
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};