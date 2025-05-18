
import React from 'react';
import Layout from "@/components/Layout";
import { useTranslation } from "react-i18next";

const Depenses = () => {
  const { t } = useTranslation();
  
  return (
    <Layout requireAuth={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{t('pages.expenses.title')}</h1>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <p>{t('pages.expenses.description')}</p>
            <div className="mt-4 flex flex-col gap-4">
              <p className="text-muted-foreground text-sm">
                {t('pages.expenses.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Depenses;
