
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

  useEffect(() => {
    if (!user?.id) return;

    const checkUserQuota = async () => {
      setLoading(true);
      const { data: currentUser } = await supabase
        .from("users_app")
        .select("plan_id")
        .eq("id", user.id)
        .single();

      if (!currentUser?.plan_id) {
        setCanAddUser(false);
        setLoading(false);
        return;
      }

      const { data: planData } = await supabase
        .from("plans")
        .select("max_users")
        .eq("id", currentUser.plan_id)
        .single();

      const { count: userCount } = await supabase
        .from("users_app")
        .select("id", { count: "exact", head: true });

      if (planData && typeof userCount === 'number') {
        setCanAddUser(userCount < planData.max_users);
      } else {
        setCanAddUser(false);
      }

      setLoading(false);
    };

    checkUserQuota();
  }, [user]);

  const handleClick = () => {
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
