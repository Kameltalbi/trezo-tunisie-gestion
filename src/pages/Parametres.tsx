
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Devise, Langue, Utilisateur, Periode } from "@/types/parametres";
import { Trash2, X, Plus } from "lucide-react";
import SectionBox from "@/components/SectionBox";

const ParametresPage = () => {
  const [devises, setDevises] = useState<Devise[]>([]);
  const [langues, setLangues] = useState<Langue[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);

  const [modalType, setModalType] = useState<null | string>(null);
  const [form, setForm] = useState<any>({});

  const openModal = (type: string) => {
    setForm({});
    setModalType(type);
  };

  const closeModal = () => {
    setForm({});
    setModalType(null);
  };

  const handleAdd = () => {
    const id = uuidv4();

    if (modalType === "devise") {
      const entry: Devise = {
        id,
        nom: form.nom,
        symbole: form.symbole,
        decimales: Number(form.decimales),
        separateur: form.separateur,
      };
      setDevises([...devises, entry]);
    }

    if (modalType === "langue") {
      setLangues([...langues, { id, nom: form.nom }]);
    }

    if (modalType === "utilisateur") {
      setUtilisateurs([...utilisateurs, { id, ...form }]);
    }

    if (modalType === "periode") {
      setPeriodes([...periodes, { id, debut: form.debut, fin: form.fin }]);
    }

    closeModal();
  };

  const handleDelete = (id: string, type: string) => {
    const update = (data: any[]) => data.filter((d) => d.id !== id);
    if (type === "devise") setDevises(update(devises));
    if (type === "langue") setLangues(update(langues));
    if (type === "utilisateur") setUtilisateurs(update(utilisateurs));
    if (type === "periode") setPeriodes(update(periodes));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>

      {/* Grid sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Section Devises */}
        <SectionBox title="Devises" onAdd={() => openModal("devise")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th>Nom</th><th>Symbole</th><th>Décimales</th><th>Millier</th><th></th>
              </tr>
            </thead>
            <tbody>
              {devises.map((d) => (
                <tr key={d.id} className="border-t">
                  <td>{d.nom}</td><td>{d.symbole}</td><td>{d.decimales}</td><td>{d.separateur}</td>
                  <td>
                    <button onClick={() => handleDelete(d.id, "devise")} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionBox>

        {/* Section Langues */}
        <SectionBox title="Langues" onAdd={() => openModal("langue")}>
          <ul className="text-sm space-y-1">
            {langues.map((l) => (
              <li key={l.id} className="flex justify-between items-center border-b py-1">
                <span>{l.nom}</span>
                <button onClick={() => handleDelete(l.id, "langue")}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        </SectionBox>

        {/* Section Utilisateurs */}
        <SectionBox title="Utilisateurs" onAdd={() => openModal("utilisateur")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th>Nom</th><th>Email</th><th>Rôle</th><th></th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u) => (
                <tr key={u.id} className="border-t">
                  <td>{u.nom}</td><td>{u.email}</td><td>{u.role}</td>
                  <td>
                    <button onClick={() => handleDelete(u.id, "utilisateur")}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionBox>

        {/* Section Périodes */}
        <SectionBox title="Périodes comptables" onAdd={() => openModal("periode")}>
          <ul className="text-sm space-y-1">
            {periodes.map((p) => (
              <li key={p.id} className="flex justify-between items-center border-b py-1">
                <span>{p.debut} → {p.fin}</span>
                <button onClick={() => handleDelete(p.id, "periode")}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        </SectionBox>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Ajouter {modalType}</h3>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>

            {/* Formulaire dynamique */}
            <div className="space-y-3">
              {modalType === "devise" && (
                <>
                  <input placeholder="Nom" value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border p-2 rounded" />
                  <input placeholder="Symbole" value={form.symbole || ""} onChange={(e) => setForm({ ...form, symbole: e.target.value })} className="w-full border p-2 rounded" />
                  <input type="number" placeholder="Décimales" value={form.decimales || ""} onChange={(e) => setForm({ ...form, decimales: e.target.value })} className="w-full border p-2 rounded" />
                  <input placeholder="Séparateur" value={form.separateur || ""} onChange={(e) => setForm({ ...form, separateur: e.target.value })} className="w-full border p-2 rounded" />
                </>
              )}
              
              {modalType === "langue" && (
                <input placeholder="Nom" value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border p-2 rounded" />
              )}
              
              {modalType === "utilisateur" && (
                <>
                  <input placeholder="Nom" value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border p-2 rounded" />
                  <input type="email" placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded" />
                  <select value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border p-2 rounded">
                    <option value="">Sélectionner un rôle</option>
                    <option value="Admin">Admin</option>
                    <option value="Collaborateur">Collaborateur</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                </>
              )}
              
              {modalType === "periode" && (
                <>
                  <input type="date" placeholder="Début" value={form.debut || ""} onChange={(e) => setForm({ ...form, debut: e.target.value })} className="w-full border p-2 rounded" />
                  <input type="date" placeholder="Fin" value={form.fin || ""} onChange={(e) => setForm({ ...form, fin: e.target.value })} className="w-full border p-2 rounded" />
                </>
              )}
              
              <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
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
