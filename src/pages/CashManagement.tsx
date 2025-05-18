
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

const CashManagement = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('cash_management.title')}</h1>
            <p className="text-gray-600 mt-1">{t('cash_management.description')}</p>
          </div>
        </div>

        {/* Cash Management Content - Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Cash Flow Overview</h2>
          <div className="p-8 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Cash management dashboard will be implemented here</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CashManagement;
