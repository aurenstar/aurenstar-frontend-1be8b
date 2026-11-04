import React, { useEffect, useId, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

export interface PickedCity {
  geonameid: number;
  label: string; // "Munich, Bavaria, DE"
}

interface ApiCity {
  geonameid: number;
  name: string;
  admin1: string | null;
  country_code: string;
}

const cityLabel = (c: ApiCity) =>
  [c.name, c.admin1 && !/^\d+$/.test(c.admin1) ? c.admin1 : null, c.country_code].filter(Boolean).join(', ');

interface CityAutocompleteProps {
  value: PickedCity | null;
  onChange: (city: PickedCity | null) => void;
  placeholder: string;
  noResultsText: string;
  className: string; // same classes as the other text fields of the form
  required?: boolean;
}

/** City search box with suggestions (GeoNames data through /api/cities). Pick one to confirm. */
export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  noResultsText,
  className,
  required,
}) => {
  const [text, setText] = useState(value?.label ?? '');
  const [options, setOptions] = useState<ApiCity[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Keep the visible text in sync when the parent restores a saved city.
  useEffect(() => {
    if (value) setText(value.label);
  }, [value]);

  // Search 250 ms after the person stops typing.
  useEffect(() => {
    const q = text.trim();
    if (!open || q.length < 2 || (value && value.label === text)) {
      setOptions([]);
      setSearched(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cities?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = res.ok ? await res.json() : [];
        setOptions(Array.isArray(data) ? data : []);
        setActive(-1);
      } catch {
        if (!controller.signal.aborted) setOptions([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, open, value]);

  // Close the list when clicking outside.
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pick = (c: ApiCity) => {
    const picked = { geonameid: c.geonameid, label: cityLabel(c) };
    setText(picked.label);
    setOpen(false);
    onChange(picked);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && options.length) {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === 'ArrowUp' && options.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === 'Enter' && open && active >= 0 && options[active]) {
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && text.trim().length >= 2 && !(value && value.label === text);

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        required={required}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          if (value) onChange(null); // typing again cancels the previous pick
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={className}
      />
      {loading && <Loader2 className="w-3.5 h-3.5 text-[#647DA5] absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none" />}
      {showList && (options.length > 0 || (searched && !loading)) && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-1.5 max-h-64 overflow-auto rounded-2xl border border-[#D9E8F8] bg-white shadow-lg py-1.5"
        >
          {options.length === 0 && <li className="px-4 py-2.5 text-xs font-medium text-[#647DA5]">{noResultsText}</li>}
          {options.map((c, i) => (
            <li
              key={c.geonameid}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(c);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#172B4D] cursor-pointer ${i === active ? 'bg-[#E4F1FF]' : ''}`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#E73578] shrink-0" />
              <span className="truncate">{cityLabel(c)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
