import React, { useEffect } from "react";
import VapidKeyGenerator from "@/components/notifications/VapidKeyGenerator";

const PushSetup: React.FC = () => {
  useEffect(() => {
    document.title = "Generate VAPID Keys | Web Push Setup";
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Web Push Setup</h1>
        <p className="text-foreground/70">Generate keys and enable browser notifications for your site.</p>
      </header>
      <article className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <VapidKeyGenerator />
      </article>
    </main>
  );
};

export default PushSetup;
