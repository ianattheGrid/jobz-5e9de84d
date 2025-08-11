import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Helpers for base64url encoding/decoding
const base64UrlToUint8Array = (base64Url: string) => {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
};

const uint8ArrayToBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

async function generateVapidKeys() {
  // Generate an ECDSA P-256 key pair (compatible with VAPID)
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  // Export to JWK to get x, y (public) and d (private)
  const pubJwk = (await crypto.subtle.exportKey("jwk", keyPair.publicKey)) as JsonWebKey;
  const privJwk = (await crypto.subtle.exportKey("jwk", keyPair.privateKey)) as JsonWebKey;

  if (!pubJwk.x || !pubJwk.y || !privJwk.d) throw new Error("Failed to export VAPID keys");

  // Build uncompressed public key: 0x04 || X || Y
  const xBytes = base64UrlToUint8Array(pubJwk.x);
  const yBytes = base64UrlToUint8Array(pubJwk.y);
  const publicKeyBytes = new Uint8Array(65);
  publicKeyBytes[0] = 0x04;
  publicKeyBytes.set(xBytes, 1);
  publicKeyBytes.set(yBytes, 33);

  const publicKey = uint8ArrayToBase64Url(publicKeyBytes);
  const privateKey = privJwk.d; // Already base64url

  return { publicKey, privateKey };
}

const Field = ({ label, value, onCopy, multiline = false }: { label: string; value: string; onCopy: () => void; multiline?: boolean; }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground/80">{label}</label>
    {multiline ? (
      <Textarea readOnly value={value} className="min-h-[100px]" />
    ) : (
      <Input readOnly value={value} />
    )}
    <div>
      <Button variant="outline" onClick={onCopy}>Copy</Button>
    </div>
  </div>
);

export const VapidKeyGenerator: React.FC = () => {
  const { toast } = useToast();
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    try {
      setLoading(true);
      const { publicKey, privateKey } = await generateVapidKeys();
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      toast({ title: "Keys generated", description: "Copy both values and save them as secrets next." });
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to generate keys", description: "Your browser must support Web Crypto (P-256)." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Generate VAPID Keys for Web Push</h1>
        <p className="text-sm text-foreground/70">One click to create your Public and Private keys used for browser notifications.</p>
      </div>
      <div>
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Keys"}
        </Button>
      </div>

      {publicKey && (
        <div className="space-y-4">
          <Field label="Public Key" value={publicKey} onCopy={() => { navigator.clipboard.writeText(publicKey); toast({ title: "Copied Public Key" }); }} multiline />
          <Field label="Private Key (keep secret)" value={privateKey} onCopy={() => { navigator.clipboard.writeText(privateKey); toast({ title: "Copied Private Key" }); }} multiline />
          <p className="text-sm text-foreground/70">
            Next step: paste these two values into the secure forms I’ll show here in chat to store them as Supabase secrets.
          </p>
        </div>
      )}
    </section>
  );
};

export default VapidKeyGenerator;
