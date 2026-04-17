import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Key, Terminal as TerminalIcon, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import BinaryBackground from './BinaryBackground';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(0); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0 && username) setStep(1);
    else if (step === 1 && password) setStep(2);
    else if (step === 2 && pin) {
      setStep(3);
      verify();
    }
  };

  const verify = () => {
    setLoading(true);
    setTimeout(() => {
      if (username === 'safari' && password === 'safari410' && pin === '145556') {
        onLogin();
      } else {
        setError('Invalid credentials. Access denied.');
        setStep(0);
        setUsername('');
        setPassword('');
        setPin('');
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 overflow-hidden relative">
      <BinaryBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass border-white/10 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-2 pb-8 pt-12">
            <motion.div 
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20"
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tighter text-white">
              CYBER<span className="text-primary">SAFARI</span> PRO
            </CardTitle>
            <CardDescription className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
              Authorized Personnel Only
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12 px-8">
            <AnimatePresence mode="wait">
              {step < 3 ? (
                <motion.form
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleNext}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest ml-1">
                      {step === 0 ? 'Identity' : step === 1 ? 'Passkey' : 'Security Token'}
                    </Label>
                    <div className="relative">
                      {step === 0 && <TerminalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />}
                      {step === 1 && <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />}
                      {step === 2 && <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />}
                      
                      <Input
                        autoFocus
                        type={step === 1 ? 'password' : 'text'}
                        value={step === 0 ? username : step === 1 ? password : pin}
                        onChange={(e) => {
                          if (step === 0) setUsername(e.target.value);
                          else if (step === 1) setPassword(e.target.value);
                          else setPin(e.target.value);
                          setError('');
                        }}
                        placeholder={step === 0 ? "Username" : step === 1 ? "Password" : "Pin"}
                        className="bg-white/5 border-white/10 h-14 pl-12 text-primary font-mono focus-visible:ring-primary/50 rounded-2xl"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-[10px] font-mono uppercase text-center tracking-widest"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold uppercase tracking-widest h-14 rounded-2xl shadow-lg shadow-primary/20"
                  >
                    Continue <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-6"
                >
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-primary font-mono text-sm tracking-widest animate-pulse">ESTABLISHING UPLINK...</p>
                    <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-tighter">Bypassing local firewalls</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-center gap-2 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
