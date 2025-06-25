
import { useState } from 'react';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string = 'default'): Promise<string> => {
    setIsUploading(true);
    
    try {
      // Simulation d'upload de fichier en mode local
      // On pourrait utiliser FileReader pour convertir en base64 et stocker localement
      const fileUrl = URL.createObjectURL(file);
      
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`File upload simulé: ${file.name} vers ${bucket}`);
      return fileUrl;
    } catch (error) {
      throw new Error('Erreur lors de l\'upload du fichier');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading
  };
};
