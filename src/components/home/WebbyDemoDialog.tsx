import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WebbyDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  type: 'user' | 'webby' | 'match' | 'employer';
  content: string;
  name?: string;
}

const TypingIndicator = () => (
  <div className="flex gap-1">
    <motion.div 
      className="w-2 h-2 bg-primary rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.div 
      className="w-2 h-2 bg-primary rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div 
      className="w-2 h-2 bg-primary rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

interface MatchNotificationProps {
  candidateName: string;
  employerName: string;
}

const MatchNotification = ({ candidateName, employerName }: MatchNotificationProps) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", duration: 0.6 }}
    className="flex flex-col items-center justify-center py-8 px-4"
  >
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(236,72,153,0.6)]"
    >
      <Heart className="w-10 h-10 text-primary fill-primary" />
    </motion.div>
    <motion.h3
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-2xl font-bold text-white mb-2"
    >
      Match Found! 🎉
    </motion.h3>
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-white/80 text-center"
    >
      {candidateName}, meet {employerName}
    </motion.p>
  </motion.div>
);

export const WebbyDemoDialog = ({ open, onOpenChange }: WebbyDemoDialogProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("looking");
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const candidateMessages: Message[] = [
    // Phase 1: Initial conversation
    { id: "c1", type: "user", content: "I've been an accountant for 8 years but I'm fascinated by climate tech. I know I'd have to start over...", name: "Gareth (Candidate)" },
    { id: "c2", type: "webby", content: "You wouldn't be starting over—you'd be bringing something rare. What draws you to climate tech?", name: "Webby" },
    { id: "c3", type: "user", content: "I want my work to actually matter. And honestly, I think my financial modeling skills could help these companies grow sustainably.", name: "Gareth" },
    { id: "c4", type: "webby", content: "You're exactly right, Gareth. I found 3 climate startups actively looking for people with your analytical mindset who care about their mission. One founder said 'I'll teach the industry stuff—I need someone who can build our financial models.' Should I introduce you?", name: "Webby" },
    { id: "c5", type: "user", content: "Yes! That sounds perfect.", name: "Gareth" },
    // Phase 2: Match
    { id: "match", type: "match", content: "" },
    // Phase 3: Real connection
    { id: "c6", type: "webby", content: "Gareth, meet Sarah from GreenScale. Sarah, meet Gareth—the financial analyst ready to make an impact.", name: "Webby" },
    { id: "c7", type: "employer", content: "Hi Gareth! Your financial modeling background is exactly what we need. We're scaling our carbon offset marketplace and need someone who can build robust financial projections.", name: "Sarah (GreenScale)" },
    { id: "c8", type: "user", content: "Thanks Sarah! I'd love to hear more about GreenScale's mission. The intersection of finance and climate impact is exactly what I'm looking for.", name: "Gareth" },
    { id: "c9", type: "employer", content: "Perfect! Are you free for a call this Thursday at 3pm?", name: "Sarah" },
    { id: "c10", type: "user", content: "Thursday at 3pm works great! Looking forward to it.", name: "Gareth" },
    { id: "c11", type: "webby", content: "Interview scheduled! 📅 I've sent you both calendar invites. Good luck, Gareth! 🎉", name: "Webby" },
  ];

  const employerMessages: Message[] = [
    // Phase 1: Initial conversation
    { id: "e1", type: "user", content: "My engineering team is brilliant but we keep building features nobody uses. We need someone who thinks differently.", name: "You (Employer)" },
    { id: "e2", type: "webby", content: "Sounds like you need a different perspective, not another engineer. What skill gaps does your current team have?", name: "Webby" },
    { id: "e3", type: "user", content: "Nobody really understands our users. We're all very technical.", name: "You" },
    { id: "e4", type: "webby", content: "I've found a UX researcher who's curious about product engineering, and a former teacher who's been learning to code. Both bring user empathy your team lacks. They're trainable on the technical side—but that fresh perspective? You can't teach that. Want to meet them?", name: "Webby" },
    { id: "e5", type: "user", content: "Yes, let's start with the UX researcher!", name: "You" },
    // Phase 2: Match
    { id: "ematch", type: "match", content: "" },
    // Phase 3: Connection & Interview Scheduling
    { id: "e6", type: "webby", content: "Meet Maya—she's spent 5 years in UX research and is eager to get closer to product development.", name: "Webby" },
    { id: "e7", type: "employer", content: "Hi! I love your portfolio—especially the user journey mapping work. I'd love to chat about how you approach understanding user needs.", name: "Maya (Candidate)" },
    { id: "e8", type: "user", content: "Thanks Maya! Your background is exactly what we need. Are you available for an interview this week?", name: "You" },
    { id: "e9", type: "employer", content: "I'm free Wednesday afternoon or Friday morning!", name: "Maya" },
    { id: "e10", type: "user", content: "Friday at 10am works. It'll be a 30-minute video call.", name: "You" },
    { id: "e11", type: "webby", content: "Interview scheduled! 📅 I've sent calendar invites to both of you. Good luck! 🎉", name: "Webby" },
  ];

  const messages = activeTab === "looking" ? candidateMessages : employerMessages;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  const playDemo = async () => {
    setIsPlaying(true);
    setVisibleMessages([]);
    setCurrentPhase(1);

    const phaseOneMessages = activeTab === "looking" 
      ? ["c1", "c2", "c3", "c4", "c5"]
      : ["e1", "e2", "e3", "e4", "e5"];

    // Phase 1: Initial conversation - slower timing for readability
    for (const msgId of phaseOneMessages) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const msg = messages.find(m => m.id === msgId);
      if (msg?.type === "webby") {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsTyping(false);
      }
      
      setVisibleMessages(prev => [...prev, msgId]);
    }

    // Phase 2: Match notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentPhase(2);
    const matchId = activeTab === "looking" ? "match" : "ematch";
    setVisibleMessages(prev => [...prev, matchId]);

    // Phase 3: Real connection & interview scheduling
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentPhase(3);
    
    const phaseThreeMessages = activeTab === "looking" 
      ? ["c6", "c7", "c8", "c9", "c10", "c11"]
      : ["e6", "e7", "e8", "e9", "e10", "e11"];
      
    for (const msgId of phaseThreeMessages) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const msg = messages.find(m => m.id === msgId);
      if (msg?.type === "webby") {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTyping(false);
      }
      
      setVisibleMessages(prev => [...prev, msgId]);
    }

    setIsPlaying(false);
  };

  useEffect(() => {
    if (open) {
      // Auto-play when dialog opens
      setTimeout(() => playDemo(), 500);
    } else {
      // Reset when dialog closes
      setVisibleMessages([]);
      setCurrentPhase(1);
      setIsPlaying(false);
      setIsTyping(false);
    }
  }, [open, activeTab]);

  const handleTryWebby = () => {
    onOpenChange(false);
    navigate('/webby-candidate');
  };

  const renderMessage = (message: Message) => {
    if (message.type === "match") {
      const isEmployerView = activeTab === "hiring";
      return (
        <MatchNotification 
          key={message.id} 
          candidateName={isEmployerView ? "Maya" : "Gareth"}
          employerName={isEmployerView ? "your team" : "Sarah from GreenScale"}
        />
      );
    }

    const isWebby = message.type === "webby";
    const isEmployer = message.type === "employer";
    const isUser = message.type === "user";

    return (
      <motion.div
        key={message.id}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className={`flex gap-3 items-start ${isWebby ? "justify-end" : ""}`}
      >
        {!isWebby && (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">{isEmployer ? "👩‍💼" : "👤"}</span>
          </div>
        )}
        
        <div className="flex flex-col gap-1 max-w-[80%]">
          {message.name && (
            <span className="text-xs text-white/60 px-2">{message.name}</span>
          )}
          <div className={`backdrop-blur-sm rounded-2xl p-4 border ${
            isWebby 
              ? "bg-primary/20 border-primary/30 rounded-tr-none shadow-[0_0_15px_rgba(236,72,153,0.2)]"
              : "bg-white/10 border-white/10 rounded-tl-none"
          }`}>
            <p className="text-white text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>

        {isWebby && (
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-gradient-to-br from-[#1a0a15] via-[#2d1028] to-[#150a1a] border-primary/20 overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            See How <span className="text-primary">Webby</span> Works
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 backdrop-blur-sm border border-white/10">
            <TabsTrigger 
              value="hiring"
              className="data-[state=active]:bg-primary/40 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.4)] data-[state=inactive]:bg-white/10 data-[state=inactive]:text-white text-white font-medium transition-all"
            >
              I'm Hiring
            </TabsTrigger>
            <TabsTrigger 
              value="looking"
              className="data-[state=active]:bg-primary/40 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.4)] data-[state=inactive]:bg-white/10 data-[state=inactive]:text-white text-white font-medium transition-all"
            >
              I'm Looking
            </TabsTrigger>
          </TabsList>

          <div 
            ref={scrollRef}
            className="mt-6 space-y-4 overflow-y-auto max-h-[40vh] pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent flex-1"
          >
            <TabsContent value="hiring" className="space-y-4 mt-0">
              <AnimatePresence mode="wait">
                {messages
                  .filter(msg => visibleMessages.includes(msg.id))
                  .map(msg => renderMessage(msg))}
              </AnimatePresence>
              
              {isTyping && activeTab === "hiring" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-start justify-end"
                >
                  <div className="bg-primary/20 backdrop-blur-sm rounded-2xl rounded-tr-none p-4 border border-primary/30">
                    <TypingIndicator />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="looking" className="space-y-4 mt-0">
              <AnimatePresence mode="wait">
                {messages
                  .filter(msg => visibleMessages.includes(msg.id))
                  .map(msg => renderMessage(msg))}
              </AnimatePresence>
              
              {isTyping && activeTab === "looking" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-start justify-end"
                >
                  <div className="bg-primary/20 backdrop-blur-sm rounded-2xl rounded-tr-none p-4 border border-primary/30">
                    <TypingIndicator />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-2">
          <div className={`w-2 h-2 rounded-full transition-all ${currentPhase >= 1 ? "bg-primary shadow-[0_0_8px_rgba(236,72,153,0.6)]" : "bg-white/20"}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${currentPhase >= 2 ? "bg-primary shadow-[0_0_8px_rgba(236,72,153,0.6)]" : "bg-white/20"}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${currentPhase >= 3 ? "bg-primary shadow-[0_0_8px_rgba(236,72,153,0.6)]" : "bg-white/20"}`} />
        </div>

        <div className="flex justify-center gap-3 mt-4">
          {!isPlaying && visibleMessages.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              className="border-primary/50 text-white hover:bg-primary/10"
              onClick={playDemo}
            >
              ↻ Replay
            </Button>
          )}
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