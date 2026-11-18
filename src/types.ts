export interface Task {
  id: number;
  title: string;
  content: string;
  reading?: string;
}

export interface Room {
  id: number;
  title: string;
  icon: string;
  description: string;
  difficulty: 'Info' | 'Easy' | 'Medium' | 'Hard' | 'Insane';
  duration: string;
  users: number;
  tags: string[];
  tasks: Task[];
  video?: { title: string; url: string; guide?: string };
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  roomIds: number[];
}

export interface Module {
  id: number;
  title: string;
  icon: string;
  description: string;
  subModules?: SubModule[];
}

export interface SubModule {
  id: number;
  title: string;
  content: string;
}

export type Screen = 'login' | 'menu' | 'module' | 'submodule';
