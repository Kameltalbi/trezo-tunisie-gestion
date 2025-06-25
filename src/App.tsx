
import { Toaster } from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocalAuthProvider } from "./contexts/LocalAuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LocalLayout from "./components/LocalLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import CashFlow from "./pages/CashFlow";
import DebtManagement from "./pages/DebtManagement";
import NotFound from "./pages/NotFound";
import Depenses from "./pages/Depenses";
import Encaissements from "./pages/Encaissements";
import Dashboard from "./pages/Dashboard";
import Comptes from "./pages/Comptes";
import ImportReleve from "./pages/ImportReleve";
import Projets from "./pages/Projets";
import ProjetDetail from "./pages/ProjetDetail";
import Objectifs from "./pages/Objectifs";
import Rapports from "./pages/Rapports";
import Transactions from "./pages/Transactions";
import SubscriptionForm from "./pages/SubscriptionForm";
import SuperAdmin from "./pages/SuperAdmin";
import Settings from "./pages/Settings";

// Import i18n configuration
import "./i18n";

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="ui-theme">
    <TooltipProvider>
      <LocalAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/subscription" element={<SubscriptionForm />} />
            <Route path="/superadmin" element={<LocalLayout requireAuth={true}><SuperAdmin /></LocalLayout>} />
            <Route path="/settings" element={<LocalLayout requireAuth={true}><Settings /></LocalLayout>} />
            <Route path="/cash-flow" element={<LocalLayout requireAuth={true}><CashFlow /></LocalLayout>} />
            <Route path="/debt-management" element={<LocalLayout requireAuth={true}><DebtManagement /></LocalLayout>} />
            <Route path="/decaissements" element={<LocalLayout requireAuth={true}><Depenses /></LocalLayout>} />
            <Route path="/encaissements" element={<LocalLayout requireAuth={true}><Encaissements /></LocalLayout>} />
            <Route path="/transactions" element={<LocalLayout requireAuth={true}><Transactions /></LocalLayout>} />
            <Route path="/dashboard" element={<LocalLayout requireAuth={true}><Dashboard /></LocalLayout>} />
            <Route path="/comptes" element={<LocalLayout requireAuth={true}><Comptes /></LocalLayout>} />
            <Route path="/comptes/:compteId/import-releve" element={<LocalLayout requireAuth={true}><ImportReleve /></LocalLayout>} />
            <Route path="/projets" element={<LocalLayout requireAuth={true}><Projets /></LocalLayout>} />
            <Route path="/projets/:id" element={<LocalLayout requireAuth={true}><ProjetDetail /></LocalLayout>} />
            <Route path="/objectifs" element={<LocalLayout requireAuth={true}><Objectifs /></LocalLayout>} />
            <Route path="/rapports" element={<LocalLayout requireAuth={true}><Rapports /></LocalLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LocalAuthProvider>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
