export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comptes_bancaires: {
        Row: {
          banque: string
          created_at: string
          devise_id: string | null
          id: string
          is_active: boolean | null
          nom: string
          numero_compte: string | null
          solde_actuel: number
          solde_initial: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          banque: string
          created_at?: string
          devise_id?: string | null
          id?: string
          is_active?: boolean | null
          nom: string
          numero_compte?: string | null
          solde_actuel?: number
          solde_initial?: number
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banque?: string
          created_at?: string
          devise_id?: string | null
          id?: string
          is_active?: boolean | null
          nom?: string
          numero_compte?: string | null
          solde_actuel?: number
          solde_initial?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comptes_bancaires_devise_id_fkey"
            columns: ["devise_id"]
            isOneToOne: false
            referencedRelation: "devises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comptes_bancaires_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      decaissements: {
        Row: {
          categorie: string
          compte_id: string | null
          created_at: string
          date_transaction: string
          description: string | null
          id: string
          montant: number
          projet_id: string | null
          recurrence: string | null
          reference: string | null
          sous_categorie: string | null
          statut: string
          titre: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categorie: string
          compte_id?: string | null
          created_at?: string
          date_transaction: string
          description?: string | null
          id?: string
          montant: number
          projet_id?: string | null
          recurrence?: string | null
          reference?: string | null
          sous_categorie?: string | null
          statut?: string
          titre: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categorie?: string
          compte_id?: string | null
          created_at?: string
          date_transaction?: string
          description?: string | null
          id?: string
          montant?: number
          projet_id?: string | null
          recurrence?: string | null
          reference?: string | null
          sous_categorie?: string | null
          statut?: string
          titre?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decaissements_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_bancaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decaissements_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decaissements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      devises: {
        Row: {
          code: string
          created_at: string
          decimales: number
          id: string
          is_default: boolean | null
          nom: string
          separateur: string
          symbole: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          decimales?: number
          id?: string
          is_default?: boolean | null
          nom: string
          separateur?: string
          symbole: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          decimales?: number
          id?: string
          is_default?: boolean | null
          nom?: string
          separateur?: string
          symbole?: string
          updated_at?: string
        }
        Relationships: []
      }
      encaissements: {
        Row: {
          categorie: string
          compte_id: string | null
          created_at: string
          date_transaction: string
          description: string | null
          id: string
          montant: number
          projet_id: string | null
          recurrence: string | null
          reference: string | null
          sous_categorie: string | null
          statut: string
          titre: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categorie: string
          compte_id?: string | null
          created_at?: string
          date_transaction: string
          description?: string | null
          id?: string
          montant: number
          projet_id?: string | null
          recurrence?: string | null
          reference?: string | null
          sous_categorie?: string | null
          statut?: string
          titre: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categorie?: string
          compte_id?: string | null
          created_at?: string
          date_transaction?: string
          description?: string | null
          id?: string
          montant?: number
          projet_id?: string | null
          recurrence?: string | null
          reference?: string | null
          sous_categorie?: string | null
          statut?: string
          titre?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encaissements_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_bancaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encaissements_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encaissements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      entreprises: {
        Row: {
          adresse: string | null
          capital: number | null
          created_at: string
          devise_id: string | null
          email: string | null
          forme_juridique: string | null
          id: string
          logo_url: string | null
          nom: string
          secteur_activite: string | null
          siret: string | null
          telephone: string | null
          tva: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adresse?: string | null
          capital?: number | null
          created_at?: string
          devise_id?: string | null
          email?: string | null
          forme_juridique?: string | null
          id?: string
          logo_url?: string | null
          nom: string
          secteur_activite?: string | null
          siret?: string | null
          telephone?: string | null
          tva?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adresse?: string | null
          capital?: number | null
          created_at?: string
          devise_id?: string | null
          email?: string | null
          forme_juridique?: string | null
          id?: string
          logo_url?: string | null
          nom?: string
          secteur_activite?: string | null
          siret?: string | null
          telephone?: string | null
          tva?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flux_tresorerie: {
        Row: {
          categorie: string | null
          compte_id: string | null
          created_at: string
          date_prevision: string
          description: string | null
          id: string
          montant_prevu: number
          montant_realise: number | null
          statut: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categorie?: string | null
          compte_id?: string | null
          created_at?: string
          date_prevision: string
          description?: string | null
          id?: string
          montant_prevu: number
          montant_realise?: number | null
          statut?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categorie?: string | null
          compte_id?: string | null
          created_at?: string
          date_prevision?: string
          description?: string | null
          id?: string
          montant_prevu?: number
          montant_realise?: number | null
          statut?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flux_tresorerie_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_bancaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flux_tresorerie_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gestion_dettes: {
        Row: {
          created_at: string
          date_echeance: string | null
          description: string | null
          id: string
          montant_initial: number
          montant_restant: number
          nom_tiers: string
          statut: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_echeance?: string | null
          description?: string | null
          id?: string
          montant_initial: number
          montant_restant: number
          nom_tiers: string
          statut?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_echeance?: string | null
          description?: string | null
          id?: string
          montant_initial?: number
          montant_restant?: number
          nom_tiers?: string
          statut?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gestion_dettes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      objectifs: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string
          description: string | null
          id: string
          nom: string
          statut: string
          type: string
          updated_at: string
          user_id: string
          valeur_actuelle: number
          valeur_cible: number
        }
        Insert: {
          created_at?: string
          date_debut: string
          date_fin: string
          description?: string | null
          id?: string
          nom: string
          statut?: string
          type: string
          updated_at?: string
          user_id: string
          valeur_actuelle?: number
          valeur_cible: number
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string
          description?: string | null
          id?: string
          nom?: string
          statut?: string
          type?: string
          updated_at?: string
          user_id?: string
          valeur_actuelle?: number
          valeur_cible?: number
        }
        Relationships: [
          {
            foreignKeyName: "objectifs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bank_details: Json | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          payment_method: string
          status: string
          subscription_id: string | null
          transaction_reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          payment_method: string
          status: string
          subscription_id?: string | null
          transaction_reference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          payment_method?: string
          status?: string
          subscription_id?: string | null
          transaction_reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          nom: string
          page: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          nom: string
          page: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
          page?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          advanced_features: Json | null
          created_at: string
          currency: string
          duration_days: number | null
          duration_months: number
          features: Json | null
          id: string
          is_active: boolean | null
          label: string | null
          max_bank_accounts: number | null
          max_projects: number | null
          max_reports_per_month: number | null
          max_transactions_per_month: number | null
          max_users: number | null
          name: string
          price: number
          support_level: string | null
          trial_days: number | null
          trial_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          advanced_features?: Json | null
          created_at?: string
          currency?: string
          duration_days?: number | null
          duration_months?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          max_bank_accounts?: number | null
          max_projects?: number | null
          max_reports_per_month?: number | null
          max_transactions_per_month?: number | null
          max_users?: number | null
          name: string
          price: number
          support_level?: string | null
          trial_days?: number | null
          trial_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          advanced_features?: Json | null
          created_at?: string
          currency?: string
          duration_days?: number | null
          duration_months?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          max_bank_accounts?: number | null
          max_projects?: number | null
          max_reports_per_month?: number | null
          max_transactions_per_month?: number | null
          max_users?: number | null
          name?: string
          price?: number
          support_level?: string | null
          trial_days?: number | null
          trial_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      projets: {
        Row: {
          budget_consomme: number
          budget_prevu: number
          created_at: string
          date_debut: string
          date_fin: string | null
          description: string | null
          id: string
          nom: string
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_consomme?: number
          budget_prevu?: number
          created_at?: string
          date_debut: string
          date_fin?: string | null
          description?: string | null
          id?: string
          nom: string
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_consomme?: number
          budget_prevu?: number
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          id?: string
          nom?: string
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rapports: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string
          filtres: Json | null
          format: string
          id: string
          nom: string
          statut: string
          type: string
          updated_at: string
          url_fichier: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date_debut: string
          date_fin: string
          filtres?: Json | null
          format?: string
          id?: string
          nom: string
          statut?: string
          type: string
          updated_at?: string
          url_fichier?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string
          filtres?: Json | null
          format?: string
          id?: string
          nom?: string
          statut?: string
          type?: string
          updated_at?: string
          url_fichier?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rapports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          end_date: string
          id: string
          is_trial: boolean | null
          plan_id: string
          start_date: string
          status: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          end_date: string
          id?: string
          is_trial?: boolean | null
          plan_id: string
          start_date?: string
          status: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          end_date?: string
          id?: string
          is_trial?: boolean | null
          plan_id?: string
          start_date?: string
          status?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          categorie: string
          compte_id: string | null
          created_at: string
          date_transaction: string
          description: string | null
          id: string
          montant: number
          projet_id: string | null
          reference: string | null
          source: string
          sous_categorie: string | null
          statut: string
          titre: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categorie: string
          compte_id?: string | null
          created_at?: string
          date_transaction: string
          description?: string | null
          id?: string
          montant: number
          projet_id?: string | null
          reference?: string | null
          source?: string
          sous_categorie?: string | null
          statut?: string
          titre: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categorie?: string
          compte_id?: string | null
          created_at?: string
          date_transaction?: string
          description?: string | null
          id?: string
          montant?: number
          projet_id?: string | null
          reference?: string | null
          source?: string
          sous_categorie?: string | null
          statut?: string
          titre?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_bancaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          granted: boolean
          id: string
          permission_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_usage: {
        Row: {
          created_at: string | null
          id: string
          month_year: string
          reports_generated: number | null
          transactions_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          month_year: string
          reports_generated?: number | null
          transactions_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          month_year?: string
          reports_generated?: number | null
          transactions_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users_app: {
        Row: {
          created_at: string | null
          email: string
          id: string
          plan: string | null
          plan_id: string | null
          role: string | null
          trial_end_date: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          plan?: string | null
          plan_id?: string | null
          role?: string | null
          trial_end_date?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          plan?: string | null
          plan_id?: string | null
          role?: string | null
          trial_end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_app_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_current_plan"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_app_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_current_plan: {
        Row: {
          advanced_features: Json | null
          is_trial: boolean | null
          max_bank_accounts: number | null
          max_projects: number | null
          max_reports_per_month: number | null
          max_transactions_per_month: number | null
          plan_name: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_status: string | null
          trial_days: number | null
          trial_enabled: boolean | null
          trial_end_date: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_user_limits: {
        Args: { _user_id: string; _limit_type: string }
        Returns: Json
      }
      has_role_secure: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      increment_usage: {
        Args: { _user_id: string; _usage_type: string }
        Returns: undefined
      }
      is_kamel_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "admin"
        | "editeur"
        | "collaborateur"
        | "utilisateur"
        | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "admin",
        "editeur",
        "collaborateur",
        "utilisateur",
        "superadmin",
      ],
    },
  },
} as const
