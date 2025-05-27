import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Edit, Trash2, Archive, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Projet } from '@/types/projet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

// Mocked linked transactions data (this would come from your API in a real app)
const mockMouvements = [
  { id: 'd1', date: '2023-02-10', description: 'Achat matériaux', montant: 120000, type: 'décaissement' },
  { id: 'd2', date: '2023-04-15', description: 'Main d\'oeuvre', montant: 150000, type: 'décaissement' },
  { id: 'd3', date: '2023-06-20', description: 'Finitions', montant: 50000, type: 'décaissement' },
  { id: 'e1', date: '2023-03-01', description: 'Acompte client', montant: 200000, type: 'encaissement' },
  { id: 'e2', date: '2023-07-15', description: 'Paiement intermédiaire', montant: 150000, type: 'encaissement' },
];

// Mocked project data (this would come from your API in a real app)
const mockProjets: Projet[] = [
  {
    id: '1',
    nom: 'Construction Immeuble A',
    description: 'Construction d\'un immeuble de bureaux',
    budgetPrevu: 500000,
    budgetConsomme: 320000,
    dateDebut: '2023-01-15',
    dateFin: null,
    statut: 'actif',
    encaissements: ['e1', 'e2'],
    decaissements: ['d1', 'd2', 'd3']
  },
  {
    id: '2',
    nom: 'Rénovation Bâtiment B',
    description: 'Rénovation complète d\'un bâtiment existant',
    budgetPrevu: 250000,
    budgetConsomme: 250000,
    dateDebut: '2022-06-10',
    dateFin: '2023-05-30',
    statut: 'termine',
    encaissements: ['e3', 'e4', 'e5'],
    decaissements: ['d4', 'd5', 'd6', 'd7']
  },
  {
    id: '3',
    nom: 'Lotissement Les Roses',
    description: 'Création d\'un lotissement résidentiel',
    budgetPrevu: 750000,
    budgetConsomme: 0,
    dateDebut: '2024-07-01',
    dateFin: null,
    statut: 'en_attente',
    encaissements: [],
    decaissements: []
  }
];

const ProjetStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'actif':
      return (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
          <span className="text-green-500 font-medium">Actif</span>
        </div>
      );
    case 'termine':
      return (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-blue-500 font-medium">Terminé</span>
        </div>
      );
    case 'en_attente':
      return (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></span>
          <span className="text-amber-500 font-medium">En attente</span>
        </div>
      );
    default:
      return null;
  }
};

const ProjetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [projet, setProjet] = useState<Projet | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProject, setEditedProject] = useState<Projet | null>(null);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  
  // Simulate fetching project data
  useEffect(() => {
    // This would be an API call in a real app
    const foundProjet = mockProjets.find(p => p.id === id);
    if (foundProjet) {
      setProjet(foundProjet);
      setEditedProject(foundProjet);
    } else {
      // Handle project not found
      toast.error('Projet non trouvé');
      navigate('/projets');
    }
  }, [id, navigate]);
  
  if (!projet) {
    return <div className="container mx-auto p-6 flex justify-center items-center h-[80vh]">Chargement...</div>;
  }
  
  const resteAConsommer = projet.budgetPrevu - projet.budgetConsomme;
  
  // Filter movements linked to this project
  const mouvementsLies = mockMouvements.filter(m => 
    projet.encaissements.includes(m.id) || projet.decaissements.includes(m.id)
  );
  
  const handleUpdateProject = () => {
    if (!editedProject) return;
    
    // In a real app, this would be an API call
    setProjet(editedProject);
    setIsEditDialogOpen(false);
    toast.success('Projet mis à jour avec succès');
  };
  
  const handleDeleteProject = () => {
    // In a real app, this would be an API call
    toast.success('Projet supprimé avec succès');
    navigate('/projets');
  };
  
  const handleArchiveProject = () => {
    // In a real app, this would update the project status
    toast.success('Projet archivé avec succès');
    setIsArchiveDialogOpen(false);
    navigate('/projets');
  };
  
  const getProgressPercentage = (consumed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((consumed / total) * 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/projets')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{projet.nom}</h1>
          <ProjetStatusBadge status={projet.statut} />
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Modifier le projet</DialogTitle>
              </DialogHeader>
              {editedProject && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-nom">Nom du projet</Label>
                    <Input 
                      id="edit-nom" 
                      value={editedProject.nom}
                      onChange={(e) => setEditedProject({...editedProject, nom: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      value={editedProject.description}
                      onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-budgetPrevu">Budget prévu (DT)</Label>
                      <Input 
                        id="edit-budgetPrevu"
                        type="number"
                        value={editedProject.budgetPrevu}
                        onChange={(e) => setEditedProject({...editedProject, budgetPrevu: Number(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-budgetConsomme">Budget consommé (DT)</Label>
                      <Input 
                        id="edit-budgetConsomme"
                        type="number"
                        value={editedProject.budgetConsomme}
                        onChange={(e) => setEditedProject({...editedProject, budgetConsomme: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-dateDebut">Date de début</Label>
                      <Input 
                        id="edit-dateDebut"
                        type="date" 
                        value={editedProject.dateDebut}
                        onChange={(e) => setEditedProject({...editedProject, dateDebut: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-dateFin">Date de fin</Label>
                      <Input 
                        id="edit-dateFin"
                        type="date" 
                        value={editedProject.dateFin || ''}
                        onChange={(e) => setEditedProject({...editedProject, dateFin: e.target.value || null})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-statut">Statut</Label>
                    <Select 
                      value={editedProject.statut}
                      onValueChange={(value) => setEditedProject({...editedProject, statut: value as 'actif' | 'termine' | 'en_attente'})}
                    >
                      <SelectTrigger id="edit-statut">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleUpdateProject}>Mettre à jour</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les données liées à ce projet seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 text-white hover:bg-red-600">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archiver le projet</AlertDialogTitle>
                <AlertDialogDescription>
                  Le projet sera archivé et n'apparaîtra plus dans la liste principale des projets.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchiveProject}>
                  Archiver
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Project details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Information du projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground">Description</h3>
              <p>{projet.description || "Aucune description"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Date de début</h3>
                <p>{format(new Date(projet.dateDebut), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Date de fin</h3>
                <p>{projet.dateFin ? format(new Date(projet.dateFin), 'dd/MM/yyyy') : "Non définie"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informations financières</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Budget prévu</h3>
                <p className="text-xl font-bold">{formatCurrency(projet.budgetPrevu)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground">Budget consommé</h3>
                <p className="text-xl font-bold">{formatCurrency(projet.budgetConsomme)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-muted-foreground">Reste à consommer</h3>
                <p className={`text-xl font-bold ${resteAConsommer < 0 ? 'text-red-500' : ''}`}>
                  {formatCurrency(resteAConsommer)}
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progression</span>
                <span>{getProgressPercentage(projet.budgetConsomme, projet.budgetPrevu)}%</span>
              </div>
              <Progress 
                value={getProgressPercentage(projet.budgetConsomme, projet.budgetPrevu)} 
                className="h-2.5"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mouvements liés au projet */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Mouvements liés au projet</CardTitle>
        </CardHeader>
        <CardContent>
          {mouvementsLies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun mouvement lié à ce projet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mouvementsLies.map((mouvement) => (
                  <TableRow key={mouvement.id}>
                    <TableCell>{format(new Date(mouvement.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{mouvement.description}</TableCell>
                    <TableCell>
                      <span className={mouvement.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}>
                        {mouvement.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(mouvement.montant)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjetDetail;
