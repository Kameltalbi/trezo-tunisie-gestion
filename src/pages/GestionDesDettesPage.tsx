import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMonths, differenceInMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  PlusCircle, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Types
type TypeDette = 'Crédit' | 'Leasing' | 'Dette fournisseur' | 'Dette associée' | 'Autre';
type ModeRemboursement = 'Mensuel' | 'Trimestriel' | 'In fine';
type StatutDette = 'En cours' | 'Remboursée' | 'En retard';

interface Echeance {
  id: string;
  date: Date;
  montant: number;
  capital: number;
  interet: number;
  capitalRestant: number;
  statut: 'À payer' | 'Payée' | 'En retard';
}

interface Dette {
  id: string;
  nom: string;
  type: TypeDette;
  creancier: string;
  montantTotal: number;
  montantRembourse: number;
  montantRestant: number;
  tauxInteret: number;
  duree: number; // en mois
  echeanceMensuelle: number;
  dateDebut: Date;
  modeRemboursement: ModeRemboursement;
  frequence: number; // en mois (1 = mensuel, 3 = trimestriel)
  statut: StatutDette;
  notes?: string;
  echeances: Echeance[];
}

// Fonctions utilitaires
const calculerEcheanceMensuelle = (montant: number, taux: number, duree: number): number => {
  // Taux mensuel (taux annuel / 12 / 100)
  const tauxMensuel = taux / 12 / 100;
  
  // Formule de calcul d'une mensualité constante
  // M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  // M = mensualité, P = principal (montant emprunté), r = taux mensuel, n = nombre de mois
  
  if (taux === 0) return montant / duree; // Cas particulier : taux zéro
  
  return montant * (tauxMensuel * Math.pow(1 + tauxMensuel, duree)) / (Math.pow(1 + tauxMensuel, duree) - 1);
};

const genererTableauAmortissement = (dette: Omit<Dette, 'id' | 'echeances' | 'montantRembourse' | 'montantRestant' | 'statut'>): Echeance[] => {
  const echeances: Echeance[] = [];
  let capitalRestant = dette.montantTotal;
  
  // Nombre d'échéances selon la fréquence
  const nombreEcheances = dette.duree / dette.frequence;
  
  // Montant de l'échéance (ajusté selon la fréquence)
  const echeance = dette.echeanceMensuelle * dette.frequence;
  
  // Taux périodique (selon la fréquence)
  const tauxPeriodique = dette.tauxInteret / 12 / 100 * dette.frequence;
  
  for (let i = 0; i < nombreEcheances; i++) {
    // Date de l'échéance
    const date = addMonths(dette.dateDebut, i * dette.frequence);
    
    // Intérêts de la période
    const interet = capitalRestant * tauxPeriodique;
    
    // Part de capital
    const capital = echeance - interet;
    
    // Mise à jour du capital restant
    capitalRestant -= capital;
    
    // Statut par défaut
    let statut: 'À payer' | 'Payée' | 'En retard' = 'À payer';
    
    // Si la date est passée, on considère que c'est payé
    if (date < new Date()) {
      statut = 'Payée';
    }
    
    echeances.push({
      id: `new-${i+1}`,
      date,
      montant: echeance,
      capital,
      interet,
      capitalRestant: Math.max(0, capitalRestant), // Éviter les valeurs négatives
      statut
    });
  }
  
  return echeances;
};

// Données de démonstration
const dettesDemo: Dette[] = [
  {
    id: '1',
    nom: 'Prêt immobilier',
    type: 'Crédit',
    creancier: 'Banque Nationale',
    montantTotal: 150000,
    montantRembourse: 45000,
    montantRestant: 105000,
    tauxInteret: 3.5,
    duree: 180, // 15 ans
    echeanceMensuelle: 1072.32,
    dateDebut: new Date(2020, 5, 15),
    modeRemboursement: 'Mensuel',
    frequence: 1,
    statut: 'En cours',
    notes: 'Prêt pour l\'achat des locaux professionnels',
    echeances: [
      {
        id: '1-1',
        date: new Date(2025, 4, 15),
        montant: 1072.32,
        capital: 822.32,
        interet: 250.00,
        capitalRestant: 104177.68,
        statut: 'À payer'
      },
      {
        id: '1-2',
        date: new Date(2025, 5, 15),
        montant: 1072.32,
        capital: 824.69,
        interet: 247.63,
        capitalRestant: 103352.99,
        statut: 'À payer'
      }
    ]
  },
  {
    id: '2',
    nom: 'Leasing véhicule',
    type: 'Leasing',
    creancier: 'AutoFinance',
    montantTotal: 35000,
    montantRembourse: 17500,
    montantRestant: 17500,
    tauxInteret: 4.2,
    duree: 48, // 4 ans
    echeanceMensuelle: 798.63,
    dateDebut: new Date(2023, 1, 10),
    modeRemboursement: 'Mensuel',
    frequence: 1,
    statut: 'En cours',
    echeances: [
      {
        id: '2-1',
        date: new Date(2025, 4, 10),
        montant: 798.63,
        capital: 723.63,
        interet: 75.00,
        capitalRestant: 16776.37,
        statut: 'À payer'
      }
    ]
  },
  {
    id: '3',
    nom: 'Dette fournisseur matériel',
    type: 'Dette fournisseur',
    creancier: 'TechPro Équipements',
    montantTotal: 12000,
    montantRembourse: 12000,
    montantRestant: 0,
    tauxInteret: 0,
    duree: 12,
    echeanceMensuelle: 1000,
    dateDebut: new Date(2024, 0, 5),
    modeRemboursement: 'Mensuel',
    frequence: 1,
    statut: 'Remboursée',
    notes: 'Achat de matériel informatique',
    echeances: []
  },
  {
    id: '4',
    nom: 'Prêt de trésorerie',
    type: 'Crédit',
    creancier: 'Crédit Professionnel',
    montantTotal: 50000,
    montantRembourse: 10000,
    montantRestant: 40000,
    tauxInteret: 5.75,
    duree: 36,
    echeanceMensuelle: 1517.93,
    dateDebut: new Date(2024, 2, 20),
    modeRemboursement: 'Mensuel',
    frequence: 1,
    statut: 'En retard',
    echeances: [
      {
        id: '4-1',
        date: new Date(2025, 3, 20),
        montant: 1517.93,
        capital: 1277.93,
        interet: 240.00,
        capitalRestant: 38722.07,
        statut: 'En retard'
      }
    ]
  }
];
