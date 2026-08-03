'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal'; // Шлях до вашого компонента Modal

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    // При закритті модалки повертаємось на попередній маршрут списку
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading ? (
        <div>Loading note details...</div>
      ) : (
        <div>
          <h2>{note?.title}</h2>
          <p>{note?.content}</p>
          <span>Tag: {note?.tag}</span>
        </div>
      )}
    </Modal>
  );
}