
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Parametres from "./pages/Parametres";
import Admin from "./pages/Admin";
import CashFlow from "./pages/CashFlow";
import DebtManagement from "./pages/DebtManagement";
import NotFound from "./pages/NotFound";
import Depenses from "./pages/Depenses";
import Encaissements from "./pages/Encaissements";
import Dashboard from "./pages/Dashboard";
import Comptes from "./pages/Comptes";
import Projets from "./pages/Projets";
import Objectifs from "./pages/Objectifs";
import Rapports from "./pages/Rapports";
import Transactions from "./pages/Transactions";

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
            <Route path="/parametres" element={<Layout requireAuth={true}><Parametres /></Layout>} />
            <Route path="/admin" element={<Layout requireAuth={true}><Admin /></Layout>} />
            <Route path="/cash-flow" element={<Layout requireAuth={true}><CashFlow /></Layout>} />
            <Route path="/debt-management" element={<Layout requireAuth={true}><DebtManagement /></Layout>} />
            <Route path="/decaissements" element={<Layout requireAuth={true}><Depenses /></Layout>} />
            <Route path="/encaissements" element={<Layout requireAuth={true}><Encaissements /></Layout>} />
            <Route path="/transactions" element={<Layout requireAuth={true}><Transactions /></Layout>} />
            <Route path="/dashboard" element={<Layout requireAuth={true}><Dashboard /></Layout>} />
            <Route path="/comptes" element={<Layout requireAuth={true}><Comptes /></Layout>} />
            <Route path="/projets" element={<Layout requireAuth={true}><Projets /></Layout>} />
            <Route path="/objectifs" element={<Layout requireAuth={true}><Objectifs /></Layout>} />
            <Route path="/rapports" element={<Layout requireAuth={true}><Rapports /></Layout>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
