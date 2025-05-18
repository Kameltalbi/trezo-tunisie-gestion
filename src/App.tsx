
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Parametres from "./pages/Parametres";
import Admin from "./pages/Admin";
import CashManagement from "./pages/CashManagement";
import CashFlow from "./pages/CashFlow";
import DebtManagement from "./pages/DebtManagement";
import NotFound from "./pages/NotFound";
import Depenses from "./pages/Depenses";

// Import i18n configuration
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cash-management" element={<CashManagement />} />
            <Route path="/cash-flow" element={<CashFlow />} />
            <Route path="/debt-management" element={<DebtManagement />} />
            <Route path="/depenses" element={<Depenses />} />
            <Route path="/dashboard" element={<CashFlow />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
