import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4 shadow-xl border-none">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold font-display text-gray-900">Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            We couldn't find the page you were looking for. It might have been moved or doesn't exist.
          </p>
          
          <div className="mt-8">
             <Button asChild className="w-full">
               <Link href="/">Return Home</Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
