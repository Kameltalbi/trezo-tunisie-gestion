
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useInviteUser } from "@/hooks/useUserInvitations";

interface UserInvitationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const UserInvitationForm = ({ onSuccess, onCancel }: UserInvitationFormProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editeur' | 'collaborateur' | 'utilisateur'>('utilisateur');
  const { toast } = useToast();
  const inviteUserMutation = useInviteUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        description: "Veuillez saisir un email valide",
        variant: "destructive"
      });
      return;
    }

    try {
      await inviteUserMutation.mutateAsync({ email, role });
      toast({
        description: "Utilisateur ajouté avec succès"
      });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
      toast({
        description: error instanceof Error ? error.message : "Erreur lors de l'invitation",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email de l'utilisateur</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="utilisateur@example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select value={role} onValueChange={(value) => setRole(value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="editeur">Éditeur</SelectItem>
            <SelectItem value="collaborateur">Collaborateur</SelectItem>
            <SelectItem value="utilisateur">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={inviteUserMutation.isPending}
        >
          {inviteUserMutation.isPending ? "Ajout en cours..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};

export default UserInvitationForm;
