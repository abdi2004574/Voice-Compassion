import { useConversations, useCreateConversation, useConversation } from "@/hooks/use-chat";
import { useVoiceSamples } from "@/hooks/use-voice-samples";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Plus, MessageSquare, Send, Mic, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Chat() {
  const { data: conversations, isLoading: loadingConvos } = useConversations();
  const { data: voices } = useVoiceSamples();
  const createConvoMutation = useCreateConversation();
  const { toast } = useToast();

  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const { data: activeConversation, refetch: refetchActive } = useConversation(activeConvoId || 0);
  
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isSending]);

  const handleCreateConvo = async () => {
    try {
      const newConvo = await createConvoMutation.mutateAsync("New Session " + format(new Date(), "MMM d"));
      setActiveConvoId(newConvo.id);
    } catch (e) {
      toast({ title: "Error", description: "Could not create session", variant: "destructive" });
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // In a real app with ElevenLabs, we'd fetch audio here. 
    // For now, we simulate "voice cloning" by just using browser speech but showing UI feedback.
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text: string = inputText) => {
    if ((!text.trim() && !inputText.trim()) || !activeConvoId) return;
    
    const contentToSend = text || inputText;
    setInputText("");
    setIsSending(true);

    try {
      // Optimistic update logic could go here, but we'll rely on fast fetch/SSE for now
      // Integration route for sending message: POST /api/conversations/:id/messages
      const res = await fetch(`/api/conversations/${activeConvoId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSend }),
      });

      if (!res.ok) throw new Error("Failed to send");

      // Handle SSE response manually to speak chunks if desired, 
      // or just wait for completion and speak full text.
      // For simplicity in this demo, we'll parse the SSE stream to build the full response text to speak.
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          for (const line of lines) {
             if (line.startsWith('data: ')) {
               const data = JSON.parse(line.slice(6));
               if (data.content) {
                 fullResponse += data.content;
                 // Could append to UI incrementally here if we had local state for it
               }
             }
          }
        }
      }

      // Refresh messages to show the new ones
      refetchActive();
      
      // Speak the AI response
      if (fullResponse) {
        speakText(fullResponse);
      }

    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const activeVoiceName = voices?.find(v => v.id === selectedVoiceId)?.name;

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] -m-4 md:-m-8 lg:-m-10 flex flex-col md:flex-row">
      
      {/* Sidebar List */}
      <div className="w-full md:w-80 bg-white border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-bold font-display text-lg">Sessions</h2>
          <Button size="icon" variant="ghost" onClick={handleCreateConvo}>
            <Plus className="w-5 h-5 text-primary" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {loadingConvos ? (
               <div className="text-center p-4 text-sm text-muted-foreground">Loading...</div>
            ) : conversations?.length === 0 ? (
               <div className="text-center p-8 text-sm text-muted-foreground">No sessions yet.</div>
            ) : (
              conversations?.map(convo => (
                <button
                  key={convo.id}
                  onClick={() => setActiveConvoId(convo.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center gap-3",
                    activeConvoId === convo.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-slate-50 text-foreground"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{convo.title}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {!activeConvoId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-float">
               <Mic className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-display mb-2">Select or start a session</h2>
            <p className="text-muted-foreground max-w-md">
              Choose a conversation from the left or create a new one to start your therapeutic session.
            </p>
            <Button className="mt-6 rounded-full" onClick={handleCreateConvo}>
              Start New Session
            </Button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-border bg-white px-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{activeConversation?.title || "Session"}</span>
                {isSpeaking && (
                   <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full animate-pulse">
                     <Volume2 className="w-3 h-3" /> Speaking...
                   </span>
                )}
              </div>

              {/* Voice Selector */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full gap-2">
                    {activeVoiceName ? (
                      <><Mic className="w-3 h-3" /> Voice: {activeVoiceName}</>
                    ) : (
                      "Select Voice"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Voice for AI</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-2 mt-4">
                    {voices?.map(voice => (
                      <Button 
                        key={voice.id} 
                        variant={selectedVoiceId === voice.id ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedVoiceId(voice.id)}
                      >
                        {voice.name}
                      </Button>
                    ))}
                    {(!voices || voices.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No voices available. Upload one in "My Voices".
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
              {activeConversation?.messages?.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={cn("flex gap-4 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      isUser ? "bg-primary text-white" : "bg-white text-secondary-foreground"
                    )}>
                      {isUser ? "Me" : "AI"}
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                      isUser 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white border border-border rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {isSending && (
                 <div className="flex gap-4 max-w-3xl">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                     <span className="animate-pulse">...</span>
                   </div>
                   <div className="bg-white border border-border p-4 rounded-2xl rounded-tl-none text-sm text-muted-foreground italic">
                     Thinking...
                   </div>
                 </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-border">
              <div className="max-w-3xl mx-auto flex gap-2 relative">
                <VoiceRecorder 
                  onRecordingComplete={(text) => handleSendMessage(text)} 
                  isProcessing={isSending}
                />
                
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Type a message..."
                  className="rounded-full pl-4 pr-12 py-6 shadow-sm border-slate-200 focus:border-primary focus:ring-primary/20"
                  disabled={isSending}
                />
                
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1 rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isSending}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Conversations are private and secure.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
