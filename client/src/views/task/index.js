import React, { useState } from "react";
import { HiPlusCircle, HiX } from "react-icons/hi";
import ListTask from "./components/ListTask";
import AddTask from "./components/AddTask";
import { getAllTasks } from "../../services/taskServices";
import { useEffect } from "react";

const PAGESIZE = 5;

const Task = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultTitle, setResultTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: PAGESIZE,
  });

  const getAllTaskData = async () => {
    setLoading(true);
    try {
      const payload = {
        perPage: pagination.perPage,
        pageNo: pagination.currentPage,
        status: statusFilter || undefined,
        search: searchText,
      };
      const resp = await getAllTasks(payload);

      if (resp?.data?.success) {
        setTaskData(resp?.data?.data || []);
        setPagination((prev) => ({
          ...prev,
          total: resp?.data?.pagination?.count || 0,
        }));
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTaskData();
  }, [pagination.currentPage, statusFilter, searchText]);

  useEffect(() => {
    if (!pagination?.total) {
      setResultTitle("Result 0 - 0 of 0");
      return;
    }

    const start = (pagination.currentPage - 1) * pagination.perPage + 1;
    const end = start + taskData.length - 1;
    const total = pagination.total;

    setResultTitle(
      `Result ${pagination.currentPage} - ${taskData.length} of ${total}`
    );
  }, [pagination, taskData]);

  return (
    <div className="container py-4">
      <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            Task
          </h2>

          {!showAddTask && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500  text-white px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              <HiPlusCircle className="text-lg" />
              Create Task
            </button>
          )}
        </div>
      </div>

      <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        <ListTask
          resultTitle={resultTitle}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          taskData={taskData}
          pagination={pagination}
          setPagination={setPagination}
          getAllTaskData={getAllTaskData}
          loading={loading}
          setSearchText={setSearchText}
          searchText={searchText}
        />
      </div>

      {showAddTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowAddTask(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <HiX className="text-xl" />
            </button>

            <h1 className="text-lg font-bold text-gray-800 mb-4">Add Task</h1>

            <AddTask
              onClose={() => setShowAddTask(false)}
              getAllTaskData={getAllTaskData}
            />
          </div>
        </div>
      )}

      {/* without Popup Modal */}
      {/* <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        {showAddTask ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowAddTask(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
              >
                <HiArrowLeft className="text-lg" />
              
              </button>
              <h1 className="text-lg font-bold text-gray-800">Add Task</h1>
            </div>
            <AddTask onClose={() => setShowAddTask(false)} />
          </>
        ) : (
          <ListTask />
        )}
      </div> */}
    </div>
  );
};

export default Task;
