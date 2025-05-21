import React, { useState } from "react";
import { Langue, Monnaie, Utilisateur } from "@/types/parametres";
import { v4 as uuidv4 } from "uuid";

const ParametresPage = () => {
  const [monnaie, setMonnaie] = useState<Monnaie>("TND");
  const [langue, setLangue] = useState<Langue>("fr");
  const [periodeDebut, setPeriodeDebut] = useState("2025-01-01");
  const [periodeFin, setPeriodeFin] = useState("2025-12-31");

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([
    { id: uuidv4(), nom: "Kamel Talbi", email: "kamel@ktconsulting.com", role: "Admin" },
    { id: uuidv4(), nom: "Sami Jlassi", email: "sami@ktconsulting.com", role: "Collaborateur" },
  ]);

  const handleImport = () => {
    alert("Fonction d’import à intégrer");
  };

  const handleExport = () => {
    alert("Export des paramètres effectué !");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      {/* Section : Monnaie */}
      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Monnaie</h2>
        <select
          value={monnaie}
          onChange={(e) => setMonnaie(e.target.value as Monnaie)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="TND">Dinar tunisien (TND)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar américain (USD)</option>
          <option value="XOF">Franc CFA (XOF)</option>
        </select>
      </div>

      {/* Section : Langue */}
      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Langue</h2>
        <select
          value={langue}
          onChange={(e) => setLangue(e.target.value as Langue)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
        </select>
      </div>

      {/* Section : Utilisateurs */}
      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Utilisateurs & rôles</h2>
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.nom}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section : Période comptable */}
      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Période comptable</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block mb-1 text-sm">Début</label>
            <input
              type="date"
              value={periodeDebut}
              onChange={(e) => setPeriodeDebut(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Fin</label>
            <input
              type="date"
              value={periodeFin}
              onChange={(e) => setPeriodeFin(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Section : Import / Export */}
      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Import / Export des données</h2>
        <div className="flex gap-4">
          <button
            onClick={handleImport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Importer
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;
