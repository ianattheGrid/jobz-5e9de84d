import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useInviteLink } from "@/hooks/useInviteLink";
import { Copy, Linkedin, MessageCircle, Users } from "lucide-react";

interface InviteLinkCardProps {
  role: "candidate" | "employer" | "vr";
  title?: string;
  description?: string;
  shareMessage?: string;
}

export const InviteLinkCard = ({
  role,
  title = "Invite someone to Jobz",
  description = "Share your link. Anyone who joins through it is credited to you.",
  shareMessage = "Join me on Jobz — Bristol jobs direct with the employer, no agency in the middle:",
}: InviteLinkCardProps) => {
  const { url, joined, loading, error } = useInviteLink(role);
  const { toast } = useToast();

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Paste it wherever you like." });
    } catch {
      toast({
        variant: "destructive",
        title: "Couldn't copy",
        description: "Select the link and copy it by hand.",
      });
    }
  };

  const whatsapp = url ? `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${url}`)}` : "#";
  const linkedin = url
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    : "#";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <Input
              readOnly
              value={loading ? "Getting your link…" : url ?? ""}
              onFocus={(e) => e.currentTarget.select()}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={copy} disabled={!url} className="gap-2">
                <Copy className="h-4 w-4" /> Copy link
              </Button>
              <Button asChild variant="outline" className="gap-2" disabled={!url}>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2" disabled={!url}>
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {joined === 0
                ? "Nobody has joined through your link yet."
                : `${joined} ${joined === 1 ? "person has" : "people have"} joined through your link.`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
