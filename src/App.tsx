
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import ProjetDetail from "./pages/ProjetDetail";
import Objectifs from "./pages/Objectifs";
import Rapports from "./pages/Rapports";
import Transactions from "./pages/Transactions";
import Support from "./pages/Support";
import Checkout from "./pages/Checkout";
import Subscription from "./pages/Subscription";

// Import i18n configuration
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="checkout" element={<Checkout />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="parametres" element={<Parametres />} />
                <Route path="admin" element={<Admin />} />
                <Route path="cash-flow" element={<CashFlow />} />
                <Route path="debt-management" element={<DebtManagement />} />
                <Route path="decaissements" element={<Depenses />} />
                <Route path="encaissements" element={<Encaissements />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="comptes" element={<Comptes />} />
                <Route path="projets" element={<Projets />} />
                <Route path="projets/:id" element={<ProjetDetail />} />
                <Route path="objectifs" element={<Objectifs />} />
                <Route path="rapports" element={<Rapports />} />
                <Route path="support" element={<Support />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
