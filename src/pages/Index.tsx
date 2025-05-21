import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data1 = [
  { name: 'Revenus', value: 4000 },
  { name: 'Dépenses', value: 2400 },
];
const data2 = [
  { name: 'Banque', value: 3000 },
  { name: 'Caisse', value: 1000 },
];

const COLORS = ['#34d399', '#f87171'];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tableau de Bord Trézo</h1>
          <p className="text-lg text-gray-500">Suivez vos flux de trésorerie et vos soldes en un coup d'œil.</p>
        </div>

        {/* Résumé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-gray-500">Solde global</p>
            <p className="text-2xl font-bold text-green-500">12 000 DT</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-gray-500">Revenus</p>
            <p className="text-2xl font-bold text-blue-500">25 000 DT</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-gray-500">Dépenses</p>
            <p className="text-2xl font-bold text-red-500">13 000 DT</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-gray-500">Nombre d'opérations</p>
            <p className="text-2xl font-bold text-purple-500">112</p>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Graphique 1 */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Répartition Revenus vs Dépenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data1}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {data1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique 2 */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Répartition par type de compte</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data2}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {data2.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
