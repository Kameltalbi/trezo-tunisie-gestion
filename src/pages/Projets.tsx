import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, CheckCircle, Clock, PauseCircle, List } from 'lucide-react';
import { format } from 'date-fns';

import { Projet } from '@/types/parametres';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

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

// Mocked linked transactions data
const mockMouvements = [
  { id: 'd1', date: '2023-02-10', description: 'Achat matériaux', montant: 120000, type: 'décaissement' },
  { id: 'd2', date: '2023-04-15', description: 'Main d\'oeuvre', montant: 150000, type: 'décaissement' },
  { id: 'd3', date: '2023-06-20', description: 'Finitions', montant: 50000, type: 'décaissement' },
  { id: 'e1', date: '2023-03-01', description: 'Acompte client', montant: 200000, type: 'encaissement' },
  { id: 'e2', date: '2023-07-15', description: 'Paiement intermédiaire', montant: 150000, type: 'encaissement' },
];

const ProjetStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'actif':
      return (
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">Actif</span>
        </div>
      );
    case 'termine':
      return (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-blue-500 font-medium">Terminé</span>
        </div>
      );
    case 'en_attente':
      return (
        <div className="flex items-center">
          <PauseCircle className="w-4 h-4 mr-1 text-amber-500" />
          <span className="text-amber-500 font-medium">En attente</span>
        </div>
      );
    default:
      return null;
  }
};

const ProjetDetailsDialog: React.FC<{ projet: Projet }> = ({ projet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const resteAConsommer = projet.budgetPrevu - projet.budgetConsomme;
  
  // Filter movements linked to this project
  const mouvementsLies = mockMouvements.filter(m => 
    projet.encaissements.includes(m.id) || projet.decaissements.includes(m.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <List className="h-4 w-4 mr-1" />
          Détails
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Détails du projet: {projet.nom}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Budget prévu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(projet.budgetPrevu)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Consommé à date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(projet.budgetConsomme)}</div>
                <div className="mt-2">
                  <Progress 
                    value={Math.round((projet.budgetConsomme / projet.budgetPrevu) * 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reste à consommer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${resteAConsommer < 0 ? 'text-red-500' : ''}`}>
                  {formatCurrency(resteAConsommer)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Liste des mouvements liés</h3>
            {mouvementsLies.length === 0 ? (
              <p className="text-muted-foreground">Aucun mouvement lié à ce projet</p>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjetsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Projet[]>(mockProjets);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Projet>>({ statut: 'en_attente' });
  const [currentProject, setCurrentProject] = useState<Projet | null>(null);
  const [activeTab, setActiveTab] = useState('tous');

  const handleCreateProject = () => {
    if (!newProject.nom || !newProject.budgetPrevu || !newProject.dateDebut) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const createdProject: Projet = {
      id: `p${projects.length + 1}`,
      nom: newProject.nom,
      description: newProject.description || '',
      budgetPrevu: Number(newProject.budgetPrevu),
      budgetConsomme: 0,
      dateDebut: newProject.dateDebut,
      dateFin: null,
      statut: newProject.statut as 'actif' | 'termine' | 'en_attente',
      encaissements: [],
      decaissements: []
    };

    setProjects([...projects, createdProject]);
    setNewProject({ statut: 'en_attente' });
    setIsNewProjectDialogOpen(false);
    toast.success('Projet créé avec succès');
  };

  const handleUpdateProject = () => {
    if (!currentProject) return;
    
    setProjects(projects.map(p => 
      p.id === currentProject.id ? currentProject : p
    ));
    setIsEditProjectDialogOpen(false);
    setCurrentProject(null);
    toast.success('Projet mis à jour avec succès');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Projet supprimé avec succès');
  };

  const handleNavigateToDetail = (id: string) => {
    navigate(`/projets/${id}`);
  };

  const filteredProjects = activeTab === 'tous' 
    ? projects
    : projects.filter(p => p.statut === activeTab);

  const getTotalBudget = () => {
    return projects.reduce((acc, proj) => acc + proj.budgetPrevu, 0);
  };

  const getConsumedBudget = () => {
    return projects.reduce((acc, proj) => acc + proj.budgetConsomme, 0);
  };

  const getRemainingBudget = () => {
    return getTotalBudget() - getConsumedBudget();
  };

  const getProgressPercentage = (consumed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((consumed / total) * 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projets</h1>
        
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau Projet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau projet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom du projet*</Label>
                <Input 
                  id="nom" 
                  value={newProject.nom || ''} 
                  onChange={(e) => setNewProject({...newProject, nom: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newProject.description || ''} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budgetPrevu">Budget prévu (DT)*</Label>
                  <Input 
                    id="budgetPrevu"
                    type="number"
                    value={newProject.budgetPrevu || ''} 
                    onChange={(e) => setNewProject({...newProject, budgetPrevu: Number(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateDebut">Date de début*</Label>
                  <Input 
                    id="dateDebut"
                    type="date" 
                    value={newProject.dateDebut || ''} 
                    onChange={(e) => setNewProject({...newProject, dateDebut: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statut">Statut</Label>
                <Select 
                  value={newProject.statut}
                  onValueChange={(value) => setNewProject({...newProject, statut: value as 'actif' | 'termine' | 'en_attente'})}
                >
                  <SelectTrigger>
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
                <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateProject}>Créer le projet</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg lg:text-xl font-bold">{formatCurrency(getTotalBudget())}</div>
            <p className="text-xs text-muted-foreground">Tous projets confondus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consommé à date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg lg:text-xl font-bold">{formatCurrency(getConsumedBudget())}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{getProgressPercentage(getConsumedBudget(), getTotalBudget())}%</span>
              </div>
              <Progress value={getProgressPercentage(getConsumedBudget(), getTotalBudget())} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reste à consommer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={`text-lg lg:text-xl font-bold ${getRemainingBudget() < 0 ? 'text-red-500' : ''}`}>
              {formatCurrency(getRemainingBudget())}
            </div>
            <p className="text-xs text-muted-foreground">
              {getRemainingBudget() < 0 ? 'Dépassement budgétaire' : 'Budget restant'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg lg:text-xl font-bold">{projects.filter(p => p.statut === 'actif').length}</div>
            <p className="text-xs text-muted-foreground">Sur {projects.length} projets au total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="actif">Actifs</TabsTrigger>
          <TabsTrigger value="en_attente">En attente</TabsTrigger>
          <TabsTrigger value="termine">Terminés</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du projet</TableHead>
                    <TableHead>Budget prévu</TableHead>
                    <TableHead>Consommé à date</TableHead>
                    <TableHead>Reste à consommer</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((projet) => {
                    const resteAConsommer = projet.budgetPrevu - projet.budgetConsomme;
                    return (
                      <TableRow key={projet.id}>
                        <TableCell className="font-medium">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-left" 
                            onClick={() => handleNavigateToDetail(projet.id)}
                          >
                            {projet.nom}
                          </Button>
                        </TableCell>
                        <TableCell>{formatCurrency(projet.budgetPrevu)}</TableCell>
                        <TableCell>{formatCurrency(projet.budgetConsomme)}</TableCell>
                        <TableCell className={resteAConsommer < 0 ? 'text-red-500' : ''}>
                          {formatCurrency(resteAConsommer)}
                        </TableCell>
                        <TableCell>
                          <div className="w-full max-w-[100px] flex items-center gap-2">
                            <Progress 
                              value={getProgressPercentage(projet.budgetConsomme, projet.budgetPrevu)} 
                              className="h-2"
                            />
                            <span className="text-xs font-medium">
                              {getProgressPercentage(projet.budgetConsomme, projet.budgetPrevu)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(projet.dateDebut), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <ProjetStatusBadge status={projet.statut} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ProjetDetailsDialog projet={projet} />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setCurrentProject(projet);
                                setIsEditProjectDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteProject(projet.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucun projet trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Project Dialog */}
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          {currentProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nom">Nom du projet</Label>
                <Input 
                  id="edit-nom" 
                  value={currentProject.nom}
                  onChange={(e) => setCurrentProject({...currentProject, nom: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-budgetPrevu">Budget prévu (DT)</Label>
                  <Input 
                    id="edit-budgetPrevu"
                    type="number"
                    value={currentProject.budgetPrevu}
                    onChange={(e) => setCurrentProject({...currentProject, budgetPrevu: Number(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-budgetConsomme">Budget consommé (DT)</Label>
                  <Input 
                    id="edit-budgetConsomme"
                    type="number"
                    value={currentProject.budgetConsomme}
                    onChange={(e) => setCurrentProject({...currentProject, budgetConsomme: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-dateDebut">Date de début</Label>
                  <Input 
                    id="edit-dateDebut"
                    type="date" 
                    value={currentProject.dateDebut}
                    onChange={(e) => setCurrentProject({...currentProject, dateDebut: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dateFin">Date de fin</Label>
                  <Input 
                    id="edit-dateFin"
                    type="date" 
                    value={currentProject.dateFin || ''}
                    onChange={(e) => setCurrentProject({...currentProject, dateFin: e.target.value || null})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-statut">Statut</Label>
                <Select 
                  value={currentProject.statut}
                  onValueChange={(value) => setCurrentProject({...currentProject, statut: value as 'actif' | 'termine' | 'en_attente'})}
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
                <Button variant="outline" onClick={() => setIsEditProjectDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleUpdateProject}>Mettre à jour</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjetsPage;
