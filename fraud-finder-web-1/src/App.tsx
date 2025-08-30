import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // Toggle dark mode and persist in localStorage
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // On mount, sync theme with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Global Help Modal */}
          <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
            <DialogTrigger asChild>
              <button
                className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Help"
                onClick={() => setHelpOpen(true)}
              >
                <HelpCircle className="h-6 w-6" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Welcome to FraudGuard</DialogTitle>
                <DialogDescription>
                  <ul className="list-disc pl-5 space-y-2 text-left">
                    <li><b>What is this app?</b> <br/>An advanced credit card fraud detection tool powered by machine learning. Analyze single or batch transactions for fraud risk.</li>
                    <li><b>Tabs:</b>
                      <ul className="list-disc pl-5">
                        <li><b>Dashboard:</b> See a summary of your analysis results.</li>
                        <li><b>Single Transaction:</b> Enter details to analyze one transaction.</li>
                        <li><b>Batch Upload:</b> Upload a CSV of transactions for bulk analysis.</li>
                        <li><b>Results:</b> View detailed results of all analyzed transactions.</li>
                        <li><b>Model Info:</b> See information about the ML model.</li>
                      </ul>
                    </li>
                    <li><b>Tips:</b> Use the sample data button in forms to quickly try out the app. All actions show feedback and errors if something goes wrong.</li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* Floating Dark/Light Mode Toggle */}
          <button
            className="fixed bottom-6 right-20 z-50 bg-slate-800 hover:bg-slate-700 text-yellow-400 dark:text-blue-300 rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
          >
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
