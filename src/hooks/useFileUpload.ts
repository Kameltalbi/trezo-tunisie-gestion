
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadOptions {
  bucket: 'payment-proofs' | 'company-logos';
  folder?: string;
  maxSize?: number; // en bytes
  allowedTypes?: string[];
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, options: UploadOptions) => {
    const { bucket, folder = '', maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options;

    // Vérifications
    if (file.size > maxSize) {
      toast.error(`Le fichier ne doit pas dépasser ${Math.round(maxSize / 1024 / 1024)}MB`);
      return null;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      toast.error('Type de fichier non autorisé');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('folder', folder);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Utilisateur non authentifié');
      }

      const response = await fetch('/functions/v1/upload-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const result = await response.json();
      setUploadProgress(100);
      
      toast.success('Fichier uploadé avec succès');
      return result;

    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload du fichier');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      
      toast.success('Fichier supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  const getFileUrl = async (bucket: string, path: string) => {
    try {
      if (bucket === 'company-logos') {
        // Public bucket
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);
        return data.publicUrl;
      } else {
        // Private bucket
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 3600); // 1 heure

        if (error) throw error;
        return data.signedUrl;
      }
    } catch (error) {
      console.error('Erreur récupération URL:', error);
      return null;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    isUploading,
    uploadProgress,
  };
};
