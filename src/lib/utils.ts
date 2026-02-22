import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Question, ProgressOrder, Progress } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractQuestionTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/problems\/([^\/]+)/);
    
    if (pathMatch && pathMatch[1]) {
      const kebabCaseTitle = pathMatch[1];
      const titleCaseTitle = kebabCaseTitle
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return titleCaseTitle;
    }
    
    return '';
  } catch (error) {
    console.error('Failed to extract question title from URL:', error);
    return '';
  }
}

export function sortQuestions(questions: Question[]): Question[] {
  const progressOrder: ProgressOrder = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
  };
  
  return [...questions].sort((a, b) => {
    const aPriority = progressOrder[a.progress];
    const bPriority = progressOrder[b.progress];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function filterQuestions(
  questions: Question[],
  searchTerm: string,
  progressFilter: Progress | 'all',
  topicFilter: string | 'all'
): Question[] {
  return questions.filter(question => {
    const matchesSearch = searchTerm === '' || 
      question.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgress = progressFilter === 'all' || 
      question.progress === progressFilter;
    
    const matchesTopic = topicFilter === 'all' || 
      question.topics.includes(topicFilter);
    
    return matchesSearch && matchesProgress && matchesTopic;
  });
}

export function getAllTopics(questions: Question[]): string[] {
  const topicsSet = new Set<string>();
  questions.forEach(question => {
    question.topics.forEach(topic => topicsSet.add(topic));
  });
  return Array.from(topicsSet).sort();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
