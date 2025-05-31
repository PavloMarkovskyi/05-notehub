import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import NoteForm from '../NoteForm/NoteForm';
import css from './NoteModal.module.css';
import type { NewNotePayload } from '../../types/note';

interface NoteModalProps {
  onClose: () => void;
  onCreateNote: (note: NewNotePayload) => void;
}

const modalRoot = document.getElementById('modal-root') || document.body;

const NoteModal: React.FC<NoteModalProps> = ({ onClose, onCreateNote }) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return ReactDOM.createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={css.modal}>
        <NoteForm onClose={onClose} onCreateNote={onCreateNote} />
      </div>
    </div>,
    modalRoot
  );
};

export default NoteModal;
