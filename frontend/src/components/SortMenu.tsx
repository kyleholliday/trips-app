import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Calendar,
  SortAsc,
  SortDesc,
  MapPin,
  Check,
} from 'lucide-react';

export type SortKey = 'startAsc' | 'startDesc' | 'name' | 'destination';

type Props = {
  value: SortKey;
  onChange: (v: SortKey) => void;
};

const items: {
  value: SortKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: 'startAsc', label: 'Start date ↑', icon: Calendar },
  { value: 'startDesc', label: 'Start date ↓', icon: Calendar },
  { value: 'name', label: 'Name (A–Z)', icon: SortAsc },
  { value: 'destination', label: 'Destination (A–Z)', icon: MapPin },
];

export default function SortMenu({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  // Close on outside click / Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const currentLabel = items.find((i) => i.value === value)?.label ?? 'Sort';

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span>{currentLabel}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={menuRef}
            role="menu"
            aria-label="Sort trips"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            {items.map(({ value: val, label, icon: Icon }) => {
              const active = val === value;
              return (
                <li key={val} role="none">
                  <button
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      onChange(val);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
                      ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{label}</span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
