import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FileText, Eye, Check, X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useLocalComptes } from '@/hooks/useLocalComptes';
import { useLocalTransactions } from '@/hooks/useLocalTransactions';

interface ParsedTransaction {
  id: string;
  date: string;
  libelle: string;
  montant: string;
  type: 'encaissement' | 'decaissement';
  compte_id?: string;
  isValid: boolean;
}

const ImportReleve = () => {
  const { t } = useTranslation();
  const { compteId } = useParams();
  const navigate = useNavigate();
  const { data: comptes = [] } = useLocalComptes();
  const { createTransaction } = useLocalTransactions();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Trouver le compte actuel
  const currentCompte = comptes.find(c => c.id === compteId);

  // Exemple de données plus complet pour tester
  const exampleData = `08 01 REGLEMENT CHEQUE 0001910 07012025 300,000
10 01 VIREMENT SALAIRE JANVIER 2025 2500,000
12 01 RETRAIT DAB AVENUE HABIB 150,000
15 01 PAIEMENT CARTE CARREFOUR 85,500
18 01 VIREMENT LOYER APPARTEMENT 800,000
20 01 DEPOT ESPECES AGENCE 500,000
22 01 PRELEVEMENT EDF FACTURE 120,750
25 01 RETRAIT DAB CENTRE VILLE 200,000
28 01 VIREMENT RECU FREELANCE 1200,000
30 01 FRAIS BANCAIRES MENSUELS 15,000
02 02 REMBOURSEMENT ASSURANCE 250,000
05 02 ACHAT PHARMACIE CARTE 28,900`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      toast.success(`${file.name} a été sélectionné pour archivage`);
    } else {
      toast.error('Veuillez sélectionner un fichier PDF valide');
    }
  };

  const copyExampleData = () => {
    navigator.clipboard.writeText(exampleData).then(() => {
      setPastedText(exampleData);
      toast.success('12 lignes d\'exemple copiées dans la zone de texte');
    }).catch(() => {
      toast.error('Erreur lors de la copie');
    });
  };

  const parseTransactionLine = (line: string, index: number): ParsedTransaction => {
    // Analyse basique : séparer par espaces et essayer de détecter les patterns
    const parts = line.trim().split(/\s+/);
    
    // Recherche de patterns de date (DD MM ou DD/MM/YYYY)
    let dateIndex = -1;
    let date = '';
    
    for (let i = 0; i < Math.min(3, parts.length); i++) {
      const part = parts[i];
      // Pattern DD MM (comme "08 01")
      if (part.match(/^\d{1,2}$/) && i < parts.length - 1 && parts[i + 1].match(/^\d{1,2}$/)) {
        date = `${part.padStart(2, '0')}/${parts[i + 1].padStart(2, '0')}/2025`;
        dateIndex = i + 1;
        break;
      }
      // Pattern DD/MM/YYYY
      if (part.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        date = part;
        dateIndex = i;
        break;
      }
    }

    // Recherche du montant (derniers éléments numériques)
    let montant = '';
    let montantIndex = -1;
    
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (part.match(/^\d+([,\.]\d{1,3})*$/)) {
        montant = part.replace(',', '.');
        montantIndex = i;
        break;
      }
    }

    // Le libellé est tout ce qui reste entre la date et le montant
    let libelle = '';
    const startIndex = Math.max(0, dateIndex + 1);
    const endIndex = montantIndex > 0 ? montantIndex : parts.length - 1;
    
    if (startIndex < endIndex) {
      libelle = parts.slice(startIndex, endIndex).join(' ');
    } else {
      libelle = parts.slice(startIndex).join(' ');
    }

    // Détection du type (basique)
    const type: 'encaissement' | 'decaissement' = 
      libelle.toLowerCase().includes('virement') || 
      libelle.toLowerCase().includes('depot') ||
      libelle.toLowerCase().includes('credit') ? 'encaissement' : 'decaissement';

    return {
      id: `temp-${index}`,
      date: date || new Date().toISOString().split('T')[0],
      libelle: libelle || line.trim(),
      montant: montant || '0',
      type,
      compte_id: compteId,
      isValid: !!(date && libelle && montant)
    };
  };

  const handleAnalyze = () => {
    if (!pastedText.trim()) {
      toast.error('Veuillez coller des lignes de relevé bancaire');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation d'un délai d'analyse
    setTimeout(() => {
      const lines = pastedText.split('\n').filter(line => line.trim());
      const parsed = lines.map((line, index) => parseTransactionLine(line, index));
      setParsedTransactions(parsed);
      setIsAnalyzing(false);
      
      toast.success(`${parsed.length} lignes analysées`);
    }, 1000);
  };

  const updateTransaction = (id: string, field: keyof ParsedTransaction, value: string) => {
    setParsedTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, [field]: value, isValid: true }
          : t
      )
    );
  };

  const handleImport = async () => {
    const validTransactions = parsedTransactions.filter(t => t.isValid && t.montant !== '0');
    
    if (validTransactions.length === 0) {
      toast.error('Aucune transaction valide à importer');
      return;
    }

    setIsImporting(true);

    try {
      for (const transaction of validTransactions) {
        await createTransaction({
          compte_id: transaction.compte_id,
          type: transaction.type,
          titre: transaction.libelle,
          montant: parseFloat(transaction.montant),
          date_transaction: transaction.date,
          categorie: 'Import relevé',
          statut: 'confirme',
          source: 'import',
        });
      }

      toast.success(`${validTransactions.length} transactions importées`);
      navigate('/comptes');
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Une erreur est survenue lors de l\'import');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Import de relevé bancaire</h1>
        <p className="text-muted-foreground">
          {currentCompte ? `Compte: ${currentCompte.nom}` : 'Importez vos transactions depuis votre relevé bancaire'}
        </p>
      </div>

      {/* Bloc 1: Upload PDF */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Téléverser le relevé PDF (archivage uniquement)
          </CardTitle>
          <CardDescription>
            Optionnel - Ce fichier sera conservé pour vos archives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="max-w-md"
            />
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FileText className="h-4 w-4" />
                {selectedFile.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bloc 2: Zone de collage améliorée */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Coller ici les lignes de votre relevé bancaire</CardTitle>
          <CardDescription>
            Copiez les lignes directement depuis votre PDF et collez-les ci-dessous, ou utilisez les données d'exemple pour tester
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Collez vos lignes de relevé ici..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          
          <div className="p-4 bg-muted rounded-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">Exemple de format attendu (12 lignes) :</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyExampleData}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Essayer avec ces données
              </Button>
            </div>
            <code className="text-xs text-muted-foreground whitespace-pre-line max-h-32 overflow-y-auto block">
              {exampleData}
            </code>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Comment copier depuis votre PDF :</p>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Ouvrez votre relevé PDF dans votre navigateur ou lecteur PDF</li>
              <li>2. Sélectionnez les lignes de transactions (date + libellé + montant)</li>
              <li>3. Copiez (Ctrl+C) et collez ici (Ctrl+V)</li>
              <li>4. Cliquez sur "Analyser les lignes" ci-dessous</li>
            </ol>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={!pastedText.trim() || isAnalyzing}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser les lignes'}
          </Button>
        </CardContent>
      </Card>

      {/* Bloc 3: Aperçu et validation */}
      {parsedTransactions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Aperçu et validation des transactions</CardTitle>
            <CardDescription>
              Vérifiez et modifiez les données avant l'import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Compte</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Input
                        type="date"
                        value={transaction.date}
                        onChange={(e) => updateTransaction(transaction.id, 'date', e.target.value)}
                        className="w-40"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.libelle}
                        onChange={(e) => updateTransaction(transaction.id, 'libelle', e.target.value)}
                        className="min-w-60"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={transaction.montant}
                        onChange={(e) => updateTransaction(transaction.id, 'montant', e.target.value)}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={transaction.type}
                        onValueChange={(value: 'encaissement' | 'decaissement') => 
                          updateTransaction(transaction.id, 'type', value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="encaissement">Encaissement</SelectItem>
                          <SelectItem value="decaissement">Décaissement</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={transaction.compte_id || ''}
                        onValueChange={(value) => updateTransaction(transaction.id, 'compte_id', value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Sélectionner un compte" />
                        </SelectTrigger>
                        <SelectContent>
                          {comptes.map((compte) => (
                            <SelectItem key={compte.id} value={compte.id}>
                              {compte.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {transaction.isValid ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleImport}
                disabled={parsedTransactions.filter(t => t.isValid).length === 0 || isImporting}
                size="lg"
              >
                <Check className="h-4 w-4 mr-2" />
                {isImporting ? 'Import en cours...' : `Importer ${parsedTransactions.filter(t => t.isValid).length} transactions`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bloc 4: Contact support */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Besoin d'aide avec l'import de vos relevés ?</p>
            <div className="flex justify-center gap-6">
              <a href="mailto:contact@trezo.pro" className="text-primary hover:underline">
                📧 contact@trezo.pro
              </a>
              <a href="tel:+21655053505" className="text-primary hover:underline">
                📞 +216 55 053 505
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportReleve;
