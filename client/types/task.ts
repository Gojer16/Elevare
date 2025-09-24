/**
 * Type definitions for Task and Tag entities
 * 
 * These interfaces define the structure of task and tag objects
 * as they are used throughout the application, particularly in
 * API responses and client-side state management.
 */

/**
 * Tag interface
 * 
 * Represents a tag that can be associated with tasks for organization
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: string;
  
  /** The name of the tag */
  name: string;
}

/**
 * Task interface
 * 
 * Represents a task in the Elevare application
 * Tasks are the core entity for the one-thing-per-day methodology
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  
  /** The main title of the task */
  title: string;
  
  /** Detailed description of the task (optional) */
  description: string;
  
  /** Flag indicating if the task is completed */
  isDone: boolean;
  
  /** ISO date string representing when the task was created */
  createdAt: string;
  
  /** User's reflection on the completed task (deprecated, use Reflection model instead) */
  reflection?: string;
  
  /** Flag to indicate if task is completed (duplicate of isDone, included for compatibility) */
  completed?: boolean;
  
  /** Date string for the task (optional) */
  date?: string;
  
  /** Collection of tags associated with this task */
  tags?: Tag[];
}