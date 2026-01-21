import { useEffect, useRef } from 'react';
import { Language, Translations } from '../translations';
import { Languages, Moon, Sun, DollarSign, Bell, User as UserIcon, Save, LogOut, Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: () => void;
  t: Translations;
  currentUser: User | null;
  onSignOut?: () => void;
  onWhatsNewClick?: () => void;
}

export default function SettingsMenu({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  t,
  currentUser,
  onSignOut,
  onWhatsNewClick,
}: SettingsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 animate-slideDown"
    >
      <div className="py-2">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">{t.settings.title}</p>
        </div>

        {currentUser && (
          <>
            <button
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-gray-700"
              onClick={() => {}}
            >
              <UserIcon size={18} className="text-gray-500" />
              <span className="text-sm">{t.settings.profile}</span>
            </button>

            <button
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-gray-700"
              onClick={() => {}}
            >
              <Save size={18} className="text-gray-500" />
              <span className="text-sm">{t.settings.savedCalculations}</span>
            </button>

            <div className="border-t border-gray-100 my-1"></div>
          </>
        )}

        <button
          onClick={() => {
            onLanguageChange();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
        >
          <Languages size={18} className="text-gray-500" />
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm text-gray-700">{t.settings.language}</span>
            <span className="text-xs text-gray-500">
              {language === 'ms' ? 'Bahasa Melayu' : 'English'}
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            if (onWhatsNewClick) {
              onWhatsNewClick();
              onClose();
            }
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 text-gray-700"
        >
          <Sparkles size={18} className="text-gray-500" />
          <span className="text-sm">{t.settings.whatsNew}</span>
        </button>

        <div className="border-t border-gray-100 my-1"></div>

        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 opacity-50 cursor-not-allowed"
          disabled
        >
          <Sun size={18} className="text-gray-500" />
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm text-gray-700">{t.settings.theme}</span>
            <span className="text-xs text-gray-500">{t.settings.light}</span>
          </div>
        </button>

        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 opacity-50 cursor-not-allowed"
          disabled
        >
          <DollarSign size={18} className="text-gray-500" />
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm text-gray-700">{t.settings.currency}</span>
            <span className="text-xs text-gray-500">RM</span>
          </div>
        </button>

        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 opacity-50 cursor-not-allowed"
          disabled
        >
          <Bell size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">{t.settings.notifications}</span>
        </button>

        {currentUser && onSignOut && (
          <>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 flex items-center gap-3 text-red-600"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">{t.settings.signOut}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
