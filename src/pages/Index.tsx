import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS1 = ["#88D8D8", "#FFE49A", "#FFB6C1", "#C7A8F0"];
const COLORS2 = ["#87CEFA", "#FFD59E", "#D3D3D3"];

type DataItem = { name: string; value: number };

const depenses: DataItem[] = [
  { name: "Salaires", value: 4500 },
  { name: "Fournisseurs", value: 3000 },
  { name: "Charges fixes", value: 2000 },
  { name: "Autres", value: 1500 },
];

const revenus: DataItem[] = [
  { name: "Revenus locaux", value: 7000 },
  { name: "Export", value: 4000 },
  { name: "Autres revenus", value: 2000 },
];

const renderLabel = ({ percent }: any) => `${(percent * 100).toFixed(0)}%`;

const Index = () => {
  // Calculs sécurisés avec typage
  const totalDepenses = depenses.reduce((sum, item) => sum + item.value, 0);
  const totalRevenus = revenus.reduce((sum, item) => sum + item.value, 0);
  const solde = totalRevenus - totalDepenses;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Tableau de bord financier</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Dépenses */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Répartition des dépenses</h2>
          <PieChart width={250} height={250}>
            <Pie
              data={depenses}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={renderLabel}
            >
              {depenses.map((entry, index) => (
                <Cell key={`cell-depense-${index}`} fill={COLORS1[index % COLORS1.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
          <p className="mt-4 font-medium text-center">
            Total des dépenses : {totalDepenses.toLocaleString()} DT
          </p>
        </div>

        {/* Revenus */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Sources de revenus</h2>
          <PieChart width={250} height={250}>
            <Pie
              data={revenus}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              fill="#82ca9d"
              dataKey="value"
              label={renderLabel}
            >
              {revenus.map((entry, index) => (
                <Cell key={`cell-revenu-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
          <p className="mt-4 font-medium text-center">
            Total des revenus : {totalRevenus.toLocaleString()} DT
          </p>
        </div>
      </div>

      {/* Solde net */}
      <div className="max-w-2xl mx-auto mt-10 text-center bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">Solde net</h2>
        <p className={`text-2xl font-bold mt-2 ${solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {solde.toLocaleString()} DT
        </p>
      </div>
    </div>
  );
};

export default Index;
