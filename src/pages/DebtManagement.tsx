
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

const DebtManagement = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('debt_management.title')}</h1>
            <p className="text-gray-600 mt-1">{t('debt_management.description')}</p>
          </div>
        </div>

        {/* Debt Management Content - Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Debt Overview</h2>
          <div className="p-8 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Debt management dashboard will be implemented here</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DebtManagement;
