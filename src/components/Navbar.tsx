import { BookOpen, Moon, Sun } from 'lucide-react';

export default function Navbar({ onDashboardClick, dark, onTheme }: { onDashboardClick: () => void; dark: boolean; onTheme: () => void }) {
  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <button type="button" onClick={onDashboardClick} className="flex items-center gap-3 font-bold text-foreground">
          <span className="rounded-lg bg-primary p-2 text-primary-foreground"><BookOpen aria-hidden="true" size={18} /></span>
          <span>CyberSafari <span className="hidden font-normal text-muted-foreground sm:inline">Academy</span></span>
        </button>
        <button type="button" onClick={onTheme} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm" aria-pressed={dark}>
          {dark ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />} Dark theme
        </button>
      </div>
    </nav>
  );
}
