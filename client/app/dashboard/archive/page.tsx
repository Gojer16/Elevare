"use client";
import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTask";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ArchiveHeader } from "../components/Archive/ArchiveHeader";
import { ArchiveTimeline } from "../components/Archive/ArchiveTimeline";
import { ArchiveViewToggle } from "../components/Archive/ArchiveViewToggle";
import { ArchiveEmptyState } from "../components/Archive/ArchiveEmptyState";
import { DashboardBackground } from "../components/UI/DashboardBackground";

export default function ArchivePage() {
  const { archive, isLoading } = useTasks();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'completion'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'reset'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Calculate stats
  const stats = useMemo(() => {
    const total = archive.length;
    const completed = archive.filter(task => task.isDone).length;
    return { total, completed };
  }, [archive]);

  // Process and filter archive data
  const processedArchive = useMemo(() => {
    return archive.map((t) => ({
      ...t,
      description: t.description ?? "",
      completed: t.isDone,
      reflection: t.reflection ?? "",
    }));
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
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      }
    });

    return filtered;
  }, [processedArchive, searchQuery, sortBy, filterBy]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <DashboardBackground variant="archive" />
        <LoadingSpinner message="Loading your archive..." />
      </div>
    );
  }

  if (processedArchive.length === 0) {
    return (
      <div className="relative min-h-screen">
        <DashboardBackground variant="archive" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <ArchiveEmptyState />
        </div>
      </div>
    );
  }

  const hasSearchResults = filteredAndSortedArchive.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="relative min-h-screen">
      <DashboardBackground variant="archive" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Enhanced Header */}
        <ArchiveHeader
          totalTasks={stats.total}
          completedTasks={stats.completed}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          filteredCount={filteredAndSortedArchive.length}
          allTasks={processedArchive}
        />

        {/* View Toggle and Content */}
        {hasSearchResults && (
          <>
            <div className="flex justify-center mb-8">
              <ArchiveViewToggle
                viewMode={viewMode}
                onViewChange={setViewMode}
              />
            </div>

            <div className="max-w-6xl mx-auto">
              <ArchiveTimeline
                tasks={filteredAndSortedArchive}
                viewMode={viewMode}
              />
            </div>
          </>
        )}

        {/* No Search Results */}
        {!hasSearchResults && hasSearchQuery && (
          <ArchiveEmptyState
            hasSearchQuery={true}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}
