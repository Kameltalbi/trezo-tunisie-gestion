
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'payment_proof_submitted' | 'payment_approved' | 'payment_rejected' | 'trial_expiring' | 'account_activated';
  email: string;
  data: {
    user_name?: string;
    plan_name?: string;
    amount?: number;
    reason?: string;
    days_remaining?: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, data }: NotificationRequest = await req.json();

    let subject = '';
    let html = '';

    switch (type) {
      case 'payment_proof_submitted':
        subject = 'Preuve de paiement reçue - Trézo';
        html = `
          <h1>Preuve de paiement reçue</h1>
          <p>Bonjour ${data.user_name},</p>
          <p>Nous avons bien reçu votre preuve de paiement pour le plan ${data.plan_name} d'un montant de ${data.amount} DT.</p>
          <p>Notre équipe va l'examiner dans les plus brefs délais.</p>
          <p>Cordialement,<br>L'équipe Trézo</p>
        `;
        break;

      case 'payment_approved':
        subject = 'Paiement approuvé - Compte activé - Trézo';
        html = `
          <h1>Félicitations ! Votre compte est activé</h1>
          <p>Bonjour ${data.user_name},</p>
          <p>Votre paiement pour le plan ${data.plan_name} a été approuvé.</p>
          <p>Votre compte est maintenant pleinement activé. Vous pouvez profiter de toutes les fonctionnalités de Trézo.</p>
          <p>Cordialement,<br>L'équipe Trézo</p>
        `;
        break;

      case 'payment_rejected':
        subject = 'Problème avec votre paiement - Trézo';
        html = `
          <h1>Problème avec votre preuve de paiement</h1>
          <p>Bonjour ${data.user_name},</p>
          <p>Nous avons examiné votre preuve de paiement mais nous n'avons pas pu la valider.</p>
          <p>Raison : ${data.reason}</p>
          <p>Veuillez vous connecter à votre compte pour soumettre une nouvelle preuve.</p>
          <p>Cordialement,<br>L'équipe Trézo</p>
        `;
        break;

      case 'trial_expiring':
        subject = `Plus que ${data.days_remaining} jours d'essai - Trézo`;
        html = `
          <h1>Votre période d'essai se termine bientôt</h1>
          <p>Bonjour ${data.user_name},</p>
          <p>Il ne vous reste plus que ${data.days_remaining} jour(s) d'essai gratuit.</p>
          <p>Pour continuer à utiliser Trézo, choisissez un plan qui vous convient.</p>
          <p>Cordialement,<br>L'équipe Trézo</p>
        `;
        break;

      case 'account_activated':
        subject = 'Bienvenue sur Trézo - Compte activé';
        html = `
          <h1>Bienvenue sur Trézo !</h1>
          <p>Bonjour ${data.user_name},</p>
          <p>Votre compte Trézo est maintenant activé avec le plan ${data.plan_name}.</p>
          <p>Vous pouvez commencer à gérer vos finances dès maintenant.</p>
          <p>Cordialement,<br>L'équipe Trézo</p>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "Trézo <noreply@trezo.tn>",
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
