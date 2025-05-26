
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface LimitationWarningProps {
  title: string;
  message: string;
  usage?: number;
  limit?: number | 'unlimited';
  canProceed: boolean;
  onProceed?: () => void;
}

const LimitationWarning: React.FC<LimitationWarningProps> = ({
  title,
  message,
  usage,
  limit,
  canProceed,
  onProceed
}) => {
  if (canProceed && limit !== 'unlimited') {
    // Afficher un avertissement si proche de la limite (80%)
    const usagePercentage = usage && limit ? (usage / limit) * 100 : 0;
    
    if (usagePercentage >= 80) {
      return (
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex justify-between items-center">
              <span>
                Attention : {usage}/{limit} {title.toLowerCase()} utilisées ce mois. 
                Vous approchez de votre limite.
              </span>
              <Link to="/subscription">
                <Button variant="outline" size="sm">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrader
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  if (!canProceed) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex justify-between items-center">
            <span>{message}</span>
            <div className="flex gap-2">
              <Link to="/subscription">
                <Button variant="default" size="sm">
                  <Crown className="mr-2 h-4 w-4" />
                  Souscrire à un plan
                </Button>
              </Link>
              {onProceed && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onProceed}
                  disabled
                >
                  Continuer
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default LimitationWarning;
