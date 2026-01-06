import { useAuth } from "@/hooks/use-auth";
import { useVoiceSamples } from "@/hooks/use-voice-samples";
import { useClinicalSummaries } from "@/hooks/use-clinical-summaries";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Activity, Plus } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: voices, isLoading: voicesLoading } = useVoiceSamples();
  const { data: summaries, isLoading: summariesLoading } = useClinicalSummaries();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            {greeting()}, {user?.firstName || 'Friend'}.
          </h1>
          <p className="text-muted-foreground mt-1">
            How are you feeling today?
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25">
          <Link href="/chat">
            Start Session <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
              <Mic className="w-5 h-5" /> Active Voices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-display">
              {voicesLoading ? <Skeleton className="h-10 w-8" /> : voices?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available for conversation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-transparent border-secondary/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-emerald-700 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-display">
               {summariesLoading ? <Skeleton className="h-10 w-8" /> : summaries?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-dashed border-2 shadow-none flex flex-col items-center justify-center p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
          <Link href="/voice-samples" className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Add New Voice</h3>
            <p className="text-xs text-muted-foreground mt-1">Upload a sample to clone</p>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Voices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Recent Voices</h2>
            <Link href="/voice-samples" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          
          {voicesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : voices?.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50/50 border-dashed">
              <p className="text-muted-foreground">No voices added yet.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/voice-samples">Upload Voice</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {voices?.slice(0, 3).map(voice => (
                <div key={voice.id} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {voice.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{voice.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {voice.status === 'ready' ? 'Ready to chat' : 'Processing...'}
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Summaries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Recent Insights</h2>
            <Link href="/psychologist" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>

          {summariesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : summaries?.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50/50 border-dashed">
              <p className="text-muted-foreground">No sessions recorded yet.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/chat">Start First Session</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {summaries?.slice(0, 3).map(summary => (
                <Card key={summary.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className={`h-1 w-full ${
                    summary.riskLevel === 'high' ? 'bg-red-500' :
                    summary.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {format(new Date(summary.createdAt!), "MMMM d, yyyy")}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        summary.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                        summary.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {summary.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                      {summary.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
