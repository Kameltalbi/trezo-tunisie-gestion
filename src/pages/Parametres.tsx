import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { X } from "lucide-react";

type Devise = { id: string; nom: string };
type Langue = { id: string; nom: string };
type Utilisateur = { id: string; nom: string; email: string; role: string };
type Periode = { id: string; debut: string; fin: string };

const ParametresPage = () => {
  const [devises, setDevises] = useState<Devise[]>([]);
  const [langues, setLangues] = useState<Langue[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);

  const [modal, setModal] = useState<{
    type: "devise" | "langue" | "utilisateur" | "periode" | null;
    show: boolean;
  }>({ type: null, show: false });

  const [form, setForm] = useState<any>({});

  const handleAdd = () => {
    if (!modal.type) return;
    const id = uuidv4();
    const entry = { ...form, id };

    switch (modal.type) {
      case "devise":
        setDevises([...devises, entry]);
        break;
      case "langue":
        setLangues([...langues, entry]);
        break;
      case "utilisateur":
        setUtilisateurs([...utilisateurs, entry]);
        break;
      case "periode":
        setPeriodes([...periodes, entry]);
        break;
    }

    setForm({});
    setModal({ type: null, show: false });
  };

  const handleDelete = (id: string, type: string) => {
    const update = (data: any[]) => data.filter((item) => item.id !== id);
    if (type === "devise") setDevises(update);
    if (type === "langue") setLangues(update);
    if (type === "utilisateur") setUtilisateurs(update);
    if (type === "periode") setPeriodes(update);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Section - Devises */}
      <SectionCard
        title="Devises"
        data={devises}
        onAdd={() => setModal({ type: "devise", show: true })}
        onDelete={(id) => handleDelete(id, "devise")}
      />

      {/* Section - Langues */}
      <SectionCard
        title="Langues"
        data={langues}
        onAdd={() => setModal({ type: "langue", show: true })}
        onDelete={(id) => handleDelete(id, "langue")}
      />

      {/* Section - Utilisateurs */}
      <SectionCard
        title="Utilisateurs"
        data={utilisateurs.map((u) => ({ id: u.id, nom: `${u.nom} (${u.role})` }))}
        onAdd={() => setModal({ type: "utilisateur", show: true })}
        onDelete={(id) => handleDelete(id, "utilisateur")}
      />

      {/* Section - Période comptable */}
      <SectionCard
        title="Périodes comptables"
        data={periodes.map((p) => ({
          id: p.id,
          nom: `${p.debut} → ${p.fin}`,
        }))}
        onAdd={() => setModal({ type: "periode", show: true })}
        onDelete={(id) => handleDelete(id, "periode")}
      />

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold capitalize">Ajouter {modal.type}</h2>
              <button onClick={() => setModal({ type: null, show: false })}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {modal.type === "devise" && (
              <input
                type="text"
                placeholder="Nom de la devise (ex. : Dinar tunisien)"
                value={form.nom || ""}
                onChange={(e) => setForm({ nom: e.target.value })}
                className="w-full border p-2 mb-4 rounded"
              />
            )}

            {modal.type === "langue" && (
              <input
                type="text"
                placeholder="Langue (ex. : Français)"
                value={form.nom || ""}
                onChange={(e) => setForm({ nom: e.target.value })}
                className="w-full border p-2 mb-4 rounded"
              />
            )}

            {modal.type === "utilisateur" && (
              <>
                <input
                  type="text"
                  placeholder="Nom"
                  value={form.nom || ""}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border p-2 mb-2 rounded"
                />
                <select
                  value={form.role || "Collaborateur"}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border p-2 mb-2 rounded"
                >
                  <option value="Admin">Admin</option>
                  <option value="Collaborateur">Collaborateur</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </>
            )}

            {modal.type === "periode" && (
              <div className="space-y-2">
                <label className="block text-sm">Début</label>
                <input
                  type="date"
                  value={form.debut || ""}
                  onChange={(e) => setForm({ ...form, debut: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <label className="block text-sm">Fin</label>
                <input
                  type="date"
                  value={form.fin || ""}
                  onChange={(e) => setForm({ ...form, fin: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
