"use client";
import { EnhancedReflectionModal } from "../Reflection/EnhancedReflectionModal";
import EditTaskModal from "../Tasks/EditTaskModal";
import { Task } from "../../hooks/useTask";

interface DashboardModalsProps {
  // Reflection Modal
  isReflectionOpen: boolean;
  onCloseReflection: () => void;
  onSaveReflection: (reflection: string) => Promise<void>;
  isSavingReflection: boolean;
  
  // Edit Modal
  isEditOpen: boolean;
  onCloseEdit: () => void;
  onSaveEdit: (task: Partial<Task>) => Promise<void>;
  task: Task | null;
  isSavingEdit: boolean;
}

export function DashboardModals({
  isReflectionOpen,
  onCloseReflection,
  onSaveReflection,
  isSavingReflection,
  isEditOpen,
  onCloseEdit,
  onSaveEdit,
  task,
  isSavingEdit,
}: DashboardModalsProps) {
  return (
    <>
      <EnhancedReflectionModal
        isOpen={isReflectionOpen}
        onClose={onCloseReflection}
        onSave={onSaveReflection}
        isSaving={isSavingReflection}
        title="How did today's focus go?"
        subtitle="What's one lesson you'll carry into tomorrow?"
        taskTitle={task?.title}
      />

      <EditTaskModal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        onSave={onSaveEdit}
        task={task}
        isSaving={isSavingEdit}
      />
    </>
  );
}