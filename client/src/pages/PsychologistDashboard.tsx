import { useClinicalSummaries, useCreateClinicalSummary } from "@/hooks/use-clinical-summaries";
import { useConversations } from "@/hooks/use-chat";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";

export default function PsychologistDashboard() {
  const { data: summaries, isLoading } = useClinicalSummaries();
  const { data: conversations } = useConversations();
  const createSummaryMutation = useCreateClinicalSummary();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [summaryContent, setSummaryContent] = useState("");
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");

  const handleGenerateSummary = async () => {
    // In a real app, this would call an AI endpoint to generate summary from conversation ID
    // For now, we manually create it
    if (!selectedConversation || !summaryContent) return;

    try {
      await createSummaryMutation.mutateAsync({
        userId: "current-user-id", // Backend handles user association via auth, this is just for schema
        conversationId: parseInt(selectedConversation),
        content: summaryContent,
        riskLevel: riskLevel,
        reviewedBy: "Dr. AI",
      });
      setIsDialogOpen(false);
      setSummaryContent("");
      setSelectedConversation("");
      toast({ title: "Report Generated", description: "Clinical summary saved successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save summary.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Clinical Dashboard</h1>
          <p className="text-muted-foreground mt-1">Review AI-generated mental health summaries and risk assessments.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/25">
              <FileText className="mr-2 w-4 h-4" /> Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Clinical Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Session</label>
                <Select onValueChange={setSelectedConversation} value={selectedConversation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a conversation..." />
                  </SelectTrigger>
                  <SelectContent>
                    {conversations?.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.title} ({format(new Date(c.createdAt!), "MMM d")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Assessment</label>
                <Select onValueChange={(v: any) => setRiskLevel(v)} value={riskLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk - Stable</SelectItem>
                    <SelectItem value="medium">Medium Risk - Monitor</SelectItem>
                    <SelectItem value="high">High Risk - Immediate Attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary Notes</label>
                <Textarea 
                  placeholder="Enter clinical observations..." 
                  className="min-h-[150px]"
                  value={summaryContent}
                  onChange={(e) => setSummaryContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGenerateSummary} disabled={createSummaryMutation.isPending || !selectedConversation}>
                {createSummaryMutation.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Save Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : summaries?.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-muted-foreground">No clinical summaries available yet.</p>
          </Card>
        ) : (
          summaries?.map((summary) => (
            <Card key={summary.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="border-l-4 border-l-transparent data-[risk=high]:border-l-red-500 data-[risk=medium]:border-l-yellow-500 data-[risk=low]:border-l-green-500" data-risk={summary.riskLevel}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                     <CardTitle className="text-base font-semibold">
                       Assessment Report #{summary.id}
                     </CardTitle>
                     <p className="text-sm text-muted-foreground">
                       Generated on {format(new Date(summary.createdAt!), "PPP")}
                     </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2
                    ${summary.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      summary.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'}`}>
                    {summary.riskLevel === 'high' && <AlertCircle className="w-3 h-3" />}
                    {summary.riskLevel === 'low' && <CheckCircle2 className="w-3 h-3" />}
                    {summary.riskLevel} Risk
                  </div>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed text-foreground">
                    {summary.content}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span>Reviewed by: {summary.reviewedBy || "AI System"}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
