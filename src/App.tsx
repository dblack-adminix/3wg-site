import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import { MaintenanceCheck } from "@/components/MaintenanceCheck";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Software from "./pages/Software";
import Infrastructure from "./pages/Infrastructure";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";
import Login from "./pages/Login";
import Account from "./pages/Account";
import AmneziaWG from "./pages/AmneziaWG";
import Dashboard from "./pages/Dashboard";
import Node1 from "./pages/Node1";
import Generator from "./pages/Generator";
import MobileGenerator from "./pages/MobileGenerator";
import Deposit from "./pages/Deposit";
import Keys from "./pages/Keys";
import KeyDetails from "./pages/KeyDetails";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import ServerDetails from "./pages/ServerDetails";
import SpeedTest from "./pages/SpeedTest";
import SpeedTestWeb from "./pages/SpeedTestWeb";
import Maintenance from "./pages/Maintenance";
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
        <Route path="/software" element={<Software />} />
        <Route path="/infrastructure" element={<Infrastructure />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/amnezia-tech" element={<AmneziaWG />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/generator" element={<PrivateRoute><Generator /></PrivateRoute>} />
        <Route path="/mobile-generator" element={<PrivateRoute><MobileGenerator /></PrivateRoute>} />
        <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
        <Route path="/keys" element={<PrivateRoute><Keys /></PrivateRoute>} />
        <Route path="/keys/:id" element={<PrivateRoute><KeyDetails /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/speed-test" element={<PrivateRoute><SpeedTest /></PrivateRoute>} />
        <Route path="/speed-test-web" element={<PrivateRoute><SpeedTestWeb /></PrivateRoute>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/servers/:id" element={<ServerDetails />} />
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <MaintenanceCheck>
            <AnimatedRoutes />
          </MaintenanceCheck>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
