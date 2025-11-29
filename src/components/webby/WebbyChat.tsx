import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WebbyChatProps {
  userType: 'candidate' | 'employer';
  onComplete?: () => void;
  onProfileUpdate?: () => void;
}

export const WebbyChat = ({ userType, onComplete, onProfileUpdate }: WebbyChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: userType === 'candidate' 
        ? "Hey! I'm Webby 👋 I already have your job title, experience, and location from your profile - so we're good there! What I'm really curious about is YOU beyond the CV. Tell me - what do you love doing when you're not working? Any hobbies, passions, or side projects that light you up? 🎨🏊‍♀️🎸"
        : "Hey! I'm Webby 👋 I'm here to help you find great candidates beyond the usual job boards. Let's think differently - what kind of role are you looking to fill, and more importantly, what KIND of person would thrive in it?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('webby-conversation', {
        body: {
          messages: [...messages, { role: 'user', content: userMessage }],
          userType
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message
      }]);

      // Trigger profile refresh if significant data was captured
      if (data.shouldRefreshMatches) {
        onProfileUpdate?.();
      }

      // Check if conversation seems complete
      if (data.message.toLowerCase().includes('got it') || 
          data.message.toLowerCase().includes('perfect') ||
          data.message.toLowerCase().includes("that's all")) {
        setTimeout(() => onComplete?.(), 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Chat with Webby</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[120px]"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};