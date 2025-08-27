import React, { useEffect, useRef, useState } from "react";
import { deleteTask } from "../../../services/taskServices";
import {
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineSelector,
  HiOutlineTrash,
} from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import EditTask from "./EditTask";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = [
  { value: "", label: "All" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const ListTask = (props) => {
  const {
    resultTitle,
    taskData,
    pagination,
    setPagination,
    getAllTaskData,
    loading,
    statusFilter,
    setStatusFilter,
    setSearchText,
    searchText,
  } = props;

  const [selectedTask, setSelectedTask] = useState(null);
  console.log("selectedTask", selectedTask);
  const [showEdit, setShowEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setIsDropdownOpen(false);
  };

  const handleEditClick = (taskId) => {
    setSelectedTask(taskId);
    setShowEdit(true);
  };

  const onDelete = async () => {
    try {
      const resp = await deleteTask(selectedTask?._id);
      if (resp?.data?.success) {
        toast.success(resp?.data?.message || "Task deleted successfully!");
        getAllTaskData();
      } else {
        toast.error(
          resp?.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleteOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="px-4 py-2 rounded-lg font-semibold shadow-md bg-white">
          {resultTitle}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative  rounded-lg font-semibold shadow-md bg-white">
            <HiOutlineSearch className="absolute left-3 top-3 text-lg" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {searchText && (
              <AiOutlineClose
                className={`absolute right-3 top-3 text-lg cursor-pointer`}
                onClick={() => setSearchText("")}
              />
            )}
          </div>

          {/* <div>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full px-2 py-2  border border-gray-300 font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div> */}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="w-[100px] px-4 py-2 border border-gray-300 font-semibold rounded-lg shadow-md bg-white flex items-center justify-between focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {statusFilter
                  ? options.find((opt) => opt.value === statusFilter)?.label
                  : "All"}
              </span>
              <HiOutlineSelector
                className={`ml-2 transform transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                    statusFilter === option.value
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleStatusChange(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-xl">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Sr. No.</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Published Date</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {taskData.length > 0 ? (
                taskData.map((task, index) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {(pagination.currentPage - 1) * pagination.perPage +
                        index +
                        1}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {task.title}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium  text-center
                        ${
                          task.status === "High"
                            ? "bg-red-100 text-red-800"
                            : task.status === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.status || "-"}
                      </span>
                    </td>
                    <td className="border px-4 py-2  text-center">
                      {task.publishedDate
                        ? new Date(task.publishedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2 text-lg">
                        <button
                          className="hover:text-green-500 transition-colors"
                          onClick={() => handleEditClick(task?._id)}
                        >
                          <HiOutlinePencil color="" />
                        </button>
                        <button
                          className="hover:text-red-500 transition-colors"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500 font-bold"
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-8 space-x-2">
        {Array.from(
          { length: Math.ceil(pagination.total / pagination.perPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: i + 1,
                }))
              }
              className={`px-4 py-2 rounded-lg border ${
                pagination.currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg relative animate-fadeIn">
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>

            <EditTask
              taskId={selectedTask}
              onClose={() => setShowEdit(false)}
              getAllTaskData={getAllTaskData}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black/50 `}
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-lg max-w-sm w-full animate-fadeIn`}
          >
            <h2 className="text-lg font-bold mb-4">
              Delete "{selectedTask?.title}" Permanently
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTask;
