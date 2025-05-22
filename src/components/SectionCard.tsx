
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  data: { id: string; nom: string }[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const SectionCard = ({ title, data, onAdd, onDelete }: SectionCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
          title={`Ajouter ${title.toLowerCase()}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-gray-500 italic">Aucun élément</p>
        ) : (
          <ul className="space-y-2">
            {data.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded border"
              >
                <span>{item.nom}</span>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
