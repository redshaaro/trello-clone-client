import { authAxios } from "../lib/axios"

export const fetchboards = async () => {
  const res = await authAxios.get("/boards");

  // Assume backend returns: { ownedBoards: [...], invitedBoards: [...] }
  return {
    ownedBoards: res.data.ownedBoards || [],
    invitedBoards: res.data.memberBoards || []
  };
};
export const fetchboardname = async (boardid) => {
  try {
    const res = await authAxios.get(`/boards/${boardid}`)
    return res
  } catch (err) {
    console.error(err)
  }

}
// const getBoardname = async () => {
//   try {
//     const res = await authAxios.get(`/boards/${id}`);
//     if (!res.data.board) {
//       console.error("No board returned:", res.data);
//       return;
//     }
//     setBoardName(res.data.board.name);
//   } catch (err) {
//     console.error("Error fetching board:", err);
//   }
// };
export const fetchBoardColumnsWithTasks = async (boardId) => {
  const colRes = await authAxios.get(`/columns/${boardId}`);
  const fetchedColumns = colRes.data.columns;

  const columnsWithTasks = await Promise.all(
    fetchedColumns.map(async (col) => {
      try {
        const taskRes = await authAxios.get(`/tasks/${col.id}`);
        return {
          ...col,
          tasks: taskRes.data.tasks || [],
        };
      } catch (err) {
        // Only log and return empty if it's not a critical error
        // 403 errors should still be reported as they indicate permission issues
        if (err.response?.status === 403) {
          console.error(`Permission denied fetching tasks for column ${col.id}. This may indicate a backend permission issue.`);
        } else {
          console.warn(`Could not fetch tasks for column ${col.id}:`, err.response?.status);
        }
        // Return column with empty tasks array to prevent UI crash
        return {
          ...col,
          tasks: [],
        };
      }
    })
  );

  return columnsWithTasks;
};
export const createBoard = async (name) => {
  try {
    const res = await authAxios.post("/boards/createBoard", { name })
    return res.data.createdboard || [];

  } catch (err) {
    console.error(err)
    return [];


  }

}
export const updateTaskPosition = async ({ taskId, sourceColumnId, targetColumnId, targetPosition }) => {
  try {
    const response = await authAxios.put(`/tasks/moveTask`, {
      taskId,
      sourceColumnId,
      targetColumnId,
      targetPosition,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error in updateTaskPosition:", error?.response?.data || error.message);
    throw error;
  }
};

export const updateColumnPosition = async ({ columnId, sourceIndex, targetIndex }) => {
  try {


    const response = await authAxios.put(`/columns/moveColumn`, {
      columnId,
      sourceIndex,
      targetIndex,
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateColumnPosition:", error?.response?.data || error.message);
    throw error;
  }
};
export const createColumn = async (name, boardId) => {
  try {
    const res = await authAxios.post("/columns", { name, boardId })
    return res

  } catch (err) {
    console.log("Error in creating column " + err)

  }

}
export const createTask = async (taskData) => {
  try {
    const res = await authAxios.post("/tasks", taskData);
    return res.data.createdtask; // Make sure this matches your backend response
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};
export const getTaskById = async (id) => {
  try {
    console.log(id)
    const res = await authAxios.get(`/tasks/gettask/${id}`);
    console.log(res)
    return res
  } catch (err) {
    console.error("Error fetching task", err);
    throw err;
  }
};
export const editTask = async (id, data) => {
  try {
    const res = await authAxios.put(`/tasks/${id}`, data);
    return res;
  } catch (err) {
    console.error("Error updating task", err);
    throw err;
  }
};
export const deleteList = async (id) => {
  try {
    const res = await authAxios.delete(`/columns/${id}`)
    return res

  } catch (err) {
    console.log(err)
    throw err

  }

}
export const deleteTask = async (id) => {
  try {
    const res = await authAxios.delete(`/tasks/${id}`)
    return res

  } catch (err) {
    console.log(err)
    throw err

  }

}
export const deleteBoard = async (id) => {
  try {
    const res = await authAxios.delete(`/boards/${id}`)
    return res

  } catch (err) {
    console.log(err)
    throw err

  }

}
export const inviteToBoard = async (boardId,  invitedEmail, role ) => {
  return authAxios.post(
    `boards/${boardId}/invite`,
    { invitedEmail, role },

  );
};


export const handleInvitation = async (action, token) => {
  try {
    const res = await authAxios.post(`/boards/invitation/${action}?token=${token}`);
    return res.data;
  } catch (err) {
    console.error(`Error handling invitation:`, err?.response?.data || err.message);
    throw err;
  }
};

// Update board name
export const updateBoardName = async (boardId, name) => {
  try {
    const res = await authAxios.put(`/boards/${boardId}`, { name });
    return res.data;
  } catch (err) {
    console.error("Error updating board name:", err);
    throw err;
  }
};

// Get board members
export const getBoardMembers = async (boardId) => {
  try {
    const res = await authAxios.get(`/boards/${boardId}/members`);
    return res.data.members || [];
  } catch (err) {
    console.error(`Error fetching board members:`, err);
    return [];
  }
};

// Remove board member
export const removeBoardMember = async (boardId, memberId) => {
  try {
    const res = await authAxios.delete(`/boards/${boardId}/members/${memberId}`);
    return res.data;
  } catch (err) {
    console.error(`Error removing board member:`, err.response?.data || err.message);
    throw err;
  }
};

// Change member role
export const changeMemberRole = async (boardId, memberId, role) => {
  try {
    const res = await authAxios.put(`/boards/${boardId}/members/${memberId}/role`, { role });
    return res.data;
  } catch (err) {
    console.error(`Error changing member role:`, err.response?.data || err.message);
    throw err;
  }
};

// Leave board
export const leaveBoard = async (boardId) => {
  try {
    const res = await authAxios.post(`/boards/${boardId}/leave`);
    return res.data;
  } catch (err) {
    console.error(`Error leaving board:`, err.response?.data || err.message);
    throw err;
  }
};

// Get pending invitations
export const getPendingInvitations = async () => {
  try {
    const res = await authAxios.get(`/boards/invitations/pending`);
    return res.data.invitations || [];
  } catch (err) {
    console.error("Error fetching pending invitations:", err);
    return [];
  }
};

// Update board background
export const updateBoardBackground = async (boardId, background_url) => {
  try {
    const res = await authAxios.put(`/boards/${boardId}/background`, { background_url });
    return res.data;
  } catch (err) {
    console.error("Error updating board background:", err);
    throw err;
  }
};

// Copy column
export const copyColumn = async (columnId, boardId) => {
  try {
    const res = await authAxios.post(`/columns/${columnId}/copy`, { boardId });
    return res.data;
  } catch (err) {
    console.error("Error copying column:", err);
    throw err;
  }
};

// Rename column
export const renameColumn = async (columnId, name) => {
  try {
    const res = await authAxios.put(`/columns/${columnId}`, { name });
    return res.data;
  } catch (err) {
    console.error("Error renaming column:", err);
    throw err;
  }
};

