
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface AddAdminFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAdminForm: React.FC<AddAdminFormProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast({
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Vérifier si l'email existe déjà
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        toast({
          description: "Un utilisateur avec cet email existe déjà",
          variant: "destructive"
        });
        return;
      }

      // Créer un utilisateur temporaire (dans une vraie application, on enverrait une invitation)
      const tempUserId = crypto.randomUUID();

      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: tempUserId,
          email: email,
          full_name: fullName,
        });

      if (profileError) throw profileError;

      // Créer le rôle utilisateur
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: tempUserId,
          role: role,
        });

      if (roleError) throw roleError;

      toast({
        description: `${role === 'superadmin' ? 'Super-administrateur' : 'Administrateur'} ajouté avec succès`
      });

      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });

      // Reset form
      setEmail('');
      setFullName('');
      setRole('admin');
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        description: "Erreur lors de l'ajout de l'administrateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setFullName('');
      setRole('admin');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un administrateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom complet"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <Select 
              value={role} 
              onValueChange={(value: 'admin' | 'superadmin') => setRole(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="superadmin">Super-administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
