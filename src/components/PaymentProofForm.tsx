
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreatePaymentProof } from '@/hooks/usePaymentProofs';
import { useUpdateUserProfile } from '@/hooks/useUserProfile';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useNotifications } from '@/hooks/useNotifications';
import { NewPlan } from '@/hooks/useNewPlans';
import { Upload, Receipt, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentProofFormProps {
  plan: NewPlan;
  onSuccess?: () => void;
}

const PaymentProofForm: React.FC<PaymentProofFormProps> = ({ plan, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'check'>('bank_transfer');
  const [referenceInfo, setReferenceInfo] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  
  const createPaymentProof = useCreatePaymentProof();
  const updateProfile = useUpdateUserProfile();
  const { uploadFile, isUploading } = useFileUpload();
  const { sendNotification } = useNotifications();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referenceInfo.trim()) {
      toast.error('Veuillez fournir des informations de référence');
      return;
    }

    try {
      let proofFileUrl = '';
      
      // Upload du fichier si présent
      if (proofFile) {
        const uploadResult = await uploadFile(proofFile, {
          bucket: 'payment-proofs',
          folder: 'proofs',
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
        });

        if (!uploadResult) {
          return; // L'erreur a déjà été affichée par useFileUpload
        }

        proofFileUrl = uploadResult.path;
      }

      // Créer la preuve de paiement
      await createPaymentProof.mutateAsync({
        plan: plan.id,
        amount: plan.price_dt,
        currency: 'TND',
        payment_method: paymentMethod,
        file_url: proofFileUrl,
        reference_info: referenceInfo,
      });

      // Mettre à jour le statut du profil utilisateur
      await updateProfile.mutateAsync({
        account_status: 'pending_activation'
      });

      // Envoyer notification email
      await sendNotification({
        type: 'payment_proof_submitted',
        email: 'admin@trezo.tn', // Email admin
        data: {
          user_name: 'Utilisateur',
          plan_name: plan.name,
          amount: plan.price_dt
        }
      });

      toast.success('Votre preuve de paiement a été envoyée avec succès !');
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la preuve:', error);
      toast.error('Erreur lors de l\'envoi de la preuve de paiement');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Preuve de paiement - Plan {plan.name}
        </CardTitle>
        <CardDescription>
          Montant: {plan.price_dt} DT / an
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Méthode de paiement */}
          <div className="space-y-3">
            <Label>Méthode de paiement</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as 'bank_transfer' | 'check')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Virement bancaire
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="check" id="check" />
                <Label htmlFor="check" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Chèque
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Informations de référence */}
          <div className="space-y-2">
            <Label htmlFor="reference">
              Informations de référence *
            </Label>
            <Textarea
              id="reference"
              placeholder={
                paymentMethod === 'bank_transfer' 
                  ? "Référence du virement, nom de votre banque, date du virement..." 
                  : "Numéro du chèque, nom de votre banque, date d'envoi..."
              }
              value={referenceInfo}
              onChange={(e) => setReferenceInfo(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          {/* Upload de fichier */}
          <div className="space-y-2">
            <Label htmlFor="proof-file">
              Justificatif de paiement (optionnel)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="proof-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Formats acceptés: PDF, JPG, PNG (max 5MB)
            </p>
          </div>

          {/* Informations bancaires pour virement */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Coordonnées bancaires</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Bénéficiaire:</strong> Trezo SAS</p>
                <p><strong>IBAN:</strong> TN59 1234 5678 9012 3456 7890</p>
                <p><strong>BIC:</strong> TREZOTN1XXX</p>
                <p><strong>Banque:</strong> Banque Centrale de Tunisie</p>
              </div>
            </div>
          )}

          {/* Adresse pour chèque */}
          {paymentMethod === 'check' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Adresse d'envoi du chèque</h4>
              <div className="text-sm text-green-800">
                <p>Trezo SAS</p>
                <p>Service Comptabilité</p>
                <p>123 Avenue de la République</p>
                <p>1001 Tunis, Tunisie</p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isUploading || createPaymentProof.isPending}
          >
            {isUploading ? 'Envoi en cours...' : 'Envoyer la preuve de paiement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentProofForm;
