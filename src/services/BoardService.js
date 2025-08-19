import { authAxios } from "../lib/axios"

export const fetchboards = async () => {
  try {
    const res = await authAxios.get("/boards")
    return res.data.boards


  } catch (err) {
    console.log(err)
  }
}
export const fetchboardname = async (boardid) => {
  try {
    const res = await authAxios.get(`/boards/${boardid}`)
    return res
  } catch (err) {
    console.log(err)
  }

}
export const fetchBoardColumnsWithTasks = async (boardId) => {

  const colRes = await authAxios.get(`/columns/${boardId}`);
  const fetchedColumns = colRes.data.columns;


  const columnsWithTasks = await Promise.all(
    fetchedColumns.map(async (col) => {
      const taskRes = await authAxios.get(`/tasks/${col.id}`);
      return {
        ...col,
        tasks: taskRes.data.tasks || [],
      };
    })
  );

  return columnsWithTasks;
};
export const createBoard = async (name) => {
  try {
    const res = await authAxios.post("/boards", { name })


    return res.data.createdboard || [];

  } catch (err) {
    console.log(err)
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
   const res= await authAxios.delete(`/columns/${id}`)
   return res

  } catch (err) {
    console.log(err)
    throw err

  }

}
export const deleteTask = async (id) => {
  try {
   const res= await authAxios.delete(`/tasks/${id}`)
   return res

  } catch (err) {
    console.log(err)
    throw err

  }

}
export const deleteBoard = async (id) => {
  try {
   const res= await authAxios.delete(`/boards/${id}`)
   return res

  } catch (err) {
    console.log(err)
    throw err

  }

}



