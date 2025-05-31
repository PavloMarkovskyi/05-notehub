import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { NoteTag, NewNotePayload } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
  onCreateNote: (note: NewNotePayload) => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (note: NewNotePayload) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: error => {
      console.error('Failed to create note:', error);
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, 'Min 3 characters')
      .max(50, 'Max 50 characters')
      .required('Required'),
    content: Yup.string().max(500, 'Max 500 characters'),
    tag: Yup.mixed<NoteTag>()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
      .required('Required'),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      content: '',
      tag: 'Todo',
    },
    validationSchema,
    onSubmit: values => {
      mutate({
        title: values.title,
        content: values.content.trim() === '' ? undefined : values.content,
        tag: values.tag,
      });
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          autoFocus
        />
        {formik.touched.title && formik.errors.title && (
          <div className={css.error}>{formik.errors.title}</div>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
          rows={4}
        />
        {formik.touched.content && formik.errors.content && (
          <div className={css.error}>{formik.errors.content}</div>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <div className={css.error}>{formik.errors.tag}</div>
        )}
      </div>

      <div className={css.buttons}>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create
        </button>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
