import { authAxios } from "../lib/axios";

// Task CRUD operations
export const createTask = async (taskData) => {
  try {
    const res = await authAxios.post("/tasks", taskData);
    return res.data.createdtask || res.data;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};

export const getTaskById = async (id) => {
  try {
    const res = await authAxios.get(`/tasks/gettask/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching task:`, err.response?.data || err.message);
    throw err;
  }
};

export const editTask = async (id, data) => {
  try {
    const res = await authAxios.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating task", err);
    throw err;
  }
};

export const deleteTask = async (id) => {
  try {
    const res = await authAxios.delete(`/tasks/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
};

export const updateTaskPosition = async ({ taskId, sourceColumnId, targetColumnId, targetPosition }) => {
  try {
    const response = await authAxios.put(`/tasks/moveTask`, {
      taskId,
      sourceColumnId,
      targetColumnId,
      targetPosition,
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateTaskPosition:", error?.response?.data || error.message);
    throw error;
  }
};

// Task Comments
export const getTaskComments = async (taskId) => {
  try {
    const res = await authAxios.get(`/tasks/${taskId}/comments`);
    return res.data.comments || [];
  } catch (err) {
    console.error(`Error fetching comments:`, err.response?.data || err.message);
    return [];
  }
};

export const addTaskComment = async (taskId, text) => {
  try {
    const res = await authAxios.post(`/tasks/${taskId}/comments`, { text });
    return res.data.comment || res.data;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
};

export const deleteTaskComment = async (taskId, commentId) => {
  try {
    const res = await authAxios.delete(`/tasks/${taskId}/comments/${commentId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting comment:", err);
    throw err;
  }
};

// Task Labels
export const getTaskLabels = async (taskId) => {
  try {
    const res = await authAxios.get(`/tasks/${taskId}/labels`);
    return res.data.labels || [];
  } catch (err) {
    console.error(`Error fetching labels:`, err.response?.data || err.message);
    return [];
  }
};

export const addTaskLabel = async (taskId, labelData) => {
  try {
    const res = await authAxios.post(`/tasks/${taskId}/labels`, labelData);
    return res.data.label || res.data;
  } catch (err) {
    console.error("Error adding label:", err);
    throw err;
  }
};

export const removeTaskLabel = async (taskId, labelId) => {
  try {
    const res = await authAxios.delete(`/tasks/${taskId}/labels/${labelId}`);
    return res.data;
  } catch (err) {
    console.error("Error removing label:", err);
    throw err;
  }
};

// Task Assignees
export const getTaskAssignees = async (taskId) => {
  try {
    const res = await authAxios.get(`/tasks/${taskId}/assignees`);
    return res.data.assignees || [];
  } catch (err) {
    console.error(`Error fetching assignees:`, err.response?.data || err.message);
    return [];
  }
};

export const assignTask = async (taskId, userId) => {
  try {
    const res = await authAxios.post(`/tasks/${taskId}/assignees`, { userId });
    return res.data;
  } catch (err) {
    console.error("Error assigning task:", err);
    throw err;
  }
};

export const unassignTask = async (taskId, userId) => {
  try {
    const res = await authAxios.delete(`/tasks/${taskId}/assignees/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error unassigning task:", err);
    throw err;
  }
};

// Task Attachments
export const getTaskAttachments = async (taskId) => {
  try {
    const res = await authAxios.get(`/tasks/${taskId}/attachments`);
    return res.data.attachments || [];
  } catch (err) {
    console.error("Error fetching attachments:", err);
    return [];
  }
};

export const addTaskAttachment = async (taskId, formData) => {
  try {
    const res = await authAxios.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.attachment || res.data;
  } catch (err) {
    console.error("Error adding attachment:", err);
    throw err;
  }
};

export const deleteTaskAttachment = async (taskId, attachmentId) => {
  try {
    const res = await authAxios.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting attachment:", err);
    throw err;
  }
};

// Task Activity
export const getTaskActivity = async (taskId) => {
  try {
    const res = await authAxios.get(`/tasks/${taskId}/activity`);
    return res.data.activities || [];
  } catch (err) {
    console.error("Error fetching task activity:", err);
    return [];
  }
};

