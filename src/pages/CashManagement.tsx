import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CashManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Rediriger vers la page de flux de trésorerie
  React.useEffect(() => {
    navigate('/cash-flow');
  }, [navigate]);

  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestion de trésorerie</h1>
          </div>
        </div>
        
        <Card className="bg-white border-0 shadow-sm overflow-hidden mb-6">
          <CardContent className="p-4">
            <p>Redirection vers la page de flux de trésorerie...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CashManagement;
