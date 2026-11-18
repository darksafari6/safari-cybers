import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Network, 
  Key, 
  Globe, 
  Bluetooth, 
  Terminal as TerminalIcon,
  Shield,
  ArrowRight,
  Code2,
  Activity,
  Search,
  Zap,
  BookOpen,
  Clock,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROOMS, PATHS } from '@/src/constants';
import { Room, LearningPath } from '@/src/types';
import Navbar from './Navbar';
import { useStudy } from '../study';

import { loadProgress, saveProgress } from '@/src/progress';

const CourseBook = lazy(() => import('./CourseBook'));
const CyberTerminal = lazy(() => import('./CyberTerminal'));

const ICON_MAP: Record<string, any> = {
  Wifi,
  Network,
  Key,
  Globe,
  Bluetooth,
  Activity,
  Search,
  Shield,
  Zap,
  Terminal: TerminalIcon
};

export default function CyberLayout() {
  const [hash, setHash] = useState(() => window.location.hash);
  const main = useRef<HTMLElement>(null);
  const match = hash.match(/^#\/(rooms|paths)\/([1-9]\d*)(\/lessons|\/book\/([1-9]\d*))?$/);
  const selectedRoom = match?.[1] === 'rooms' ? ROOMS.find(room => room.id === Number(match[2])) : undefined;
  const selectedPath = match?.[1] === 'paths' && !match[3] ? PATHS.find(path => path.id === Number(match[2])) : undefined;
  const bookChapter = selectedRoom?.tasks.find(task => task.id === Number(match?.[4]) && task.reading);
  const view = selectedRoom ? (bookChapter ? 'book' : match?.[3] === '/lessons' ? 'task_viewer' : 'room_details') : selectedPath ? 'path_details' : 'dashboard';
  const routeKey = hash.startsWith('#/') ? hash : '#/';

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    main.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [routeKey]);

  const [study, setStudy] = useStudy();
  const [query, setQuery] = useState('');
  const matchingRooms = ROOMS.filter(room => [room.title, room.description, ...room.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  const bookEntries = ROOMS.flatMap(room => room.tasks.filter(task => task.reading).map(task => ({ room, task, href: `#/rooms/${room.id}/book/${task.id}` })));
  const lastBook = bookEntries.find(entry => entry.href === study.last);
  const bookmarks = bookEntries.filter(entry => study.saved.includes(entry.href));
  useEffect(() => {
    if (view === 'book') setStudy(previous => previous.last === hash ? previous : { ...previous, last: hash });
  }, [view, hash, setStudy]);

  const [initialProgress] = useState(loadProgress);
  const [enrolledPaths, setEnrolledPaths] = useState(initialProgress.enrolledPaths);
  const [completedPaths, setCompletedPaths] = useState(initialProgress.completedPaths);
  const [completedTasksByRoom, setCompletedTasksByRoom] = useState(initialProgress.completedTasksByRoom);

  useEffect(() => {
    saveProgress({ enrolledPaths, completedPaths, completedTasksByRoom });
  }, [enrolledPaths, completedPaths, completedTasksByRoom]);

  const handleRoomClick = (room: Room) => { window.location.hash = `/rooms/${room.id}`; };
  const handlePathClick = (path: LearningPath) => { window.location.hash = `/paths/${path.id}`; };
  const handleStartRoom = () => { if (selectedRoom) window.location.hash = `/rooms/${selectedRoom.id}/lessons`; };
  const handleBackToDashboard = () => { window.location.hash = '/'; window.scrollTo(0, 0); };

  const isRoomComplete = (room: Room) => room.tasks.every(task => completedTasksByRoom[room.id]?.has(task.id));
  const pathRooms = selectedPath?.roomIds.flatMap(id => ROOMS.filter(room => room.id === id)) ?? [];
  const nextRoom = pathRooms.find(room => !isRoomComplete(room));
  const parentPath = selectedRoom && PATHS.find(path => path.roomIds.includes(selectedRoom.id));
  const followingRoom = parentPath && ROOMS.find(room => room.id === parentPath.roomIds[parentPath.roomIds.indexOf(selectedRoom!.id) + 1]);

  const togglePathEnrollment = (pathId: number) => {
    const newEnrolled = new Set(enrolledPaths);
    if (newEnrolled.has(pathId)) {
      newEnrolled.delete(pathId);
    } else {
      newEnrolled.add(pathId);
    }
    setEnrolledPaths(newEnrolled);
  };

  const markPathCompleted = (pathId: number) => {
    const newCompleted = new Set(completedPaths);
    newCompleted.add(pathId);
    setCompletedPaths(newCompleted);
  };

  return (
    <div className="min-h-screen bg-background text-muted-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar onDashboardClick={handleBackToDashboard} dark={study.theme === 'dark'} onTheme={() => setStudy(previous => ({ ...previous, theme: previous.theme === 'dark' ? 'light' : 'dark' }))} />

      <main ref={main} tabIndex={-1} className="container mx-auto px-4 py-6 md:py-12 relative z-10 focus:outline-none">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-14"
            >
              <section className="grid items-center gap-8 rounded-3xl border border-border bg-card p-7 md:grid-cols-[1.4fr_1fr] md:p-14">
                <div className="space-y-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">The cybersecurity study workspace</p>
                  <h1 className="max-w-xl font-serif text-5xl font-bold leading-tight sm:text-6xl">Learn to think like a defender.</h1>
                  <p className="max-w-lg text-lg text-muted-foreground">Read practical course books, work through realistic scenarios, and build a record of what you’ve learned.</p>
                  <a className="inline-block font-semibold text-primary underline" href="#learning-paths">Browse the curriculum ↓</a>
                </div>
                <aside className="space-y-3 rounded-2xl bg-secondary p-6">
                  <h2 className="font-serif text-2xl font-bold">{lastBook ? 'Continue reading' : 'Start learning'}</h2>
                  <p className="text-muted-foreground">{lastBook ? lastBook.task.title : 'Begin with the Defensive Engineering path, from networking foundations to incident response.'}</p>
                  <a className="inline-block rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground" href={lastBook?.href ?? '#/paths/4'}>{lastBook ? 'Open last chapter' : 'Explore Defensive Engineering'}</a>
                  <p className="text-sm text-muted-foreground">{study.read.length} chapters read · {study.saved.length} bookmarked</p>
                </aside>
              </section>

              {bookmarks.length > 0 && <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-3 font-serif text-2xl font-bold">Bookmarked chapters</h2>
                <ul className="space-y-2">{bookmarks.map(entry => <li key={entry.href}>
                  <a className="text-primary underline" href={entry.href}>{entry.task.title}</a> <span className="text-sm text-muted-foreground">· {entry.room.title}</span>
                </li>)}</ul>
              </section>}

              {/* Learning Paths Grid */}
              <section id="learning-paths" className="scroll-mt-24 space-y-12">
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Learning Paths</h2>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Structured journeys from beginner to advanced</p>
                  </div>
                  <div className="h-px flex-1 bg-secondary mx-8 mb-3 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {PATHS.map((path, idx) => {
                    const Icon = ICON_MAP[path.icon] || TerminalIcon;
                    const isEnrolled = enrolledPaths.has(path.id);
                    const isCompleted = path.roomIds.every(id => ROOMS.some(room => room.id === id && isRoomComplete(room)));
                    
                    return (
                      <motion.div
                        key={path.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="group relative"
                      >
                        <div className={`absolute inset-0 blur-3xl opacity-0 transition-opacity ${isEnrolled ? 'bg-emerald-500/10 group-hover:opacity-20' : 'bg-primary/20 group-hover:opacity-10'}`} />
                        <div className={`relative w-full h-full p-8 glass glass-hover rounded-3xl flex flex-col justify-between gap-6 ${isEnrolled ? 'border-emerald-500/20' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-4 rounded-2xl border ${isEnrolled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                <Icon className="w-8 h-8" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-foreground">{path.title}</h3>
                                <div className="flex gap-3 mt-1">
                                  <Badge variant="outline" className="border-border text-muted-foreground bg-secondary">{path.difficulty}</Badge>
                                  <Badge variant="outline" className="border-border text-muted-foreground bg-secondary">{path.roomIds.length} Rooms</Badge>
                                </div>
                              </div>
                            </div>
                            {isCompleted && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Completed</Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground text-sm leading-relaxed">{path.description}</p>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {path.duration}</span>
                            </div>
                            <Button 
                              onClick={() => handlePathClick(path)}
                              variant={isEnrolled ? "default" : "outline"}
                              className={isEnrolled ? "bg-emerald-500 hover:bg-emerald-600 text-primary-foreground font-bold" : "border-border hover:bg-secondary"}
                            >
                              {isEnrolled ? 'Continue Path' : 'View Path'} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Rooms Grid */}
              <section id="learning-rooms" className="scroll-mt-24 space-y-12">
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Learning Rooms</h2>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Select your path of expertise</p>
                  </div>
                  <div className="h-px flex-1 bg-secondary mx-8 mb-3 hidden md:block" />
                </div>

                <label className="block max-w-sm text-sm font-semibold">Search courses
                  <input type="search" value={query} onChange={event => setQuery(event.target.value)} className="mt-2 block w-full rounded-lg border border-border bg-card px-3 py-2" placeholder="Try networking or incident response" />
                </label>
                {!matchingRooms.length && <p role="status">No courses match your search.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingRooms.map((room, idx) => {
                    const Icon = ICON_MAP[room.icon] || TerminalIcon;
                    const completedTasks = completedTasksByRoom[room.id] || new Set<number>();
                    const progressPercentage = Math.round((completedTasks.size / room.tasks.length) * 100);

                    return (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
                        <button
                          onClick={() => handleRoomClick(room)}
                          className="relative w-full h-full p-8 glass glass-hover rounded-3xl text-left flex flex-col justify-between gap-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                              <Icon className="w-8 h-8" />
                            </div>
                            <Badge variant="outline" className="border-border text-muted-foreground bg-secondary">{room.difficulty}</Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{room.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{room.description}</p>
                          </div>

                          <div className="w-full space-y-1.5 mt-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-primary">{progressPercentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {room.tasks.length} sessions</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {room.duration}</span>
                            </div>
                            <div className="flex items-center text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                              Join Room <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'path_details' && selectedPath && (
            <motion.div
              key="path_details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <Button 
                variant="ghost" 
                onClick={handleBackToDashboard}
                className="p-0 h-auto text-muted-foreground hover:text-primary mb-4"
              >
                ← Back to Dashboard
              </Button>

              <div className="glass rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                  <div className="p-8 bg-secondary rounded-3xl border border-border">
                    {React.createElement(ICON_MAP[selectedPath.icon] || TerminalIcon, { className: "w-24 h-24 text-primary" })}
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">{selectedPath.difficulty}</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">{selectedPath.roomIds.length} Rooms</Badge>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{selectedPath.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">{selectedPath.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono pt-4 border-t border-border">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {selectedPath.duration}</span>
                    </div>

                    <div className="pt-6 flex flex-wrap gap-4">
                      <Button 
                        onClick={() => togglePathEnrollment(selectedPath.id)} 
                        size="lg" 
                        className={enrolledPaths.has(selectedPath.id) ? "bg-secondary hover:bg-accent text-foreground font-bold px-8 h-14 rounded-xl" : "bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-14 rounded-xl"}
                      >
                        {enrolledPaths.has(selectedPath.id) ? 'Unenroll from Path' : 'Enroll in Path'}
                      </Button>
                      
                      {enrolledPaths.has(selectedPath.id) && (
                        <Button 
                          disabled={!!nextRoom || completedPaths.has(selectedPath.id)}
                          onClick={() => markPathCompleted(selectedPath.id)} 
                          size="lg" 
                          variant="outline"
                          className={completedPaths.has(selectedPath.id) ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 px-8 h-14 rounded-xl" : "border-border hover:bg-secondary px-8 h-14 rounded-xl"}
                        >
                          {completedPaths.has(selectedPath.id) && !nextRoom ? 'Path Completed ✓' : 'Mark as Completed'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Course Sequence</h3>
                <p className="text-muted-foreground">{pathRooms.filter(isRoomComplete).length} of {pathRooms.length} courses completed</p>
                {nextRoom && <Button onClick={() => handleRoomClick(nextRoom)}>Continue: {nextRoom.title}</Button>}
                <div className="grid gap-4">
                  {selectedPath.roomIds.map((roomId, idx) => {
                    const room = ROOMS.find(r => r.id === roomId);
                    if (!room) return null;
                    const Icon = ICON_MAP[room.icon] || TerminalIcon;
                    
                    return (
                      <div key={room.id} className="glass p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-bold text-muted-foreground">{idx + 1}. {room.title}</h4>
                              {isRoomComplete(room) && <span className="text-xs text-emerald-400">Completed</span>}
                              <Badge variant="outline" className="text-[10px] bg-secondary border-border">{room.difficulty}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{room.description}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleRoomClick(room)}
                          variant="ghost"
                          className="text-primary hover:text-primary hover:bg-primary/10 shrink-0"
                        >
                          View Room <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'room_details' && selectedRoom && (
            <motion.div
              key="room_details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <Button 
                variant="ghost" 
                onClick={handleBackToDashboard}
                className="p-0 h-auto text-muted-foreground hover:text-primary mb-4"
              >
                ← Back to Dashboard
              </Button>

              <div className="glass rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                  <div className="p-8 bg-secondary rounded-3xl border border-border">
                    {React.createElement(ICON_MAP[selectedRoom.icon] || TerminalIcon, { className: "w-24 h-24 text-primary" })}
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">{selectedRoom.difficulty}</Badge>
                      {selectedRoom.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-border text-muted-foreground">{tag}</Badge>
                      ))}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{selectedRoom.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">{selectedRoom.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono pt-4 border-t border-border">
                      <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> {selectedRoom.tasks.filter(task => task.reading).length} book chapters</span>
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {selectedRoom.duration}</span>
                      <span className="flex items-center gap-2"><TerminalIcon className="w-4 h-4 text-primary" /> {selectedRoom.tasks.length} Tasks</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-6">
                      {selectedRoom.tasks.some(task => task.reading) && <a className="rounded-lg border border-border px-4 py-3 font-semibold text-primary hover:bg-accent" href={bookEntries.find(entry => entry.room.id === selectedRoom.id)?.href}>Read the course book</a>}
                      <Button onClick={handleStartRoom} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-14 rounded-xl w-full md:w-auto text-lg">
                        <Play className="w-5 h-5 mr-2 fill-current" /> Start Lessons
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedRoom.video && (
                  <aside className="glass rounded-2xl border border-border p-5">
                    <h3 className="font-bold text-foreground">Companion video</h3>
                    {selectedRoom.video.guide && <p className="my-2 text-muted-foreground">{selectedRoom.video.guide}</p>}
                    <a className="text-primary underline underline-offset-4" href={selectedRoom.video.url} target="_blank" rel="noopener noreferrer">{selectedRoom.video.title} (YouTube, opens in a new tab)</a>
                  </aside>
                )}
                <h3 className="text-2xl font-bold text-foreground">Course Curriculum</h3>
                {selectedRoom.tasks.some(task => task.reading) && <p className="text-muted-foreground">{bookEntries.filter(entry => entry.room.id === selectedRoom.id && study.read.includes(entry.href)).length} of {selectedRoom.tasks.filter(task => task.reading).length} chapters read</p>}
                <p className="text-muted-foreground">{completedTasksByRoom[selectedRoom.id]?.size ?? 0} of {selectedRoom.tasks.length} lessons completed</p>
                {isRoomComplete(selectedRoom) && followingRoom && (
                  <Button onClick={() => handleRoomClick(followingRoom)}>Next course: {followingRoom.title}</Button>
                )}
                <div className="grid gap-4">
                  {selectedRoom.tasks.map((task, idx) => (
                    <div key={task.id} className="glass p-6 rounded-2xl border border-border flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground font-mono font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-muted-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.reading ? 'Book chapter and practice session' : 'Lesson'}</p>
                        {task.reading && <a className="text-sm text-primary underline" href={`#/rooms/${selectedRoom.id}/book/${task.id}`}>Read chapter {idx + 1}</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'book' && selectedRoom && bookChapter && (
            <Suspense key="course-book" fallback={<p role="status">Loading course book…</p>}>
              <CourseBook room={selectedRoom} chapterId={bookChapter.id} size={study.size} read={study.read} saved={study.saved}
                onSize={() => setStudy(value => ({ ...value, size: value.size === 'standard' ? 'large' : 'standard' }))}
                onToggle={(kind, key) => setStudy(value => ({ ...value, [kind]: value[kind].includes(key) ? value[kind].filter(item => item !== key) : [...value[kind], key] }))} />
            </Suspense>
          )}

          {view === 'task_viewer' && selectedRoom && (
            <motion.div
              key={`task_viewer-${selectedRoom.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-[calc(100dvh-8rem)] min-h-96 md:h-[calc(100dvh-12rem)]"
            >
              <Suspense fallback={<p role="status">Loading lessons…</p>}>
              <CyberTerminal 
                room={selectedRoom} 
                completedTasks={completedTasksByRoom[selectedRoom.id] || new Set<number>()}
                onTaskComplete={(taskId) => {
                  setCompletedTasksByRoom(prev => {
                    const newSet = new Set(prev[selectedRoom.id] || []);
                    newSet.add(taskId);
                    return { ...prev, [selectedRoom.id]: newSet };
                  });
                }}
                onClose={() => handleRoomClick(selectedRoom)}
              />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold tracking-tighter text-foreground">
              CYBER<span className="text-primary">SAFARI</span> PRO
            </span>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground">© 2026 SAFARI SECURITY SYSTEMS</p>
        </div>
      </footer>
    </div>
  );
}
