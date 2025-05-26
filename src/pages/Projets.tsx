
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, CheckCircle, Clock, PauseCircle, List, XCircle } from 'lucide-react';
import { format } from 'date-fns';

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
import { useProjets, useCreateProjet, Projet } from '@/hooks/useProjets';
import { useEncaissements } from '@/hooks/useEncaissements';
import { useDecaissements } from '@/hooks/useDecaissements';

const ProjetStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation();
  
  switch (status) {
    case 'actif':
      return (
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">{t('projets.active')}</span>
        </div>
      );
    case 'termine':
      return (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-blue-500 font-medium">{t('projets.completed')}</span>
        </div>
      );
    case 'en_attente':
      return (
        <div className="flex items-center">
          <PauseCircle className="w-4 h-4 mr-1 text-amber-500" />
          <span className="text-amber-500 font-medium">{t('projets.pending')}</span>
        </div>
      );
    case 'annule':
      return (
        <div className="flex items-center">
          <XCircle className="w-4 h-4 mr-1 text-red-500" />
          <span className="text-red-500 font-medium">{t('projets.cancelled')}</span>
        </div>
      );
    default:
      return null;
  }
};

const ProjetDetailsDialog: React.FC<{ projet: Projet }> = ({ projet }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: encaissements = [] } = useEncaissements();
  const { data: decaissements = [] } = useDecaissements();
  
  const resteAConsommer = projet.budget_prevu - projet.budget_consomme;
  
  // Filter movements linked to this project
  const mouvementsLies = useMemo(() => {
    const encaissementsLies = encaissements
      .filter(enc => enc.projet_id === projet.id && enc.statut === 'confirme')
      .map(enc => ({
        id: enc.id,
        date: enc.date_transaction,
        description: enc.titre,
        montant: enc.montant,
        type: 'encaissement' as const
      }));
    
    const decaissementsLies = decaissements
      .filter(dec => dec.projet_id === projet.id && dec.statut === 'confirme')
      .map(dec => ({
        id: dec.id,
        date: dec.date_transaction,
        description: dec.titre,
        montant: dec.montant,
        type: 'décaissement' as const
      }));
    
    return [...encaissementsLies, ...decaissementsLies]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [encaissements, decaissements, projet.id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <List className="h-4 w-4 mr-1" />
          {t('projets.details')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t('projets.details')}: {projet.nom}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('projets.budget_planned')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(projet.budget_prevu)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('projets.budget_consumed')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(projet.budget_consomme)}</div>
                <div className="mt-2">
                  <Progress 
                    value={Math.round((projet.budget_consomme / projet.budget_prevu) * 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {resteAConsommer < 0 ? t('projets.budget_overrun') : t('projets.remaining_budget')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${resteAConsommer < 0 ? 'text-red-500' : ''}`}>
                  {formatCurrency(resteAConsommer)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">{t('projets.movements')}</h3>
            {mouvementsLies.length === 0 ? (
              <p className="text-muted-foreground">{t('projets.no_movements')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactions.date')}</TableHead>
                    <TableHead>{t('projets.description')}</TableHead>
                    <TableHead>{t('transactions.type')}</TableHead>
                    <TableHead className="text-right">{t('transactions.amount')}</TableHead>
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
  const { data: projects = [], isLoading } = useProjets();
  const createProjet = useCreateProjet();
  
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Projet>>({ statut: 'en_attente' });
  const [currentProject, setCurrentProject] = useState<Projet | null>(null);
  const [activeTab, setActiveTab] = useState('tous');

  const handleCreateProject = async () => {
    if (!newProject.nom || !newProject.budget_prevu || !newProject.date_debut) {
      toast.error(t('projets.fill_required'));
      return;
    }

    try {
      await createProjet.mutateAsync({
        nom: newProject.nom,
        description: newProject.description || '',
        budget_prevu: Number(newProject.budget_prevu),
        budget_consomme: 0,
        date_debut: newProject.date_debut,
        date_fin: newProject.date_fin || undefined,
        statut: newProject.statut as 'actif' | 'termine' | 'en_attente' | 'annule'
      });

      setNewProject({ statut: 'en_attente' });
      setIsNewProjectDialogOpen(false);
      toast.success(t('projets.created_success'));
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du projet');
    }
  };

  const handleNavigateToDetail = (id: string) => {
    navigate(`/projets/${id}`);
  };

  const filteredProjects = activeTab === 'tous' 
    ? projects
    : projects.filter(p => p.statut === activeTab);

  const getTotalBudget = () => {
    return projects.reduce((acc, proj) => acc + proj.budget_prevu, 0);
  };

  const getConsumedBudget = () => {
    return projects.reduce((acc, proj) => acc + proj.budget_consomme, 0);
  };

  const getRemainingBudget = () => {
    return getTotalBudget() - getConsumedBudget();
  };

  const getProgressPercentage = (consumed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((consumed / total) * 100);
  };

  if (isLoading) {
    return <div className="p-6">{t('projets.loading')}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('projets.title')}</h1>
        
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('projets.new_project')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('projets.new_project')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">{t('projets.name')} *</Label>
                <Input 
                  id="nom" 
                  value={newProject.nom || ''} 
                  onChange={(e) => setNewProject({...newProject, nom: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t('projets.description')}</Label>
                <Textarea 
                  id="description" 
                  value={newProject.description || ''} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budgetPrevu">{t('projets.budget_planned')} (DT) *</Label>
                  <Input 
                    id="budgetPrevu"
                    type="number"
                    value={newProject.budget_prevu || ''} 
                    onChange={(e) => setNewProject({...newProject, budget_prevu: Number(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateDebut">{t('projets.start_date')} *</Label>
                  <Input 
                    id="dateDebut"
                    type="date" 
                    value={newProject.date_debut || ''} 
                    onChange={(e) => setNewProject({...newProject, date_debut: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statut">{t('projets.status')}</Label>
                <Select 
                  value={newProject.statut}
                  onValueChange={(value) => setNewProject({...newProject, statut: value as 'actif' | 'termine' | 'en_attente' | 'annule'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('projets.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="actif">{t('projets.active')}</SelectItem>
                      <SelectItem value="en_attente">{t('projets.pending')}</SelectItem>
                      <SelectItem value="termine">{t('projets.completed')}</SelectItem>
                      <SelectItem value="annule">{t('projets.cancelled')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>
                  {t('projets.cancel')}
                </Button>
                <Button onClick={handleCreateProject} disabled={createProjet.isPending}>
                  {createProjet.isPending ? t('projets.loading') : t('projets.create')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('projets.total_budget')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg lg:text-xl font-bold">{formatCurrency(getTotalBudget())}</div>
            <p className="text-xs text-muted-foreground">Tous projets confondus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('projets.budget_consumed')}</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {getRemainingBudget() < 0 ? t('projets.budget_overrun') : t('projets.remaining_budget')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={`text-lg lg:text-xl font-bold ${getRemainingBudget() < 0 ? 'text-red-500' : ''}`}>
              {formatCurrency(getRemainingBudget())}
            </div>
            <p className="text-xs text-muted-foreground">
              {getRemainingBudget() < 0 ? t('projets.budget_overrun') : 'Budget restant'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('projets.active_projects')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg lg:text-xl font-bold">{projects.filter(p => p.statut === 'actif').length}</div>
            <p className="text-xs text-muted-foreground">Sur {projects.length} projets au total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tous">{t('projets.all')}</TabsTrigger>
          <TabsTrigger value="actif">{t('projets.actifs')}</TabsTrigger>
          <TabsTrigger value="en_attente">{t('projets.en_attente')}</TabsTrigger>
          <TabsTrigger value="termine">{t('projets.termines')}</TabsTrigger>
          <TabsTrigger value="annule">{t('projets.annule')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('projets.name')}</TableHead>
                    <TableHead>{t('projets.budget_planned')}</TableHead>
                    <TableHead>{t('projets.budget_consumed')}</TableHead>
                    <TableHead>{t('projets.remaining_budget')}</TableHead>
                    <TableHead>{t('projets.progress')}</TableHead>
                    <TableHead>{t('projets.start_date')}</TableHead>
                    <TableHead>{t('projets.status')}</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((projet) => {
                    const resteAConsommer = projet.budget_prevu - projet.budget_consomme;
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
                        <TableCell>{formatCurrency(projet.budget_prevu)}</TableCell>
                        <TableCell>{formatCurrency(projet.budget_consomme)}</TableCell>
                        <TableCell className={resteAConsommer < 0 ? 'text-red-500' : ''}>
                          {formatCurrency(resteAConsommer)}
                        </TableCell>
                        <TableCell>
                          <div className="w-full max-w-[100px] flex items-center gap-2">
                            <Progress 
                              value={getProgressPercentage(projet.budget_consomme, projet.budget_prevu)} 
                              className="h-2"
                            />
                            <span className="text-xs font-medium">
                              {getProgressPercentage(projet.budget_consomme, projet.budget_prevu)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(projet.date_debut), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <ProjetStatusBadge status={projet.statut} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ProjetDetailsDialog projet={projet} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {t('projets.no_projects')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjetsPage;
