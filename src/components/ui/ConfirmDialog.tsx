'use client';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isDanger?: boolean;
}

export function ConfirmDialog({ isOpen, onClose, title, message, confirmText = 'Onayla', cancelText = 'İptal', onConfirm, isDanger }: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
        </>
      }
    >
      <div className="flex gap-4">
        {isDanger && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:h-10 sm:w-10">
            <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
        <div className="text-sm text-[var(--text-secondary)] pt-1">
          {message}
        </div>
      </div>
    </Modal>
  );
}
