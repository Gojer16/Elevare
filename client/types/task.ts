export interface Tag {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: string;
  reflection?: string;
  completed?: boolean;
  date?: string;
  tags?: Tag[];
}