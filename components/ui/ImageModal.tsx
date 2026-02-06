import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  showNavigation?: boolean;
  enableZoom?: boolean;
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  imageUrl, 
  altText, 
  onClose,
  onNext,
  onPrev,
  showNavigation = false,
  enableZoom = true
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (showNavigation) {
        if (e.key === 'ArrowRight' && onNext) onNext();
        if (e.key === 'ArrowLeft' && onPrev) onPrev();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      setIsHovering(false);
    };
  }, [isOpen, onClose, showNavigation, onNext, onPrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom) return;
    
    // Get dimensions of the image container to calculate relative position
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        className="fixed top-6 right-6 z-[220] text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full shadow-lg backdrop-blur transition-all border border-white/10 group"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close modal"
      >
        <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Navigation Buttons */}
      {showNavigation && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev && onPrev();
            }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[220] text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext && onNext();
            }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[220] text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
            aria-label="Next image"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </>
      )}

      {/* 
        Image Container 
        Using inline-flex to shrink-wrap the image so mouse coordinates are accurate 
      */}
      <div 
        className="relative flex items-center justify-center overflow-hidden max-w-[85vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image wrapper
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovering(true)}
        style={{ cursor: enableZoom && isHovering ? 'crosshair' : 'default' }}
      >
        <img 
          src={imageUrl} 
          alt={altText} 
          className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm transition-transform duration-100 ease-out select-none will-change-transform"
          style={{
            transformOrigin: `${position.x}% ${position.y}%`,
            transform: enableZoom && isHovering ? 'scale(2.5)' : 'scale(1)',
          }}
        />
        
        {/* Helper text only shown when not hovering and zoom is enabled */}
        {enableZoom && !isHovering && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-4 py-2 rounded-full pointer-events-none text-white/90 text-xs uppercase tracking-widest animate-in fade-in">
             Hover to Zoom
          </div>
        )}
      </div>
    </div>
  );
};