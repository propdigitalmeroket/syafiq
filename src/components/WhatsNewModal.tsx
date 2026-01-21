import { useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import { whatsNewItems } from '../content/whatsNew';
import { Language } from '../translations';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function WhatsNewModal({ isOpen, onClose, language }: WhatsNewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slideUp"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={24} />
            <h2 className="text-2xl font-bold">
              {language === 'ms' ? 'Ciri Baharu' : "What's New"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-6">
            {whatsNewItems.map((item, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(item.date).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {language === 'ms' ? item.titleMs : item.titleEn}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'ms' ? item.descriptionMs : item.descriptionEn}
                </p>
              </div>
            ))}
          </div>

          {whatsNewItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {language === 'ms'
                  ? 'Tiada kemaskini baharu buat masa ini.'
                  : 'No new updates at the moment.'}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            {language === 'ms' ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
