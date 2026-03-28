'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteRecipe } from '@/app/actions';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
      setIsDeleting(true);
      const res = await deleteRecipe(id);
      if (res.success) {
        router.push('/');
      } else {
        alert(res.error || 'Fehler beim Löschen');
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center space-x-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
    >
      <Trash2 size={16} />
      <span className="hidden sm:inline">{isDeleting ? 'Löscht...' : 'Löschen'}</span>
    </button>
  );
}