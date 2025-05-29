
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Edit, Plus, Trash2 } from 'lucide-react';
import { useNewPlans } from '@/hooks/useNewPlans';

const PlansManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: plans, isLoading } = useNewPlans();

  // Mock data - à remplacer par de vraies données
  const mockPlans = [
    {
      id: '1',
      name: 'trial',
      label: 'Essai Gratuit',
      price_dt: 0,
      max_users: 3,
      duration: '14 jours',
      features: ['Gestion de base', 'Support email']
    },
    {
      id: '2',
      name: 'pro',
      label: 'Professionnel',
      price_dt: 2400,
      max_users: 10,
      duration: '12 mois',
      features: ['Toutes les fonctionnalités', 'Support prioritaire', 'Rapports avancés']
    },
    {
      id: '3',
      name: 'entreprise',
      label: 'Entreprise',
      price_dt: 4800,
      max_users: 50,
      duration: '12 mois',
      features: ['Fonctionnalités entreprise', 'Support dédié', 'API access', 'Formation']
    }
  ];

  const handleEditPlan = (planId: string) => {
    console.log('Modifier le plan:', planId);
    // Logique de modification
  };

  const handleDeletePlan = (planId: string) => {
    console.log('Supprimer le plan:', planId);
    // Logique de suppression
  };

  const handleCreatePlan = () => {
    console.log('Créer un nouveau plan');
    // Logique de création
    setIsCreateDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Gestion des Plans & Tarification
        </CardTitle>
        <CardDescription>
          Configuration et gestion des plans d'abonnement de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-6">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau plan</DialogTitle>
                <DialogDescription>
                  Configurez les détails du nouveau plan d'abonnement
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nom</Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">Libellé</Label>
                  <Input id="label" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Prix (DT)</Label>
                  <Input id="price" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxUsers" className="text-right">Max utilisateurs</Label>
                  <Input id="maxUsers" type="number" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreatePlan}>
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Max Utilisateurs</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Fonctionnalités</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.label}</div>
                      <div className="text-sm text-gray-500">{plan.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {plan.price_dt === 0 ? 'Gratuit' : `${plan.price_dt} DT`}
                  </TableCell>
                  <TableCell>{plan.max_users}</TableCell>
                  <TableCell>{plan.duration}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <div key={index}>• {feature}</div>
                      ))}
                      {plan.features.length > 2 && (
                        <div className="text-gray-500">
                          +{plan.features.length - 2} autres
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPlan(plan.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlansManagement;
