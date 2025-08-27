import api from "./api";

export function addTask(data) {
  return api.post("task/add-task", data);
}

export const editTask = (id, data) => {
  return api.put(`/task/edit-task/${id}`, data);
};
export const getSingleTaskDetail = (id) => {
  return api.get(`/task/get-one-task/${id}`);
};
export const deleteTask = (id) => {
  return api.delete(`/task/delete-task/${id}`);
};
export function getAllTasks(data) {
  return api.post("task/get-all-tasks", data);
}
