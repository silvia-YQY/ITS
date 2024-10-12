import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ModalProps {
  title: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalRoot {
  root: ReactDOM.Root;
  container: HTMLDivElement;
}

// Custom hook for modal functionality
const useModal = () => {
  const modalRef = useRef<ModalRoot | null>(null); // Reference to track the modal

  useEffect(() => {
    return () => {
      removeModal();
    };
  }, []);

  const showModal = ({ title, content, onConfirm, onCancel }: ModalProps) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    const modal = (
      <Dialog open={true} onClose={() => removeModal()}>
        <DialogTitle role={title} aria-label={title}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
          {onCancel && <Button onClick={() => removeModal()}>Cancel</Button>}
          <Button
            onClick={() => {
              if (onConfirm) onConfirm();
              removeModal();
            }}
            color='primary'
            aria-label='ok'
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );

    root.render(modal);
    modalRef.current = { root, container }; // Save modal info in ref to prevent closure issues
  };

  const removeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      const { root, container } = modal;
      root.unmount();
      document.body.removeChild(container);
      modalRef.current = null; // Clean up modal ref
    }
  };

  return { showModal };
};

export default useModal;
