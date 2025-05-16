
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Loader2, User, Globe } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Parametres = () => {
  const { user, updateUser, logout, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState<{
    nom: string;
    email: string;
    role: "admin" | "utilisateur";
  }>({
    nom: user?.nom || "",
    email: user?.email || "",
    role: user?.role || "utilisateur",
  });

  const handleUpdate = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateUser({
        ...formData,
      });
      toast.success(t("parametres.update_success"));
    } catch (error) {
      toast.error(t("parametres.update_error"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("auth.logout_success"));
    } catch (error) {
      toast.error(t("auth.logout_error"));
    }
  };
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  if (!user) return null;

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("parametres.title")}</h1>
          <p className="text-gray-500">
            {t("parametres.description")}
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("parametres.profile")}</CardTitle>
              <CardDescription>
                {t("parametres.profile_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center p-4">
                <div className="bg-emerald-100 rounded-full p-6">
                  <User className="h-12 w-12 text-emerald-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="nom">{t("parametres.name")}</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    placeholder={t("parametres.name")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{t("parametres.email")}</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">{t("parametres.role")}</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "utilisateur") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("parametres.select_role")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("parametres.admin")}</SelectItem>
                      <SelectItem value="utilisateur">{t("parametres.user")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("parametres.updating")}
                  </>
                ) : (
                  t("parametres.save")
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("parametres.language")}</CardTitle>
              <CardDescription>
                {t("parametres.language_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button 
                  variant={i18n.language === "fr" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => changeLanguage("fr")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Français
                </Button>
                <Button 
                  variant={i18n.language === "en" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => changeLanguage("en")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  English
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("parametres.session")}</CardTitle>
              <CardDescription>
                {t("parametres.session_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("auth.logout")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Parametres;
