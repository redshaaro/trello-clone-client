import { moveColumn, moveTask, findDraggedTask } from '../utils/DragHandlers';
import { updateTaskPosition, updateColumnPosition } from '../services/BoardService';
import { useState } from 'react';

export const useDragHandlers = (columns, setColumns) => {
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const handleDragStart = ({ active }) => {
    const activeId = String(active.id);
    if (activeId.startsWith('column-')) {
      const column = columns.find(col => `column-${col.id}` === activeId);
      setActiveColumn(column);
    } else {
      const task = findDraggedTask(columns, activeId);
      setActiveTask(task);
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    setActiveColumn(null);
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // 🟥 COLUMN DRAG
    if (activeId.startsWith('column-')) {
      const activeColId = activeId.replace('column-', '');
      const overColId = overId.replace('column-', '');

      const sourceIndex = columns.findIndex(col => String(col.id) === activeColId);
      const targetIndex = columns.findIndex(col => String(col.id) === overColId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      setColumns(moveColumn(columns, activeColId, overColId));

      try {
        await updateColumnPosition({
          columnId: activeColId,
          sourceIndex,
          targetIndex,
        });
      } catch (err) {
        console.error('Failed to update column position:', err);
      }

      return;
    }

    // 🟦 TASK DRAG
    const sourceCol = columns.find(col =>
      col.tasks.some(task => String(task.id) === activeId)
    );

    let targetCol;
    let targetIndex;

    if (String(overId).startsWith('column-')) {
      const columnId = overId.replace('column-', '');
      targetCol = columns.find(col => String(col.id) === columnId);
      targetIndex = targetCol.tasks.length;
    } else {
      targetCol = columns.find(col =>
        col.tasks.some(task => String(task.id) === overId)
      );
      targetIndex = targetCol.tasks.findIndex(task => String(task.id) === overId);
    }

    if (!sourceCol || !targetCol) return;

    setColumns(moveTask(columns, activeId, overId));

    try {
      await updateTaskPosition({
        taskId: activeId,
        sourceColumnId: sourceCol.id,
        targetColumnId: targetCol.id,
        targetPosition: targetIndex,
      });
    } catch (error) {
      console.error('Failed to update task position:', error);
    }
  };

  return {
    activeTask,
    activeColumn,
    handleDragStart,
    handleDragEnd,
  };
};
