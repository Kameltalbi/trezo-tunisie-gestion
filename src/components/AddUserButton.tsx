
import { useState, useEffect } from "react";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface AddUserButtonProps {
  onAdd: () => void;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ onAdd }) => {
  const { user } = useLocalAuth();
  const [canAddUser, setCanAddUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const checkUserQuota = async () => {
      setLoading(true);

      // Pour l'instant, avec le système local, on permet à tous les utilisateurs connectés d'ajouter des utilisateurs
      const isKamelUser = user.email === 'kamel.talbi@yahoo.fr';
      setUserRole(isKamelUser ? 'admin' : 'user');

      // Dans le système local, on permet l'ajout d'utilisateurs
      setCanAddUser(true);
      setLoading(false);
    };

    checkUserQuota();
  }, [user]);

  const handleClick = () => {
    if (!canAddUser) {
      toast("Vous ne pouvez pas ajouter plus d'utilisateurs pour le moment.");
      return;
    }

    onAdd();
  };

  return (
    <Button onClick={handleClick} disabled={loading} className="bg-[#27548a] text-white hover:bg-[#1e4772]">
      Ajouter un utilisateur
    </Button>
  );
};

export default AddUserButton;
