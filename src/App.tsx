import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Hardware from "./pages/Hardware";
import Infrastructure from "./pages/Infrastructure";
import FAQ from "./pages/FAQ";
import AmneziaWG from "./pages/AmneziaWG";
import Dashboard from "./pages/Dashboard";
import Node1 from "./pages/Node1";
import Generator from "./pages/Generator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/node-1" element={<Node1 />} />
        <Route path="/hardware" element={<Hardware />} />
        <Route path="/infrastructure" element={<Infrastructure />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/amnezia-tech" element={<AmneziaWG />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generator" element={<Generator />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
