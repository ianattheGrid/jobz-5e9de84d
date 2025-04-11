
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Plus, Trash2 } from "lucide-react";

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface AIChatInterfaceProps {
  userType: 'employer' | 'candidate' | 'vr';
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ userType }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('user_type', userType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);

      // If there are conversations, set the most recent one as active
      if (data && data.length > 0 && !activeConversation) {
        setActiveConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Ensure we only use messages with valid roles
      const validMessages = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        created_at: msg.created_at
      }));

      setMessages(validMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_chat_conversations')
        .insert({
          user_id: user.id,
          user_type: userType,
          title: 'New conversation'
        })
        .select()
        .single();

      if (error) throw error;

      setConversations([data, ...conversations]);
      setActiveConversation(data.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('ai_chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(conversations.filter(c => c.id !== conversationId));
      
      if (activeConversation === conversationId) {
        const nextConversation = conversations.find(c => c.id !== conversationId);
        if (nextConversation) {
          setActiveConversation(nextConversation.id);
        } else {
          setActiveConversation(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !activeConversation) return;

    const newMessage: Message = {
      role: 'user',
      content: message,
    };

    try {
      setLoading(true);
      setMessages([...messages, newMessage]);
      setMessage("");

      // Save message to database
      const { error: insertError } = await supabase
        .from('ai_chat_messages')
        .insert({
          conversation_id: activeConversation,
          role: 'user',
          content: message
        });

      if (insertError) throw insertError;

      // Call AI function with user message
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, newMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          conversationId: activeConversation,
          userType
        }
      });

      if (error) throw error;

      // Update messages with AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);

      // Update conversation title if this is the first message
      if (messages.length === 0) {
        const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
        await supabase
          .from('ai_chat_conversations')
          .update({ title })
          .eq('id', activeConversation);
        
        // Update local conversations list
        setConversations(conversations.map(c => 
          c.id === activeConversation ? { ...c, title } : c
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message in the chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again later."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-[600px] gap-4">
      {/* Conversations sidebar */}
      <div className="w-64 border-r pr-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Conversations</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={createNewConversation}
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm p-4">
              No conversations yet
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((conversation) => (
                <li 
                  key={conversation.id}
                  className={`p-2 rounded-md cursor-pointer flex justify-between items-center group ${
                    activeConversation === conversation.id 
                      ? 'bg-muted' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="truncate flex-1">
                    <p className="truncate text-sm">{conversation.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(conversation.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {!activeConversation && conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Welcome to the AI Chat Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Start a new conversation to get assistance with your recruitment needs.
              </p>
              <Button onClick={createNewConversation} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                New Conversation
              </Button>
            </Card>
          </div>
        ) : (
          <>
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Send a message to start the conversation
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.created_at && (
                        <p className="text-xs opacity-70 mt-1">
                          {formatDate(msg.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatInterface;
