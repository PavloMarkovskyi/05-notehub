import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import NoteForm from '../NoteForm/NoteForm';
import css from './NoteModal.module.css';

interface NoteModalProps {
  onClose: () => void;
  onCreateNote: (note: {
    title: string;
    content?: string;
    tag: string;
  }) => void;
}

const modalRoot = document.getElementById('modal-root') || document.body;

const NoteModal: React.FC<NoteModalProps> = ({ onClose, onCreateNote }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
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
