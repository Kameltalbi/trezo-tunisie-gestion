
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Recettes from "./pages/Recettes";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

// Placeholder pages qui seront implémentées plus tard
const Dashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible.</p>
  </div>
);

const Depenses = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Dépenses</h1>
    <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible.</p>
  </div>
);

const Categories = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Catégories</h1>
    <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible.</p>
  </div>
);

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
            <Route path="/recettes" element={<Recettes />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/depenses" element={<Depenses />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
