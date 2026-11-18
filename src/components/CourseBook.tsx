import Markdown from 'react-markdown';
import type { Room } from '../types';

interface Props {
  room: Room;
  chapterId: number;
  size: 'standard' | 'large';
  read: string[];
  saved: string[];
  onSize: () => void;
  onToggle: (kind: 'read' | 'saved', key: string) => void;
}

export default function CourseBook({ room, chapterId, size, read, saved, onSize, onToggle }: Props) {
  const chapters = room.tasks.filter(task => task.reading);
  const index = chapters.findIndex(task => task.id === chapterId);
  const chapter = chapters[index];
  const base = `#/rooms/${room.id}`;
  const chapterUrl = (id: number) => `${base}/book/${id}`;
  const current = chapterUrl(chapterId);
  const [chapterText, modelAnswer] = chapter.reading!.split('<!-- model-answer -->');
  const minutes = Math.max(1, Math.ceil(chapter.reading!.trim().split(/\s+/).length / 180));
  const link = 'text-primary underline underline-offset-4';
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <a className={`reader-back ${link}`} href={base}>← Back to course</a>
      <h1 className="font-serif text-4xl font-bold text-foreground">{room.title}: Course Book</h1>
      <div className="reader-grid grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label="Book chapters" className="reader-outline glass self-start rounded-2xl p-5 md:sticky md:top-24">
          <details open><summary className="mb-3 cursor-pointer font-bold">Contents</summary>
          <ol className="list-decimal space-y-3 pl-5">
            {chapters.map(task => <li key={task.id}><a className={link} aria-current={task.id === chapterId ? 'page' : undefined} href={chapterUrl(task.id)}>{task.title}</a>{read.includes(chapterUrl(task.id)) && <span className="ml-2 text-xs text-muted-foreground">Read</span>}{saved.includes(chapterUrl(task.id)) && <span className="ml-2 text-xs text-muted-foreground">Bookmarked</span>}</li>)}
          </ol></details>
        </nav>
        <article className="reader-page glass min-w-0 rounded-2xl p-5 sm:p-8">
          <p className="mb-4 text-sm text-muted-foreground">Chapter {index + 1} of {chapters.length} · {minutes} min read</p>
          <div className="reader-controls mb-6 flex flex-wrap gap-2 text-sm">
            <button className="rounded-lg border border-border px-3 py-2" onClick={onSize} aria-pressed={size === 'large'}>Larger text</button>
            <button className="rounded-lg border border-border px-3 py-2" onClick={() => onToggle('saved', current)} aria-pressed={saved.includes(current)}>Bookmark</button>
            <button className="rounded-lg border border-border px-3 py-2" onClick={() => window.print()}>Print chapter</button>
          </div>
          <div className={`reader-prose ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
            <Markdown>{chapterText}</Markdown>
            {modelAnswer && <details key={chapterId} className="my-6 rounded-lg border border-border bg-secondary p-4">
              <summary className="cursor-pointer font-semibold">Reveal the model answer</summary>
              <Markdown>{modelAnswer}</Markdown>
            </details>}
          </div>
          <button className="reader-controls mt-8 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground" aria-pressed={read.includes(current)} onClick={() => onToggle('read', current)}>{read.includes(current) ? 'Marked as read' : 'Mark chapter as read'}</button>
          <nav aria-label="Chapter navigation" className="mt-8 flex flex-wrap gap-5 border-t border-border pt-5">
            {chapters[index - 1] && <a className={link} href={chapterUrl(chapters[index - 1].id)}>← Previous chapter</a>}
            {chapters[index + 1] && <a className={link} href={chapterUrl(chapters[index + 1].id)}>Next chapter →</a>}
            <a className={link} href={`${base}/lessons`}>Go to practice sessions</a>
          </nav>
        </article>
      </div>
    </div>
  );
}
