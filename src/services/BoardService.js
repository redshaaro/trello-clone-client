import { authAxios } from "../lib/axios"
import axios from "axios"
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
    return res

  } catch (err) {
    console.log(err)
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