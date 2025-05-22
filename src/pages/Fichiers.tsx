
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  File, 
  Folder, 
  FilePlus, 
  FolderPlus, 
  Trash2, 
  Download, 
  MoreHorizontal 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modifiedDate: string;
  path: string[];
}

const Fichiers = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      modifiedDate: '2025-05-20',
      path: []
    },
    {
      id: '2',
      name: 'Images',
      type: 'folder',
      modifiedDate: '2025-05-19',
      path: []
    },
    {
      id: '3',
      name: 'rapport_tresorerie.pdf',
      type: 'file',
      size: '2.5 MB',
      modifiedDate: '2025-05-18',
      path: []
    }
  ]);
  
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  // Filtrer les fichiers pour le dossier actuel
  const currentFiles = files.filter(file => 
    JSON.stringify(file.path) === JSON.stringify(currentPath)
  );

  const handleNavigate = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedItems([]);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
    setSelectedItems([]);
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleCreateFile = () => {
    if (!newItemName) {
      toast.error(t("fichiers.name_required") || "Nom de fichier requis");
      return;
    }

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: 'file',
      size: '0 KB',
      modifiedDate: new Date().toISOString().split('T')[0],
      path: [...currentPath]
    };

    setFiles([...files, newFile]);
    setNewItemName("");
    setIsFileDialogOpen(false);
    toast.success(t("fichiers.file_created") || "Fichier créé avec succès");
  };

  const handleCreateFolder = () => {
    if (!newItemName) {
      toast.error(t("fichiers.name_required") || "Nom de dossier requis");
      return;
    }

    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: 'folder',
      modifiedDate: new Date().toISOString().split('T')[0],
      path: [...currentPath]
    };

    setFiles([...files, newFolder]);
    setNewItemName("");
    setIsFolderDialogOpen(false);
    toast.success(t("fichiers.folder_created") || "Dossier créé avec succès");
  };

  const handleDeleteItems = () => {
    const updatedFiles = files.filter(file => !selectedItems.includes(file.id));
    setFiles(updatedFiles);
    setSelectedItems([]);
    toast.success(t("fichiers.items_deleted") || "Éléments supprimés avec succès");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-1">{t("fichiers.title") || "Gestion des fichiers"}</h1>
      <p className="text-muted-foreground mb-6">{t("fichiers.description") || "Gérez vos fichiers et dossiers"}</p>

      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setCurrentPath([])}>
              {t("fichiers.home") || "Accueil"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentPath.map((folder, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink onClick={() => handleNavigateBreadcrumb(index + 1)}>
                {folder}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFileDialogOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            {t("fichiers.add_file") || "Ajouter fichier"}
          </Button>
          <Button variant="outline" onClick={() => setIsFolderDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            {t("fichiers.add_folder") || "Ajouter dossier"}
          </Button>
          {selectedItems.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteItems}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("fichiers.delete") || "Supprimer"}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("fichiers.files_and_folders") || "Fichiers et dossiers"}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentFiles.length === 0 ? (
            <div className="text-center py-10">
              <Folder className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {t("fichiers.empty_directory") || "Ce dossier est vide"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentFiles.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 border rounded-lg flex items-center cursor-pointer transition-colors ${
                    selectedItems.includes(item.id) ? 'bg-slate-100' : ''
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                  onDoubleClick={() => item.type === 'folder' && handleNavigate(item.name)}
                >
                  <div className="mr-3">
                    {item.type === 'folder' ? (
                      <Folder className="h-8 w-8 text-blue-500" />
                    ) : (
                      <File className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type === 'file' && item.size ? `${item.size} · ` : ''}
                      {item.modifiedDate}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.type === 'folder' && (
                        <DropdownMenuItem onClick={() => handleNavigate(item.name)}>
                          {t("fichiers.open") || "Ouvrir"}
                        </DropdownMenuItem>
                      )}
                      {item.type === 'file' && (
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          {t("fichiers.download") || "Télécharger"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("fichiers.delete") || "Supprimer"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue d'ajout de fichier */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("fichiers.add_file") || "Ajouter un fichier"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-1">
              {t("fichiers.file_name") || "Nom du fichier"}
            </label>
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={t("fichiers.enter_file_name") || "Entrez le nom du fichier"}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFileDialogOpen(false)}>
              {t("common.cancel") || "Annuler"}
            </Button>
            <Button onClick={handleCreateFile}>
              {t("common.create") || "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'ajout de dossier */}
      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("fichiers.add_folder") || "Ajouter un dossier"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-1">
              {t("fichiers.folder_name") || "Nom du dossier"}
            </label>
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={t("fichiers.enter_folder_name") || "Entrez le nom du dossier"}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFolderDialogOpen(false)}>
              {t("common.cancel") || "Annuler"}
            </Button>
            <Button onClick={handleCreateFolder}>
              {t("common.create") || "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fichiers;
