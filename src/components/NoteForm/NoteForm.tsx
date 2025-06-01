import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { NoteTag, NewNotePayload } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
  onCreateNote?: (note: NewNotePayload) => void;
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

  const initialValues: FormValues = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        mutate({
          title: values.title,
          content: values.content.trim() === '' ? undefined : values.content,
          tag: values.tag,
        });
      }}
    >
      <Form className={css.form} noValidate>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            name="title"
            type="text"
            className={css.input}
            autoFocus
          />
          <ErrorMessage name="title">
            {msg => <div className={css.error}>{msg}</div>}
          </ErrorMessage>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            className={css.textarea}
            rows={4}
          />
          <ErrorMessage name="content">
            {msg => <div className={css.error}>{msg}</div>}
          </ErrorMessage>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag">
            {msg => <div className={css.error}>{msg}</div>}
          </ErrorMessage>
        </div>

        <div className={css.buttons}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            Create
          </button>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
