'use client';

import { useState, ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './Notes.client.module.css';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const perPage = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, perPage, search: debouncedSearch, tag }],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch, tag }),
  });

  // Обробник зміни значення пошуку
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Скидаємо на 1-шу сторінку при пошуку
  };

  // Обробник вибору сторінки (react-paginate повертає 0-based index)
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button 
          className={css.createBtn} 
          onClick={() => setIsModalOpen(true)}
        >
          Create Note
        </button>
      </div>

      {isLoading && <div>Loading notes...</div>}
      {isError && <div>Error loading notes.</div>}

      {data && (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              forcePage={page - 1} // react-paginate підраховує з 0, тому передаємо page - 1
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}