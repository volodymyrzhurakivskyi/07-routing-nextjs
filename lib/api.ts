import axios from 'axios';
import type { Note, NewNote } from '@/types/note';

// Налаштовуємо базовий екземпляр Axios
const noteApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

// Інтерфейси для параметрів та відповідей запитів
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// 1. Отримання нотаток (з пагінацією, пошуком та фільтром за тегом)
export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  
  if (search) {
    params.search = search;
  }
  
  // Додаємо tag ТІЛЬКИ якщо він існує і НЕ дорівнює 'all'
  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await noteApi.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

// 2. Створення нової нотатки
export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', noteData);
  return response.data;
};

// 3. Видалення нотатки за ID
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(`/notes/${id}`);
  return response.data;
};

// 4. Отримання однієї нотатки за ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await noteApi.get<Note>(`/notes/${id}`);
  return response.data;
}; 
