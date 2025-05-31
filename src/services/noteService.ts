import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({ page, perPage, search }: FetchNotesParams) => {
  const params = new URLSearchParams();

  params.append('page', String(page));
  params.append('perPage', String(perPage));

  if (search?.trim()) {
    params.append('search', search.trim());
  }

  const response = await axios.get(`${BASE_URL}/notes?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const createNote = async (note: {
  title: string;
  content?: string;
  tag: Note['tag'];
}) => {
  const response = await axios.post(`${BASE_URL}/notes`, note, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteNote = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
