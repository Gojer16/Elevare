"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar } from "lucide-react";
import type { Task } from "../../../../types/task";

interface ArchiveExportProps {
  tasks: Task[];
}

export function ArchiveExport({ tasks }: ArchiveExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.isDone).length,
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          completed: task.isDone,
          createdAt: task.createdAt,
          reflection: task.reflection || "",
          tags: task.tags?.map(tag => tag.name) || []
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elevare-archive-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToText = async () => {
    setIsExporting(true);
    try {
      let textContent = `ELEVARE ARCHIVE EXPORT\n`;
      textContent += `Generated: ${new Date().toLocaleDateString()}\n`;
      textContent += `Total Tasks: ${tasks.length}\n`;
      textContent += `Completed: ${tasks.filter(t => t.isDone).length}\n`;
      textContent += `\n${'='.repeat(50)}\n\n`;

      tasks.forEach((task, index) => {
        textContent += `${index + 1}. ${task.title}\n`;
        textContent += `   Status: ${task.isDone ? '✅ Completed' : '🔄 Reset'}\n`;
        textContent += `   Date: ${new Date(task.createdAt).toLocaleDateString()}\n`;
        
        if (task.description) {
          textContent += `   Description: ${task.description}\n`;
        }
        
        if (task.tags && task.tags.length > 0) {
          textContent += `   Tags: ${task.tags.map(tag => `#${tag.name}`).join(', ')}\n`;
        }
        
        if (task.reflection) {
          textContent += `   Reflection: "${task.reflection}"\n`;
        }
        
        textContent += `\n${'-'.repeat(30)}\n\n`;
      });

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elevare-archive-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (tasks.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--color-foreground)]/60">Export:</span>
      
      <motion.button
        onClick={exportToJSON}
        disabled={isExporting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 
                   text-[var(--color-secondary)] rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
      >
        <Calendar className="w-4 h-4" />
        JSON
      </motion.button>

      <motion.button
        onClick={exportToText}
        disabled={isExporting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 
                   text-[var(--color-secondary)] rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        Text
      </motion.button>

      {isExporting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-sm text-[var(--color-foreground)]/60"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Download className="w-4 h-4" />
          </motion.div>
          Exporting...
        </motion.div>
      )}
    </div>
  );
}