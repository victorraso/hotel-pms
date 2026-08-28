import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed top-0 left-0 z-1000 flex size-full flex-col items-center overflow-scroll bg-stone-300/50 backdrop-blur-xs"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="m-auto flex h-max w-full items-center justify-center">
        {children}
      </div>
    </div>,
    document.body,
  );
}
