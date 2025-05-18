
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
import DebtManagement from "./pages/DebtManagement";
import Encaissements from "./pages/Encaissements";
import NotFound from "./pages/NotFound";

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
            <Route path="/debt-management" element={<DebtManagement />} />
            <Route path="/encaissements" element={<Encaissements />} />
            <Route path="/dashboard" element={<Encaissements />} /> {/* Changed redirect to Encaissements */}
            <Route path="/depenses" element={<NotFound />} /> {/* Placeholder route */}
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
