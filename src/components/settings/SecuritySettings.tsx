
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Shield, Key, Mail, UserPlus } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsProps {
  isSuperAdmin: boolean;
}

const SecuritySettings = ({ isSuperAdmin }: SecuritySettingsProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const notificationForm = useForm({
    defaultValues: {
      emailNotifications: true,
      securityAlerts: true,
      monthlyReports: false
    }
  });

  const onPasswordSubmit = (data: any) => {
    console.log('Changer mot de passe:', data);
    setIsChangingPassword(false);
    passwordForm.reset();
  };

  const onNotificationSubmit = (data: any) => {
    console.log('Mettre à jour notifications:', data);
  };

  return (
    <div className="space-y-6">
      {/* Changement de mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Sécurité du compte
          </CardTitle>
          <CardDescription>
            Gérez votre mot de passe et les paramètres de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mot de passe</p>
                <p className="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
              </div>
              <Button onClick={() => setIsChangingPassword(true)}>
                Changer le mot de passe
              </Button>
            </div>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe actuel</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit">Changer le mot de passe</Button>
                  <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notifications par email
          </CardTitle>
          <CardDescription>
            Configurez les notifications que vous souhaitez recevoir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
              <FormField
                control={notificationForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notifications générales</FormLabel>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications pour les activités importantes
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={notificationForm.control}
                name="securityAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Alertes de sécurité</FormLabel>
                      <p className="text-sm text-gray-500">
                        Être alerté des connexions suspectes et changements de sécurité
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={notificationForm.control}
                name="monthlyReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Rapports mensuels</FormLabel>
                      <p className="text-sm text-gray-500">
                        Recevoir un résumé mensuel de l'activité du compte
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Sauvegarder les préférences</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Gestion des admins (SuperAdmin uniquement) */}
      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gestion des administrateurs
            </CardTitle>
            <CardDescription>
              Ajouter ou retirer des droits d'administration (SuperAdmin uniquement)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Shield className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Zone sensible</p>
                    <p className="text-sm">
                      Ces paramètres permettent de gérer les droits d'administration de la plateforme.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline">
                Gérer les Super Administrateurs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecuritySettings;
