import axios, { type AxiosResponse } from 'axios';
import type { Note } from '../types/note';

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

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = { page, perPage };
  if (search) params.search = search;

  const { data }: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('/', { params });
  return data;
};

interface CreateNotePayload {
  title: string;
  content?: string;
  tag: Note['tag'];
}

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await axiosInstance.post('/', note);
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await axiosInstance.delete(`/${id}`);
  return data;
};