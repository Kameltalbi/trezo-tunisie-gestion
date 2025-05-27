
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCard {
  title: string;
  value: string;
  color: string;
}

interface DashboardSummaryCardsProps {
  cards: SummaryCard[];
}

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className={`text-xl font-semibold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
