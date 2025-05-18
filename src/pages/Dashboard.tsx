import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bar,
  Line,
  Pie,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage: React.FC = () => {
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Encaissements',
        data: [12000, 15000, 13000, 18000, 16000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Solde mensuel',
        data: [4500, 5000, 4000, 6000, 7000],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ['Salaires', 'Fournisseurs', 'Charges fixes', 'Autres'],
    datasets: [
      {
        data: [40000, 25000, 15000, 10000],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const doughnutData = {
    labels: ['Revenus locaux', 'Export', 'Autres revenus'],
    datasets: [
      {
        data: [50000, 30000, 10000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
      },
    ],
  };

  const cards = [
    { title: 'Solde global', value: '+12 450 DT', color: 'text-green-600' },
    { title: 'Encaissements prévus', value: '8 200 DT', color: 'text-blue-600' },
    { title: 'Dépenses à venir', value: '6 800 DT', color: 'text-red-600' },
    { title: 'Factures en retard', value: '4', color: 'text-orange-600' },
    { title: 'Clients actifs', value: '35', color: 'text-indigo-600' },
    { title: 'Fournisseurs actifs', value: '22', color: 'text-yellow-600' },
    { title: 'Dettes restantes', value: '15 000 DT', color: 'text-rose-600' },
    { title: 'Projets en cours', value: '7', color: 'text-purple-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Encaissements mensuels</h2>
            <Bar data={barData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Solde mensuel</h2>
            <Line data={lineData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Répartition des dépenses</h2>
            <Pie data={pieData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Sources de revenus</h2>
            <Doughnut data={doughnutData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;