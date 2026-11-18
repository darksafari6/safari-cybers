import { useEffect, useState } from 'react';

type Study = { theme: 'light' | 'dark'; size: 'standard' | 'large'; read: string[]; saved: string[]; last: string };
const key = 'cybersafari.study.v1';
const defaults: Study = { theme: 'light', size: 'standard', read: [], saved: [], last: '' };
const entries = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export function useStudy() {
  const [study, setStudy] = useState<Study>(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? '{}');
      return { theme: value.theme === 'dark' ? 'dark' : 'light', size: value.size === 'large' ? 'large' : 'standard', read: entries(value.read), saved: entries(value.saved), last: typeof value.last === 'string' ? value.last : '' };
    } catch { return defaults; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', study.theme === 'dark');
    try { localStorage.setItem(key, JSON.stringify(study)); } catch { /* optional storage */ }
  }, [study]);
  return [study, setStudy] as const;
}
