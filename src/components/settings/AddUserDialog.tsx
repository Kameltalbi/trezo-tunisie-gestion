
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperAdmin: boolean;
}

const AddUserDialog = ({ open, onOpenChange, isSuperAdmin }: AddUserDialogProps) => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'collaborateur'
    }
  });

  // Définir les rôles disponibles selon le type d'utilisateur
  const availableRoles = isSuperAdmin 
    ? [
        { value: 'admin', label: 'Admin', description: 'Accès complet au compte' },
        { value: 'financier', label: 'Financier', description: 'Gestion financière et rapports' },
        { value: 'editeur', label: 'Éditeur', description: 'Création et modification des données' },
        { value: 'collaborateur', label: 'Collaborateur', description: 'Accès en lecture seule' }
      ]
    : [
        { value: 'financier', label: 'Financier', description: 'Gestion financière et rapports' },
        { value: 'editeur', label: 'Éditeur', description: 'Création et modification des données' },
        { value: 'collaborateur', label: 'Collaborateur', description: 'Accès en lecture seule' }
      ];

  const onSubmit = (data: any) => {
    console.log('Ajouter utilisateur:', data);
    // Logique d'ajout d'utilisateur
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Invitez un nouvel utilisateur à rejoindre votre compte.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ahmed Ben Ali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ahmed@entreprise.tn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.label}</span>
                            <span className="text-xs text-gray-500">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                Un email d'invitation sera envoyé à cette adresse avec les instructions de connexion.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Envoyer l'invitation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
