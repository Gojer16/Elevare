"use client";
import { useState, useMemo } from "react";
import ArchiveList from "../../components/ArchiveList";
import { useTasks } from "../../hooks/useTask";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useTheme } from "@/contexts/ThemeContext";

export default function ArchivePage() {
  const { archive, isLoading } = useTasks();
  const { theme } = useTheme();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'completion'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'reset'>('all');
  
  // Theme-based layout adjustments
  const isMinimal = theme === 'minimal';
  const containerClass = isMinimal 
    ? "w-full max-w-4xl mx-auto py-4 px-2" 
    : "w-full max-w-2xl mx-auto py-6 px-2";
  const headerClass = isMinimal 
    ? "text-xl font-semibold mb-2" 
    : "text-2xl font-bold mb-2";
  const descriptionClass = isMinimal 
    ? "text-sm mb-4" 
    : "text-gray-600 mb-6";

  // Process and filter archive data
  const processedArchive = useMemo(() => {
    return archive.map((t) => {
      const taskDate = new Date(t.createdAt);
      const formattedDate = taskDate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return {
        ...t,
        description: t.description ?? "",
        completed: t.isDone,
        date: formattedDate,
        reflection: t.reflection ?? "",
        sortDate: taskDate, // For sorting
      };
    });
  }, [archive]);

  // Filter and sort archive
  const filteredAndSortedArchive = useMemo(() => {
    let filtered = processedArchive;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.reflection && task.reflection.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(task => 
        filterBy === 'completed' ? task.completed : !task.completed
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'completion':
          return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
        case 'date':
        default:
          return b.sortDate.getTime() - a.sortDate.getTime(); // Newest first
      }
    });

    return filtered;
  }, [processedArchive, searchQuery, sortBy, filterBy]);

  return (
    <section className={containerClass}>
      <h2 className={`${headerClass} text-[var(--color-foreground)]`}>
        {isMinimal ? "Archive" : "Your Momentum Journal"}
      </h2>
      <p className={`${descriptionClass} text-[var(--color-foreground)]`}>
        {isMinimal 
          ? "Completed tasks and reflections." 
          : "Every completed task is proof that focus works. Scroll back to see how far you've come."
        }
      </p>

      {/* Search and Filter Controls */}
      {!isLoading && processedArchive.length > 0 && (
        <div className={`${isMinimal ? 'mb-4' : 'mb-6'} space-y-3`}>
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks, descriptions, or reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full px-4 py-2 rounded-lg border
                ${isMinimal 
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                  : 'bg-[var(--color-card)] border-[var(--color-border)]'
                }
                text-[var(--color-foreground)] placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
              `}
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className={`
                px-3 py-2 rounded-lg border text-sm
                ${isMinimal 
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                  : 'bg-[var(--color-card)] border-[var(--color-border)]'
                }
                text-[var(--color-foreground)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              `}
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed Only</option>
              <option value="reset">Reset Only</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`
                px-3 py-2 rounded-lg border text-sm
                ${isMinimal 
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                  : 'bg-[var(--color-card)] border-[var(--color-border)]'
                }
                text-[var(--color-foreground)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              `}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="completion">Sort by Status</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-[var(--color-foreground)] opacity-70">
              {filteredAndSortedArchive.length} of {processedArchive.length} tasks
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ArchiveList tasks={filteredAndSortedArchive} />
      )}
    </section>
  );
}
