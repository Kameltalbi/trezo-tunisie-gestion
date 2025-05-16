
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const { user } = useAuth();
  const redirectPath = user ? "/recettes" : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-emerald-500 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oups ! La page que vous recherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to={redirectPath}>Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
