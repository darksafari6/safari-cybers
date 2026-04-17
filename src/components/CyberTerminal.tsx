import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, X, Maximize2, Share2, Bookmark, Copy, Check, ChevronRight, ChevronLeft, Trophy, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Room, Task } from '@/src/types';

interface CyberTerminalProps {
  room: Room;
  completedTasks: Set<number>;
  onTaskComplete: (taskId: number) => void;
  onClose?: () => void;
}

export default function CyberTerminal({ room, completedTasks, onTaskComplete, onClose }: CyberTerminalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);

  const activeTask = room.tasks[activeTaskIndex];
  const isLastTask = activeTaskIndex === room.tasks.length - 1;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markTaskCompleted = () => {
    onTaskComplete(activeTask.id);

    // If this is the last task and all other tasks are either already complete or about to be (this one)
    if (isLastTask && (completedTasks.size + (completedTasks.has(activeTask.id) ? 0 : 1) === room.tasks.length)) {
      setShowCompletionBadge(true);
    } else if (!isLastTask) {
      setActiveTaskIndex(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full h-full flex flex-col bg-zinc-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <TerminalIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white uppercase">{room.title}</span>
              <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-mono text-[10px] px-2 py-0">
                {room.difficulty}
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Interactive Learning Module</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Body - Split Pane */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10 opacity-20" />
        
        {/* Sidebar - Task List */}
        <div className="w-64 border-r border-white/10 bg-black/40 hidden md:flex flex-col z-20">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Tasks ({completedTasks.size}/{room.tasks.length})</h3>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${(completedTasks.size / room.tasks.length) * 100}%` }}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {room.tasks.map((task, idx) => {
                const isCompleted = completedTasks.has(task.id);
                const isActive = activeTaskIndex === idx;
                return (
                  <button
                    key={task.id}
                    onClick={() => setActiveTaskIndex(idx)}
                    className={`w-full text-left px-3 py-3 rounded-xl flex items-start gap-3 transition-all ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Circle className={`w-4 h-4 ${isActive ? 'text-primary/50' : 'text-zinc-600'}`} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${isActive ? 'text-primary' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Task {idx + 1}
                      </span>
                      <span className="text-[10px] text-zinc-500 line-clamp-1">{task.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 h-full z-20 bg-black/60">
          <div className="p-8 md:p-12 max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">Task {activeTaskIndex + 1}</Badge>
              <h2 className="text-3xl font-bold text-white">{activeTask.title}</h2>
            </div>

            <div className="markdown-body prose prose-invert prose-zinc max-w-none">
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-4">
                      <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold tracking-tight text-primary mt-12 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary/40" />
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="text-zinc-400 leading-relaxed mb-8 text-lg font-light">
                      {children}
                    </p>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-sm font-mono border border-primary/20">{children}</code>;
                    }
                    return (
                      <div className="relative group/code my-10">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-3xl opacity-0 group-hover/code:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
                          <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/10">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Bash Terminal</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleCopy}
                                className="h-8 px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                              >
                                {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                                {copied ? 'Copied' : 'Copy'}
                              </Button>
                            </div>
                          </div>
                          <pre className="p-8 overflow-x-auto custom-scrollbar">
                            <code className="text-primary font-mono text-base leading-relaxed">
                              {children}
                            </code>
                          </pre>
                        </div>
                      </div>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="space-y-4 mb-10 list-none p-0">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-4 text-zinc-400 text-lg font-light group/li">
                      <div className="mt-3 h-2 w-2 rounded-full bg-primary/20 border border-primary/40 shrink-0 group-hover/li:bg-primary/60 transition-colors" />
                      <span className="group-hover:text-zinc-200 transition-colors">{children}</span>
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/30 bg-primary/5 p-6 rounded-r-2xl my-8 italic text-zinc-300">
                      {children}
                    </blockquote>
                  )
                }}
              >
                {activeTask.content}
              </Markdown>
            </div>
            
            {/* Task Completion Section */}
            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setActiveTaskIndex(prev => Math.max(0, prev - 1))}
                disabled={activeTaskIndex === 0}
                className="text-zinc-500 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous Task
              </Button>
              
              <Button 
                onClick={markTaskCompleted}
                className="bg-primary text-black font-bold px-8 h-12 rounded-xl hover:bg-primary/90 group"
              >
                {isLastTask ? 'Complete Room' : 'Complete & Continue'} 
                {isLastTask ? <Trophy className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Terminal Footer */}
      <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex justify-between items-center z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Uplink: Active</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">Session: 0x410_SAFARI</span>
        </div>
        <div className="text-[9px] font-mono text-primary/40 uppercase tracking-[0.2em]">
          CyberSafari Security OS v4.1.0
        </div>
      </div>

      {/* Completion Badge Modal */}
      <AnimatePresence>
        {showCompletionBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-950 border border-primary/20 p-12 rounded-3xl max-w-md text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/10 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary shadow-[0_0_50px_rgba(var(--primary),0.5)]">
                  <Trophy className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Room Completed!</h2>
                  <p className="text-zinc-400">You have successfully mastered <strong className="text-primary">{room.title}</strong>.</p>
                </div>
                <Button 
                  onClick={onClose}
                  className="w-full bg-primary text-black font-bold h-12 rounded-xl mt-4"
                >
                  Return to Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
