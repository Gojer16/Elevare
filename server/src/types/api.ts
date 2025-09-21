export interface Task {
  id: string;
  name: string;
  priority: number;
  dueDate?: string;
}

export interface AISuggestionRequest {
  prompt: string;
  currentTasks?: Task[];
}

export interface AISuggestionResponse {
  success: boolean;
  suggestion: {
    name: string;
    rationale: string;
  };
}

export interface AIFeedbackRequest {
  suggestion: {
    name: string;
    rationale: string;
  };
  feedback: 'helpful' | 'not-relevant';
}
