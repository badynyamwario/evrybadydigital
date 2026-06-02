'use client';

import { useEffect, useCallback } from 'react';

interface DeleteModalProps {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
}

export default function DeleteModal({ projectName, onConfirm, onCancel, deleting }: DeleteModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" style={{ animation: 'fadeIn 0.2s ease-out' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#141927] p-6 shadow-2xl"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h3 className="text-center text-lg font-semibold text-white mb-2">Delete Project</h3>
        <p className="text-center text-sm text-white/50 mb-6">
          Are you sure you want to delete <strong className="text-white/80">{projectName}</strong>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            id="btn-cancel-delete"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.6s linear infinite' }} />
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
