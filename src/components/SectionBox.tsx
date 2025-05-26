
import React, { ReactNode } from "react";
import { Plus } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";

interface SectionBoxProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: ReactNode;
  children: ReactNode;
}

const SectionBox = ({ title, onAdd, addButtonText, children }: SectionBoxProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
            title={`Ajouter ${title.toLowerCase()}`}
          >
            {addButtonText || <Plus className="h-4 w-4" />}
          </button>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionBox;
