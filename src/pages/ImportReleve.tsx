
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLocalComptes } from '@/hooks/useLocalComptes';
import { useLocalTransactions } from '@/hooks/useLocalTransactions';
import { ManualInputSection } from '@/components/import/ManualInputSection';

interface ValidatedTransaction {
  id: string;
  date: string;
  libelle: string;
  montant: string;
  type: 'encaissement' | 'decaissement';
}

const ImportReleve = () => {
  const { t } = useTranslation();
  const { compteId } = useParams();
  const navigate = useNavigate();
  const { data: comptes = [] } = useLocalComptes();
  const { createTransaction } = useLocalTransactions();

  const [validatedTransactions, setValidatedTransactions] = useState<ValidatedTransaction[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Trouver le compte actuel
  const currentCompte = comptes.find(c => c.id === compteId);

  const handleTransactionsValidated = (transactions: ValidatedTransaction[]) => {
    setValidatedTransactions(transactions);
  };

  const handleFinalImport = async () => {
    if (validatedTransactions.length === 0) {
      toast.error('Aucune transaction à importer');
      return;
    }

    setIsImporting(true);

    try {
      for (const transaction of validatedTransactions) {
        await createTransaction({
          compte_id: compteId,
          type: transaction.type,
          titre: transaction.libelle,
          montant: parseFloat(transaction.montant),
          date_transaction: transaction.date,
          categorie: 'Import relevé',
          statut: 'confirme',
          source: 'import',
        });
      }

      toast.success(`${validatedTransactions.length} transactions importées avec succès !`);
      navigate('/comptes');
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Une erreur est survenue lors de l\'import');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Import de relevé bancaire</h1>
        <p className="text-muted-foreground">
          {currentCompte ? `Import pour le compte: ${currentCompte.nom}` : 'Importez vos transactions facilement'}
        </p>
      </div>

      {/* Instructions */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Comment procéder ?</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Ouvrez votre relevé bancaire PDF sur un autre écran ou imprimez-le</li>
                <li>Saisissez chaque transaction ligne par ligne dans le formulaire ci-dessous</li>
                <li>Vérifiez vos données et validez l'import</li>
              </ol>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>✓ Compatible avec toutes les banques :</strong> BIAT, BNA, STB, Amen Bank, 
                  Attijari Bank, UIB, ABC Bank, Banque Zitouna, et toutes les autres banques tunisiennes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saisie manuelle */}
      <ManualInputSection
        onTransactionsReady={handleTransactionsValidated}
      />

      {/* Import final */}
      {validatedTransactions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Prêt à importer !
                </h3>
                <p className="text-sm text-green-700">
                  {validatedTransactions.length} transaction(s) validée(s) et prête(s) à être importée(s) 
                  dans le compte <strong>{currentCompte?.nom}</strong>
                </p>
              </div>

              <Button
                onClick={handleFinalImport}
                disabled={isImporting}
                size="lg"
                className="gap-2"
              >
                <Check className="h-5 w-5" />
                {isImporting ? 'Import en cours...' : `Finaliser l'import (${validatedTransactions.length} transactions)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bloc support */}
      <Card className="mt-6">
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
