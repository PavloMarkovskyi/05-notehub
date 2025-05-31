import axios, { type AxiosResponse } from 'axios';
import type { Note, NotesResponse, NewNotePayload } from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api/notes';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error('VITE_NOTEHUB_TOKEN is not defined');
  }
  return config;
});

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<NotesResponse> => {
  const params: Record<string, string | number | undefined> = {
    page,
    perPage,
    search: search || undefined,
  };

  const { data }: AxiosResponse<NotesResponse> = await axiosInstance.get('/', { params });
  return data;
};

export const createNote = async (note: NewNotePayload): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await axiosInstance.post('/', note);
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await axiosInstance.delete(`/${id}`);
  return data;
};
