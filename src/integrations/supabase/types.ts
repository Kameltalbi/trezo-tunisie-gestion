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
        ]
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
        Relationships: []
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
        Relationships: []
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
          created_at: string
          currency: string
          duration_months: number
          features: Json | null
          id: string
          is_active: boolean | null
          max_bank_accounts: number | null
          max_projects: number | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          duration_months?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_bank_accounts?: number | null
          max_projects?: number | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          duration_months?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_bank_accounts?: number | null
          max_projects?: number | null
          name?: string
          price?: number
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          plan_id: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          end_date: string
          id?: string
          plan_id: string
          start_date?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          end_date?: string
          id?: string
          plan_id?: string
          start_date?: string
          status?: string
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "editeur" | "collaborateur" | "utilisateur"
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
      user_role: ["admin", "editeur", "collaborateur", "utilisateur"],
    },
  },
} as const
