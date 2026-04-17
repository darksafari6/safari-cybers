import React from 'react';
import { motion } from 'motion/react';
import { Shield, LogOut, User, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onLogout: () => void;
  onDashboardClick: () => void;
}

export default function Navbar({ onLogout, onDashboardClick }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <button 
            onClick={onDashboardClick}
            className="flex items-center gap-2 group transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">
              CYBER<span className="text-primary">SAFARI</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" className="text-zinc-400 hover:text-primary hover:bg-primary/5 text-xs uppercase tracking-widest font-mono">Modules</Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-primary hover:bg-primary/5 text-xs uppercase tracking-widest font-mono">Practice</Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-primary hover:bg-primary/5 text-xs uppercase tracking-widest font-mono">Community</Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-primary">
            <Bell className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 overflow-hidden hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-zinc-300">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={onLogout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}
