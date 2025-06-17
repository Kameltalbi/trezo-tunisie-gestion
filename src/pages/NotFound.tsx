
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const redirectPath = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-emerald-500 mb-4">{t('errors.404_title')}</h1>
        <p className="text-xl text-gray-700 mb-6">
          {t('errors.404_message')}
        </p>
        <Button asChild>
          <Link to={redirectPath}>{t('errors.back_home')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
