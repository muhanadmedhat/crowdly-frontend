import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string; // default "Confirm"
  cancelLabel?: string; // default "Cancel"
  isDangerous?: boolean; // makes confirm button red, default true
  isLoading?: boolean; // disables buttons while async action runs
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onClose,
  children,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop — clicking outside closes the modal
    <div className="modal-backdrop" onClick={onClose}>
      {/* Modal box — stop click from reaching backdrop */}
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <p className="modal-message">{message}</p>
        {children}

        {/* Actions */}
        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            className={`modal-confirm-btn ${isDangerous ? 'modal-confirm-danger' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
