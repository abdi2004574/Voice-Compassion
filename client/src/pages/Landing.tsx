import { Button } from "@/components/ui/button";
import { Mic, Heart, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Mic className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">VoiceTherapy</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex font-medium">About</Button>
            <Button variant="ghost" className="hidden md:flex font-medium">For Psychologists</Button>
            <Button asChild className="rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
              <a href="/api/login">Login with Replit</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI-Powered Voice Therapy
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-6 text-foreground">
              Find comfort in <br />
              <span className="text-primary">familiar voices.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              A secure, therapeutic space where AI helps you process emotions through conversation with the familiar voice of a loved one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full text-lg h-14 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                <a href="/api/login">Start Your Journey</a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-lg h-14 px-8 border-2 hover:bg-slate-50">
                How It Works
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             {/* Abstract UI Mockup */}
             <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 rotate-2 hover:rotate-0 transition-all duration-500">
               <div className="flex items-center justify-between mb-8 border-b pb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                     <Mic className="w-6 h-6 text-slate-400" />
                   </div>
                   <div>
                     <div className="h-4 w-32 bg-slate-100 rounded mb-2" />
                     <div className="h-3 w-20 bg-slate-50 rounded" />
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                 </div>
               </div>
               
               <div className="space-y-4 mb-8">
                 <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0" />
                   <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none w-3/4">
                     <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                     <div className="h-3 w-2/3 bg-slate-200 rounded" />
                   </div>
                 </div>
                 <div className="flex gap-4 flex-row-reverse">
                   <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                   <div className="bg-primary/5 p-4 rounded-2xl rounded-tr-none w-3/4">
                     <div className="h-3 w-full bg-slate-200/50 rounded mb-2" />
                     <div className="h-3 w-1/2 bg-slate-200/50 rounded" />
                   </div>
                 </div>
               </div>

               <div className="h-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                 <Mic className="w-5 h-5 mr-2" /> Tap to speak...
               </div>
             </div>
             
             {/* Decorative element behind */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl transform -rotate-3 translate-y-4 translate-x-4 opacity-20 -z-10 blur-xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Therapy reimagined with compassion</h2>
            <p className="text-lg text-muted-foreground">Combining advanced AI technology with psychological principles to provide safe, meaningful support.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Mic, 
                title: "Voice Upload", 
                desc: "Securely upload voice samples of loved ones. Stored with encryption and strictly for therapeutic use.",
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              { 
                icon: Heart, 
                title: "AI Conversation", 
                desc: "Engage in natural conversations. The AI adapts its tone and responses to provide comfort and understanding.",
                color: "text-rose-500",
                bg: "bg-rose-50"
              },
              { 
                icon: Activity, 
                title: "Clinical Insight", 
                desc: "Conversations are analyzed for emotional patterns, generating clinical summaries for psychologists.",
                color: "text-emerald-500",
                bg: "bg-emerald-50"
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trust/Privacy Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">Privacy First, Always.</h2>
          <p className="text-xl text-slate-300 mb-10">
            We understand the sensitivity of voice data. Your conversations are encrypted, private, and analyzed only by AI to generate anonymous clinical summaries.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium">End-to-end Encryption</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium">HIPAA Compliant Standards</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
