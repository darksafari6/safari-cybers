import React, { useState, useEffect } from 'react';
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
  Cpu,
  Lock,
  Activity,
  Search,
  Zap,
  Users,
  Clock,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROOMS, PATHS } from '@/src/constants';
import { Room, LearningPath } from '@/src/types';
import CyberTerminal from './CyberTerminal';
import Navbar from './Navbar';
import BinaryBackground from './BinaryBackground';

interface CyberLayoutProps {
  onLogout: () => void;
}

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

export default function CyberLayout({ onLogout }: CyberLayoutProps) {
  const [view, setView] = useState<'dashboard' | 'room_details' | 'task_viewer' | 'path_details'>('dashboard');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  
  // Mock user progress state
  const [enrolledPaths, setEnrolledPaths] = useState<Set<number>>(new Set());
  const [completedPaths, setCompletedPaths] = useState<Set<number>>(new Set());
  const [completedTasksByRoom, setCompletedTasksByRoom] = useState<Record<number, Set<number>>>({});

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(() => setSystemStatus({ system: 'ONLINE', version: '4.1.0', status: 'SECURE' }));
  }, []);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setView('room_details');
  };

  const handlePathClick = (path: LearningPath) => {
    setSelectedPath(path);
    setView('path_details');
  };

  const handleStartRoom = () => {
    setView('task_viewer');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedRoom(null);
    setSelectedPath(null);
  };

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
    <div className="min-h-screen bg-black text-zinc-300 selection:bg-primary/30 selection:text-primary">
      <BinaryBackground />
      <Navbar onLogout={onLogout} onDashboardClick={handleBackToDashboard} />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <section className="text-center space-y-8 py-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-fit"
                >
                  <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary font-mono text-xs uppercase tracking-[0.2em]">
                    Next-Gen Security Training
                  </Badge>
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white max-w-4xl mx-auto leading-[0.9]">
                  MASTER THE <span className="text-primary italic">DIGITAL</span> FRONTIER
                </h1>
                
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Professional-grade cybersecurity training platform. 
                  Learn offensive and defensive techniques in a secure, sandboxed environment.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold px-8 h-14 rounded-full group">
                    Start Learning <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 px-8 h-14 rounded-full">
                    View Curriculum
                  </Button>
                </div>

                {/* System Stats Bar */}
                {systemStatus && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap justify-center gap-8 pt-12 opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">System: {systemStatus.system}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Version: {systemStatus.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Status: {systemStatus.status}</span>
                    </div>
                  </motion.div>
                )}
              </section>

              {/* Learning Paths Grid */}
              <section className="space-y-12">
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Learning Paths</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Structured journeys from beginner to advanced</p>
                  </div>
                  <div className="h-px flex-1 bg-white/5 mx-8 mb-3 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {PATHS.map((path, idx) => {
                    const Icon = ICON_MAP[path.icon] || TerminalIcon;
                    const isEnrolled = enrolledPaths.has(path.id);
                    const isCompleted = completedPaths.has(path.id);
                    
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
                                <h3 className="text-2xl font-bold text-white">{path.title}</h3>
                                <div className="flex gap-3 mt-1">
                                  <Badge variant="outline" className="border-white/10 text-zinc-400 bg-black/50">{path.difficulty}</Badge>
                                  <Badge variant="outline" className="border-white/10 text-zinc-400 bg-black/50">{path.roomIds.length} Rooms</Badge>
                                </div>
                              </div>
                            </div>
                            {isCompleted && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Completed</Badge>
                            )}
                          </div>
                          
                          <p className="text-zinc-400 text-sm leading-relaxed">{path.description}</p>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-4 text-xs text-zinc-500 font-mono">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {path.duration}</span>
                            </div>
                            <Button 
                              onClick={() => handlePathClick(path)}
                              variant={isEnrolled ? "default" : "outline"}
                              className={isEnrolled ? "bg-emerald-500 hover:bg-emerald-600 text-black font-bold" : "border-white/10 hover:bg-white/5"}
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
              <section className="space-y-12">
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Learning Rooms</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Select your path of expertise</p>
                  </div>
                  <div className="h-px flex-1 bg-white/5 mx-8 mb-3 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ROOMS.map((room, idx) => {
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
                            <Badge variant="outline" className="border-white/10 text-zinc-400 bg-black/50">{room.difficulty}</Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{room.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{room.description}</p>
                          </div>

                          <div className="w-full space-y-1.5 mt-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-zinc-500">Progress</span>
                              <span className="text-primary">{progressPercentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-4 text-xs text-zinc-500 font-mono">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.users.toLocaleString()}</span>
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
                className="p-0 h-auto text-zinc-500 hover:text-primary mb-4"
              >
                ← Back to Dashboard
              </Button>

              <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                  <div className="p-8 bg-black/50 rounded-3xl border border-white/5">
                    {React.createElement(ICON_MAP[selectedPath.icon] || TerminalIcon, { className: "w-24 h-24 text-primary" })}
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">{selectedPath.difficulty}</Badge>
                      <Badge variant="outline" className="border-white/10 text-zinc-400">{selectedPath.roomIds.length} Rooms</Badge>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{selectedPath.title}</h1>
                    <p className="text-xl text-zinc-400 leading-relaxed">{selectedPath.description}</p>
                    
                    <div className="flex gap-8 text-sm text-zinc-500 font-mono pt-4 border-t border-white/5">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {selectedPath.duration}</span>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <Button 
                        onClick={() => togglePathEnrollment(selectedPath.id)} 
                        size="lg" 
                        className={enrolledPaths.has(selectedPath.id) ? "bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 h-14 rounded-xl" : "bg-primary hover:bg-primary/90 text-black font-bold px-8 h-14 rounded-xl"}
                      >
                        {enrolledPaths.has(selectedPath.id) ? 'Unenroll from Path' : 'Enroll in Path'}
                      </Button>
                      
                      {enrolledPaths.has(selectedPath.id) && (
                        <Button 
                          onClick={() => markPathCompleted(selectedPath.id)} 
                          size="lg" 
                          variant="outline"
                          className={completedPaths.has(selectedPath.id) ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 px-8 h-14 rounded-xl" : "border-white/10 hover:bg-white/5 px-8 h-14 rounded-xl"}
                        >
                          {completedPaths.has(selectedPath.id) ? 'Path Completed ✓' : 'Mark as Completed'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Path Rooms</h3>
                <div className="grid gap-4">
                  {selectedPath.roomIds.map((roomId, idx) => {
                    const room = ROOMS.find(r => r.id === roomId);
                    if (!room) return null;
                    const Icon = ICON_MAP[room.icon] || TerminalIcon;
                    
                    return (
                      <div key={room.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-bold text-zinc-200">{room.title}</h4>
                              <Badge variant="outline" className="text-[10px] bg-black/50 border-white/10">{room.difficulty}</Badge>
                            </div>
                            <p className="text-sm text-zinc-500 line-clamp-1">{room.description}</p>
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
                className="p-0 h-auto text-zinc-500 hover:text-primary mb-4"
              >
                ← Back to Dashboard
              </Button>

              <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                  <div className="p-8 bg-black/50 rounded-3xl border border-white/5">
                    {React.createElement(ICON_MAP[selectedRoom.icon] || TerminalIcon, { className: "w-24 h-24 text-primary" })}
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">{selectedRoom.difficulty}</Badge>
                      {selectedRoom.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-white/10 text-zinc-400">{tag}</Badge>
                      ))}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{selectedRoom.title}</h1>
                    <p className="text-xl text-zinc-400 leading-relaxed">{selectedRoom.description}</p>
                    
                    <div className="flex gap-8 text-sm text-zinc-500 font-mono pt-4 border-t border-white/5">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {selectedRoom.users.toLocaleString()} Enrolled</span>
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {selectedRoom.duration}</span>
                      <span className="flex items-center gap-2"><TerminalIcon className="w-4 h-4 text-primary" /> {selectedRoom.tasks.length} Tasks</span>
                    </div>

                    <div className="pt-6">
                      <Button onClick={handleStartRoom} size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold px-8 h-14 rounded-xl w-full md:w-auto text-lg">
                        <Play className="w-5 h-5 mr-2 fill-current" /> Start Machine
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Course Curriculum</h3>
                <div className="grid gap-4">
                  {selectedRoom.tasks.map((task, idx) => (
                    <div key={task.id} className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-zinc-500 font-mono font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-200">{task.title}</h4>
                        <p className="text-sm text-zinc-500 line-clamp-1">Learn the fundamentals and practical applications.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'task_viewer' && selectedRoom && (
            <motion.div
              key="task_viewer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-[calc(100vh-12rem)]"
            >
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
                onClose={() => setView('room_details')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/5 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold tracking-tighter text-white">
              CYBER<span className="text-primary">SAFARI</span> PRO
            </span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
          </div>
          <p className="text-[10px] font-mono text-zinc-700">© 2026 SAFARI SECURITY SYSTEMS</p>
        </div>
      </footer>
    </div>
  );
}
