
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Users, Mail, Clock, Shield } from 'lucide-react';

const PlatformSettings = () => {
  const [trialDuration, setTrialDuration] = useState(14);
  const [trialMessage, setTrialMessage] = useState('Votre période d\'essai expire bientôt. Souscrivez à un plan pour continuer.');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoActivation, setAutoActivation] = useState(false);

  const handleSaveSettings = () => {
    console.log('Sauvegarder les paramètres');
    // Logique de sauvegarde
  };

  return (
    <div className="space-y-6">
      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres Généraux
          </CardTitle>
          <CardDescription>
            Configuration générale de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="trialDuration">Durée de l'essai (jours)</Label>
              <Input
                id="trialDuration"
                type="number"
                value={trialDuration}
                onChange={(e) => setTrialDuration(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Activation automatique</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoActivation}
                  onCheckedChange={setAutoActivation}
                />
                <span className="text-sm text-gray-600">
                  Activer automatiquement les comptes après paiement
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trialMessage">Message d'expiration d'essai</Label>
            <Textarea
              id="trialMessage"
              value={trialMessage}
              onChange={(e) => setTrialMessage(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notifications Email
          </CardTitle>
          <CardDescription>
            Configuration des emails automatiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notifications activées</div>
              <div className="text-sm text-gray-600">
                Envoyer des emails de confirmation et rappel
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              Configurer templates
            </Button>
            <Button variant="outline">
              Tester envoi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des Superadmins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des Superadmins
          </CardTitle>
          <CardDescription>
            Ajouter ou retirer des privilèges superadmin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Email de l'utilisateur à promouvoir"
              className="flex-1"
            />
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Promouvoir
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Superadmins actuels: kamel.talbi@yahoo.fr
          </div>
        </CardContent>
      </Card>

      {/* Logs d'activité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Logs d'Activité
          </CardTitle>
          <CardDescription>
            Dernières actions critiques sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span>Activation du compte "Entreprise ABC"</span>
              <span className="text-gray-500">20/01/2024 14:30</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Modification du plan "Pro" - prix mis à jour</span>
              <span className="text-gray-500">19/01/2024 09:15</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Rejet de preuve de paiement - "Société DEF"</span>
              <span className="text-gray-500">18/01/2024 16:45</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            Voir tous les logs
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};

export default PlatformSettings;
