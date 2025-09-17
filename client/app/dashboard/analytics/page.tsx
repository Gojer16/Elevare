"use client";

import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Types for our analytics data
interface TaskCompletionData {
  id: string;
  title: string;
  completedAt: string;
  createdAt: string;
  tags: { name: string }[];
}

interface TaskFailureData {
  id: string;
  title: string;
  createdAt: string;
  tags: { name: string }[];
}

interface TagData {
  name: string;
  tasks: {
    isDone: boolean;
    completedAt: string | null;
  }[];
}

interface AnalyticsData {
  completionData: TaskCompletionData[];
  failureData: TaskFailureData[];
  tagData: TagData[];
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data: AnalyticsData = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        // err could be unknown; normalize message
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Process data for charts
  const processCompletionTrendData = () => {
    if (!analyticsData || analyticsData.completionData.length === 0) return [];
    
    // Group completions by date
    const completionByDate: { [date: string]: number } = {};
    
    analyticsData.completionData.forEach(task => {
      // Use completedAt if available, otherwise use createdAt
      const dateObj = task.completedAt ? new Date(task.completedAt) : new Date(task.createdAt);
      const date = dateObj.toISOString().split('T')[0];
      completionByDate[date] = (completionByDate[date] || 0) + 1;
    });
    
    // Convert to array format for charting and sort by date
    return Object.entries(completionByDate)
      .map(([date, count]) => ({
        date,
        completions: count
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const processTagDistributionData = () => {
    if (!analyticsData || analyticsData.tagData.length === 0) return [];
    
    return analyticsData.tagData.map(tag => ({
      name: tag.name,
      count: tag.tasks.length,
      completed: tag.tasks.filter(task => task.isDone).length
    }));
  };

  const processTagPieData = () => {
    if (!analyticsData || analyticsData.tagData.length === 0) return [];
    
    return analyticsData.tagData.map(tag => ({
      name: tag.name,
      value: tag.tasks.length
    }));
  };

  const completionTrendData = processCompletionTrendData();
  const tagDistributionData = processTagDistributionData();
  const tagPieData = processTagPieData();
  
  // Calculate completion rate
  const totalTasks = (analyticsData?.completionData?.length || 0) + (analyticsData?.failureData?.length || 0);
  const completionRate = totalTasks > 0 
    ? Math.round(((analyticsData?.completionData?.length || 0) / totalTasks) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Completed</h3>
          <p className="text-3xl font-bold">{analyticsData?.completionData?.length || 0}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
          <p className="text-3xl font-bold">{completionRate}%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Active Tags</h3>
          <p className="text-3xl font-bold">{analyticsData?.tagData?.length || 0}</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Completion Trend</h2>
          <div className="h-64">
            {completionTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                    formatter={(value) => [value, 'Completions']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#0088FE" 
                    activeDot={{ r: 8 }} 
                    name="Completions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No completion data available yet. Complete some tasks to see trends.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tag Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Tasks by Tag</h2>
          <div className="h-64">
            {tagDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tagDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00C49F" name="Total Tasks" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No tag data available yet. Add tags to your tasks to see distribution.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Tag Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Tag Distribution</h2>
          <div className="h-64">
            {tagPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {tagPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No tag data available yet. Add tags to your tasks to see distribution.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Empty chart placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Task Completion Rate</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">More analytics coming soon!</p>
          </div>
        </div>
      </div>
      
      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recently Completed Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Recently Completed</h2>
          {analyticsData?.completionData && analyticsData.completionData.length > 0 ? (
            analyticsData.completionData.slice(0, 5).map((task) => (
              <div key={task.id} className="py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.completedAt || task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-2">No completed tasks yet</p>
          )}
        </div>
        
        {/* Recent Failed Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Overdue Tasks</h2>
          {analyticsData?.failureData && analyticsData.failureData.length > 0 ? (
            analyticsData.failureData.slice(0, 5).map((task) => (
              <div key={task.id} className="py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-2">No overdue tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}