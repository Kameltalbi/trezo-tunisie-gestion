
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface AddUserButtonProps {
  onAdd: () => void;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ onAdd }) => {
  const { user } = useAuth();
  const [canAddUser, setCanAddUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const checkUserQuota = async () => {
      setLoading(true);

      // Utiliser user_current_plan pour récupérer les informations
      const { data: currentPlan } = await supabase
        .from("user_current_plan")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Pour le rôle, on peut vérifier s'il s'agit de l'utilisateur kamel
      const isKamelUser = user.email === 'kamel.talbi@yahoo.fr';
      setUserRole(isKamelUser ? 'admin' : 'user');

      if (!currentPlan || (!isKamelUser && !['admin', 'superadmin'].includes('admin'))) {
        setCanAddUser(false);
        setLoading(false);
        return;
      }

      // Compter les utilisateurs existants via les profils
      const { count: userCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      if (currentPlan.max_bank_accounts && typeof userCount === 'number') {
        // Utiliser max_bank_accounts comme limite temporaire (ou créer une nouvelle colonne max_users)
        setCanAddUser(userCount < (currentPlan.max_bank_accounts || 1));
      } else {
        setCanAddUser(isKamelUser); // Seul kamel peut ajouter des utilisateurs
      }

      setLoading(false);
    };

    checkUserQuota();
  }, [user]);

  const handleClick = () => {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      toast("Seuls les administrateurs peuvent ajouter des utilisateurs.");
      return;
    }

    if (!canAddUser) {
      toast("Limite atteinte : vous ne pouvez pas ajouter plus d'utilisateurs avec votre plan actuel.");
      return;
    }

    onAdd();
  };

  return (
    <Button onClick={handleClick} disabled={loading} className="bg-green-600 text-white">
      Ajouter un utilisateur
    </Button>
  );
};

export default AddUserButton;
