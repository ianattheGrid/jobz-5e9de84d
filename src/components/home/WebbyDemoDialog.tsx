import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WebbyDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WebbyDemoDialog = ({ open, onOpenChange }: WebbyDemoDialogProps) => {
  const navigate = useNavigate();

  const handleTryWebby = () => {
    onOpenChange(false);
    navigate('/webby-candidate');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-[#1a0a15] via-[#2d1028] to-[#150a1a] border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            See How <span className="text-primary">Webby</span> Works
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="hiring" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm">
            <TabsTrigger 
              value="hiring"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.4)] text-white/70"
            >
              I'm Hiring
            </TabsTrigger>
            <TabsTrigger 
              value="looking"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.4)] text-white/70"
            >
              I'm Looking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hiring" className="mt-6 space-y-4">
            {/* Employer Message */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-white/10">
                <p className="text-white/90 text-sm leading-relaxed">
                  "My engineering team is brilliant but we keep building features nobody uses. We need someone who thinks differently."
                </p>
              </div>
            </div>

            {/* Webby Response 1 */}
            <div className="flex gap-3 items-start justify-end">
              <div className="bg-primary/20 backdrop-blur-sm rounded-2xl rounded-tr-none p-4 max-w-[80%] border border-primary/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <p className="text-white/90 text-sm leading-relaxed">
                  "Sounds like you need a different perspective, not another engineer. What skill gaps does your current team have?"
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Employer Message 2 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-white/10">
                <p className="text-white/90 text-sm leading-relaxed">
                  "Nobody really understands our users. We're all very technical."
                </p>
              </div>
            </div>

            {/* Webby Response 2 */}
            <div className="flex gap-3 items-start justify-end">
              <div className="bg-primary/20 backdrop-blur-sm rounded-2xl rounded-tr-none p-4 max-w-[80%] border border-primary/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <p className="text-white/90 text-sm leading-relaxed">
                  "I've found a UX researcher who's curious about product engineering, and a former teacher who's been learning to code. Both bring user empathy your team lacks. They're trainable on the technical side—but that fresh perspective? You can't teach that. Want to meet them?"
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="looking" className="mt-6 space-y-4">
            {/* Gareth Message 1 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-white/10">
                <p className="text-white/90 text-sm leading-relaxed">
                  "I've been an accountant for 8 years but I'm fascinated by climate tech. I know I'd have to start over..."
                </p>
              </div>
            </div>

            {/* Webby Response 1 */}
            <div className="flex gap-3 items-start justify-end">
              <div className="bg-primary/20 backdrop-blur-sm rounded-2xl rounded-tr-none p-4 max-w-[80%] border border-primary/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <p className="text-white/90 text-sm leading-relaxed">
                  "You wouldn't be starting over—you'd be bringing something rare. What draws you to climate tech?"
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Gareth Message 2 */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-white/10">
                <p className="text-white/90 text-sm leading-relaxed">
                  "I want my work to actually matter. And honestly, I think my financial modeling skills could help these companies grow sustainably."
                </p>
              </div>
            </div>

            {/* Webby Response 2 */}
            <div className="flex gap-3 items-start justify-end">
              <div className="bg-primary/20 backdrop-blur-sm rounded-2xl rounded-tr-none p-4 max-w-[80%] border border-primary/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <p className="text-white/90 text-sm leading-relaxed">
                  "You're exactly right, Gareth. I found 3 climate startups actively looking for people with your analytical mindset who care about their mission. One founder said 'I'll teach the industry stuff—I need someone who can build our financial models.' Should I introduce you?"
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-6">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white text-lg px-8 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] transition-all"
            onClick={handleTryWebby}
          >
            Try Webby
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
