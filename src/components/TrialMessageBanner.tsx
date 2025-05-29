
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useTrialMessages } from "@/hooks/useTrialMessages";

const TrialMessageBanner: React.FC = () => {
  const { currentMessage, shouldShow, dismissMessage, isTrialUser } = useTrialMessages();

  if (!shouldShow || !currentMessage || !isTrialUser) {
    return null;
  }

  const getVariantStyles = () => {
    switch (currentMessage.variant) {
      case 'warning':
        return 'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-800';
      case 'urgent':
        return 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50 text-red-800';
      default:
        return 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800';
    }
  };

  const getButtonStyles = () => {
    switch (currentMessage.variant) {
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'urgent':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="sticky top-16 z-40 animate-fade-in">
      <Alert className={`mx-4 mb-4 border-l-4 shadow-lg ${getVariantStyles()}`}>
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl" role="img" aria-label="icon">
                {currentMessage.icon}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-1">
                  {currentMessage.title}
                </h4>
                <p className="text-sm opacity-90">
                  {currentMessage.message}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentMessage.actionText && (
                <Link to="/subscription">
                  <Button 
                    size="sm" 
                    className={`${getButtonStyles()} text-xs px-3 py-1.5 font-medium`}
                  >
                    {currentMessage.actionText}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissMessage}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="Fermer le message"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TrialMessageBanner;
