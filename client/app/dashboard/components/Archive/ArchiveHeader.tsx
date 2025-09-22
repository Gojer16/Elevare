"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArchiveExport } from "./ArchiveExport";
import type { Task } from '../../../../types/task';

interface ArchiveHeaderProps {
    totalTasks: number;
    completedTasks: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: 'date' | 'title' | 'completion';
    onSortChange: (sort: 'date' | 'title' | 'completion') => void;
    filterBy: 'all' | 'completed' | 'reset';
    onFilterChange: (filter: 'all' | 'completed' | 'reset') => void;
    filteredCount: number;
    allTasks: Task[]; // For export functionality
}

export function ArchiveHeader({
    totalTasks,
    completedTasks,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    filterBy,
    onFilterChange,
    filteredCount,
    allTasks
}: ArchiveHeaderProps) {
    const [showFilters, setShowFilters] = useState(false);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
                        Your Journey Archive
                    </h1>
                </div>

                <p className="text-lg text-[var(--color-foreground)]/70 mb-6 max-w-2xl mx-auto">
                    Every completed task is proof that focus works. This is your collection of wins,
                    reflections, and the momentum you&apos;ve built one day at a time.
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                       border border-blue-200 dark:border-blue-800 rounded-2xl p-4"
                    >
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTasks}</div>
                        <div className="text-sm text-[var(--color-foreground)]/70">Total Tasks</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                       border border-green-200 dark:border-green-800 rounded-2xl p-4"
                    >
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
                        <div className="text-sm text-[var(--color-foreground)]/70">Completed</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                       border border-purple-200 dark:border-purple-800 rounded-2xl p-4"
                    >
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</div>
                        <div className="text-sm text-[var(--color-foreground)]/70">Success Rate</div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm"
            >
                {/* Search Bar */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-[var(--color-foreground)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search your tasks, descriptions, or reflections..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[var(--card-bg)] border-2 border-[var(--border-color)] 
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                       focus:border-[var(--color-secondary)] transition-all duration-200
                       text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
                    />
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 
                       text-[var(--color-secondary)] rounded-xl transition-colors font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                        </svg>
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-[var(--color-foreground)]/60">
                            Showing {filteredCount} of {totalTasks} tasks
                        </div>
                        <ArchiveExport tasks={allTasks} />
                    </div>
                </div>

                {/* Expandable Filters */}
                <motion.div
                    initial={false}
                    animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="pt-4 border-t border-[var(--border-color)] mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                    Status
                                </label>
                                <select
                                    value={filterBy}
                                    onChange={(e) => onFilterChange(e.target.value as 'all' | 'completed' | 'reset')}
                                    className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] 
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                             text-[var(--color-foreground)]"
                                >
                                    <option value="all">All Tasks</option>
                                    <option value="completed">✅ Completed Only</option>
                                    <option value="reset">🔄 Reset Only</option>
                                </select>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => onSortChange(e.target.value as 'date' | 'title' | 'completion')}
                                    className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] 
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                             text-[var(--color-foreground)]"
                                >
                                    <option value="date">📅 Most Recent</option>
                                    <option value="title">🔤 Alphabetical</option>
                                    <option value="completion">✅ By Status</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}