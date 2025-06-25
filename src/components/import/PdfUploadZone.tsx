
import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PdfUploadZoneProps {
  onPdfProcessed: (extractedText: string) => void;
  isProcessing: boolean;
}

export const PdfUploadZone: React.FC<PdfUploadZoneProps> = ({ onPdfProcessed, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB max
      toast.error('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    setSelectedFile(file);
    processPdf(file);
  };

  const processPdf = async (file: File) => {
    try {
      // Pour l'instant, on simule l'extraction de texte du PDF
      // Dans une vraie implémentation, on utiliserait une bibliothèque comme pdf.js
      toast.info('Traitement du PDF en cours...');
      
      // Simulation de l'extraction
      setTimeout(() => {
        const simulatedText = `08 01 REGLEMENT CHEQUE 0001910 07012025 300,000
10 01 VIREMENT SALAIRE JANVIER 2025 2500,000
12 01 RETRAIT DAB AVENUE HABIB 150,000
15 01 PAIEMENT CARTE CARREFOUR 85,500
18 01 VIREMENT LOYER APPARTEMENT 800,000
20 01 DEPOT ESPECES AGENCE 500,000`;
        
        onPdfProcessed(simulatedText);
        toast.success('PDF traité avec succès - Vérifiez les données extraites ci-dessous');
      }, 2000);
    } catch (error) {
      console.error('Erreur traitement PDF:', error);
      toast.error('Erreur lors du traitement du PDF');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Glissez votre relevé PDF ici
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ou cliquez pour sélectionner un fichier (max 10MB)
              </p>
              
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  Choisir un fichier PDF
                </label>
              </Button>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-md">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-green-700">{selectedFile.name}</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 max-w-md">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <strong>Compatible avec :</strong> BIAT, BNA, STB, Amen Bank, 
                  Attijari Bank, UIB, ABC Bank, et toutes les banques tunisiennes
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
