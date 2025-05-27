
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPermissions = async () => {
      setLoading(true);

      // 1. Récupère le rôle de l'utilisateur depuis users_app
      const { data: userData, error: userError } = await supabase
        .from("users_app")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError || !userData?.role) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      // 2. Récupère l'id du rôle dans la table roles
      const { data: roleData } = await supabase
        .from("roles")
        .select("id")
        .eq("name", userData.role)
        .single();

      if (!roleData?.id) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      // 3. Récupère les permissions liées au rôle
      const { data: perms } = await supabase
        .from("role_permissions")
        .select("permissions(nom)")
        .eq("role_id", roleData.id);

      const permissionCodes = perms?.map(p => p.permissions.nom) || [];
      setPermissions(permissionCodes);
      setLoading(false);
    };

    fetchPermissions();
  }, [user]);

  // méthode utilitaire
  const has = (permissionName: string) => permissions.includes(permissionName);

  return { permissions, has, loading };
};
