import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CityAutocomplete, type PickedCity } from './CityAutocomplete';
import type { Lang } from '../utils/astroText';

export interface Person {
  name: string;
  day: number;
  month: number;
  year: number;
  time: string;
  place: PickedCity | null;
}
export const emptyPerson = (): Person => ({ name: '', day: 15, month: 5, year: 1995, time: '', place: null });
export const personDate = (p: Person) => `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
export const personPayload = (p: Person) => ({ date: personDate(p), ...(p.time ? { time: p.time } : {}), ...(p.place ? { geonameid: p.place.geonameid } : {}) });

const MONTHS: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};
const L = {
  en: { name: 'Name (optional)', day: 'Day', month: 'Month', year: 'Year', time: 'Birth time (optional)', city: 'Birth city (optional)', noCity: 'No city found', hint: 'Adding the time and city makes the result more exact.' },
  pt: { name: 'Nome (opcional)', day: 'Dia', month: 'Mês', year: 'Ano', time: 'Hora de nascimento (opcional)', city: 'Cidade de nascimento (opcional)', noCity: 'Nenhuma cidade encontrada', hint: 'Informar a hora e a cidade deixa o resultado mais exato.' },
  es: { name: 'Nombre (opcional)', day: 'Día', month: 'Mes', year: 'Año', time: 'Hora de nacimiento (opcional)', city: 'Ciudad de nacimiento (opcional)', noCity: 'Ninguna ciudad encontrada', hint: 'Agregar la hora y la ciudad hace el resultado más exacto.' },
};
const field = 'w-full appearance-none bg-[#E4F1FF]/30 border border-[#D9E8F8] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#172B4D] outline-none focus:border-[#F51B83] focus:bg-white transition-all';
const label = 'block text-xs font-bold uppercase tracking-wider text-[#17366F] mb-1.5';
const YEAR = new Date().getFullYear();

const Select: React.FC<{ value: number; onChange: (v: number) => void; children: React.ReactNode; id: string }> = ({ value, onChange, children, id }) => (
  <div className="relative">
    <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))} className={`${field} cursor-pointer`}>{children}</select>
    <ChevronDown className="w-3.5 h-3.5 text-[#647DA5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

export const PersonFields: React.FC<{ id: string; value: Person; onChange: (p: Person) => void; lang: Lang; showName?: boolean }> = ({ id, value, onChange, lang, showName = true }) => {
  const t = L[lang];
  const set = (patch: Partial<Person>) => {
    const next = { ...value, ...patch };
    next.day = Math.min(next.day, new Date(next.year, next.month, 0).getDate());
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {showName && (
        <div>
          <label className={label} htmlFor={`${id}-name`}>{t.name}</label>
          <input id={`${id}-name`} value={value.name} maxLength={30} onChange={(e) => set({ name: e.target.value })} className={field} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={label} htmlFor={`${id}-d`}>{t.day}</label>
          <Select id={`${id}-d`} value={value.day} onChange={(day) => set({ day })}>
            {Array.from({ length: new Date(value.year, value.month, 0).getDate() }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
        <div>
          <label className={label} htmlFor={`${id}-m`}>{t.month}</label>
          <Select id={`${id}-m`} value={value.month} onChange={(month) => set({ month })}>
            {MONTHS[lang].map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </Select>
        </div>
        <div>
          <label className={label} htmlFor={`${id}-y`}>{t.year}</label>
          <Select id={`${id}-y`} value={value.year} onChange={(year) => set({ year })}>
            {Array.from({ length: YEAR - 1899 }, (_, i) => YEAR - i).map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor={`${id}-t`}>{t.time}</label>
          <input id={`${id}-t`} type="time" value={value.time} onChange={(e) => set({ time: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label}>{t.city}</label>
          <CityAutocomplete value={value.place} onChange={(place) => set({ place })} placeholder={t.city} noResultsText={t.noCity} className={field} />
        </div>
      </div>
      <p className="text-[11px] text-[#647DA5]">{t.hint}</p>
    </div>
  );
};
