import React, { useState } from "react";
import { Devise } from "@/types/parametres";
import { v4 as uuidv4 } from "uuid";
import { Trash2, X } from "lucide-react";

const ParametresPage = () => {
  const [devises, setDevises] = useState<Devise[]>([]);
  const [showDeviseModal, setShowDeviseModal] = useState(false);
  const [newDevise, setNewDevise] = useState<Partial<Devise>>({});

  const addDevise = () => {
    if (
      !newDevise.nom ||
      !newDevise.symbole ||
      newDevise.decimales === undefined ||
      !newDevise.separateur
    )
      return;
    const devise: Devise = {
      id: uuidv4(),
      nom: newDevise.nom,
      symbole: newDevise.symbole,
      decimales: Number(newDevise.decimales),
      separateur: newDevise.separateur,
    };
    setDevises([...devises, devise]);
    setNewDevise({});
    setShowDeviseModal(false);
  };

  const deleteDevise = (id: string) => {
    setDevises((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>

      {/* Grid de sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section devises */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Devises</h2>
            <button
              onClick={() => setShowDeviseModal(true)}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-1">Nom</th>
                <th>Symbole</th>
                <th>Décimales</th>
                <th>Millier</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {devises.map((devise) => (
                <tr key={devise.id} className="border-t">
                  <td className="py-1">{devise.nom}</td>
                  <td>{devise.symbole}</td>
                  <td>{devise.decimales}</td>
                  <td>{devise.separateur}</td>
                  <td>
                    <button
                      onClick={() => deleteDevise(devise.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tu peux ajouter d'autres sections ici */}
        <div className="bg-white shadow rounded-lg p-4 text-center text-gray-500 italic">
          <p>Section suivante à définir...</p>
        </div>
      </div>

      {/* Modal Ajouter Devise */}
      {showDeviseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Nouvelle devise</h3>
              <button onClick={() => setShowDeviseModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom (ex: Dinar tunisien)"
                value={newDevise.nom || ""}
                onChange={(e) => setNewDevise({ ...newDevise, nom: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Symbole (ex: DT, €)"
                value={newDevise.symbole || ""}
                onChange={(e) => setNewDevise({ ...newDevise, symbole: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Nombre de décimales"
                value={newDevise.decimales || ""}
                onChange={(e) => setNewDevise({ ...newDevise, decimales: parseInt(e.target.value) })}
                className="w-full border p-2 rounded"
                min={0}
                max={4}
              />
              <input
                type="text"
                placeholder="Séparateur de milliers (ex: , ou .)"
                value={newDevise.separateur || ""}
                onChange={(e) => setNewDevise({ ...newDevise, separateur: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={addDevise}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParametresPage;
