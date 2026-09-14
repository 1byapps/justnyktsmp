'use client';
import { Modal } from './Modal';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function Dialog({ isOpen, onClose, title, description, actionText = 'Tamam', onAction }: DialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>İptal</Button>
          <Button variant="primary" onClick={() => { onAction?.(); onClose(); }}>{actionText}</Button>
        </>
      }
    >
      <p className="text-sm">{description}</p>
    </Modal>
  );
}
