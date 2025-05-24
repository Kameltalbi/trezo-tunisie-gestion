
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

interface Depense {
  id: number;
  intitule: string;
  categorie: string;
  montant: number;
  dateEcheance: string;
  statut: 'prévue' | 'réglée' | 'en retard';
  notes?: string;
}

const DepensesPage: React.FC = () => {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [open, setOpen] = useState(false);
  const [nouvelleDepense, setNouvelleDepense] = useState<Partial<Depense>>({});

  // Données pour le graphique des dépenses mensuelles
  const spendingData = [
    { month: 'Sep', amount: 800 },
    { month: 'Oct', amount: 2300 },
    { month: 'Nov', amount: 2400 },
    { month: 'Dec', amount: 500 },
    { month: 'Jan', amount: 1600 },
    { month: 'Fév', amount: 1650 },
  ];

  const chartConfig = {
    amount: {
      label: "Montant",
      color: "#3b82f6",
    },
  };

  const ajouterDepense = () => {
    if (!nouvelleDepense.intitule || !nouvelleDepense.montant || !nouvelleDepense.dateEcheance || !nouvelleDepense.categorie) return;
    const nouvelle: Depense = {
      id: depenses.length + 1,
      intitule: nouvelleDepense.intitule,
      categorie: nouvelleDepense.categorie,
      montant: nouvelleDepense.montant,
      dateEcheance: nouvelleDepense.dateEcheance,
      statut: 'prévue',
      notes: nouvelleDepense.notes || '',
    };
    setDepenses([...depenses, nouvelle]);
    setNouvelleDepense({});
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Décaissements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">+ Ajouter un décaissement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="intitule">Intitulé</Label>
                <Input 
                  id="intitule"
                  value={nouvelleDepense.intitule || ''} 
                  onChange={e => setNouvelleDepense({ ...nouvelleDepense, intitule: e.target.value })} 
                  placeholder="Nom du décaissement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select onValueChange={val => setNouvelleDepense({ ...nouvelleDepense, categorie: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Loyer">Loyer</SelectItem>
                    <SelectItem value="Salaires">Salaires</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Achats">Achats</SelectItem>
                    <SelectItem value="Autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant (DT)</Label>
                <Input 
                  id="montant"
                  type="number" 
                  value={nouvelleDepense.montant || ''} 
                  onChange={e => setNouvelleDepense({ ...nouvelleDepense, montant: parseFloat(e.target.value) })} 
                  placeholder="0.000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date d'échéance</Label>
                <Input 
                  id="date"
                  type="date" 
                  value={nouvelleDepense.dateEcheance || ''} 
                  onChange={e => setNouvelleDepense({ ...nouvelleDepense, dateEcheance: e.target.value })} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  value={nouvelleDepense.notes || ''} 
                  onChange={e => setNouvelleDepense({ ...nouvelleDepense, notes: e.target.value })} 
                  placeholder="Notes additionnelles..."
                />
              </div>

              <Button onClick={ajouterDepense} className="w-full bg-blue-600 hover:bg-blue-700">
                Ajouter le décaissement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Graphique des dépenses */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Dépenses</CardTitle>
            </div>
            <Select defaultValue="months">
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="months">Mois</SelectItem>
                <SelectItem value="weeks">Semaines</SelectItem>
                <SelectItem value="days">Jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Dépenses']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpending)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des dépenses */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Liste des décaissements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {depenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucun décaissement enregistré</p>
              <p className="text-sm mt-1">Commencez par ajouter votre premier décaissement</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-medium text-gray-700">Intitulé</TableHead>
                  <TableHead className="font-medium text-gray-700">Catégorie</TableHead>
                  <TableHead className="font-medium text-gray-700">Montant</TableHead>
                  <TableHead className="font-medium text-gray-700">Échéance</TableHead>
                  <TableHead className="font-medium text-gray-700">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depenses.map(dep => (
                  <TableRow key={dep.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{dep.intitule}</TableCell>
                    <TableCell className="text-gray-600">{dep.categorie}</TableCell>
                    <TableCell className="font-medium text-gray-900">{dep.montant.toFixed(3)} DT</TableCell>
                    <TableCell className="text-gray-600">{dep.dateEcheance}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        dep.statut === 'en retard' ? 'bg-red-100 text-red-700' :
                        dep.statut === 'prévue' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {dep.statut}
                      </span>
                    </TableCell>
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

export default DepensesPage;
