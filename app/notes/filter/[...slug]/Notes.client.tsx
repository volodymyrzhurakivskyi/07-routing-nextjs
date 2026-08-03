'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList'; // <--- Імпортуємо NoteList
import css from './Notes.client.module.css';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page] = useState(1);
  const [search] = useState('');
  const perPage = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, perPage, search, tag }],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
  });

  if (isLoading) return <div>Loading notes...</div>;
  if (isError) return <div>Error loading notes.</div>;

  return (
    <div className={css.container}>
      {/* Замість мапінгу викликаємо готовий NoteList */}
      <NoteList notes={data?.notes || []} />
    </div>
  );
}