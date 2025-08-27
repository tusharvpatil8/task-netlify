const taskServices = require("../../services/task.services");

module.exports = {
  addTask: async (req, res, next) => {
    try {
      let taskData = req.body;
      console.log("taskData", taskData);

      const createdTask = await taskServices.addTask(taskData);
      if (!createdTask) {
        return next(createError.InternalServerError("Error creating Task."));
      }
      return res.status(200).send({
        success: true,
        message: "Task added successfully.",
        data: createdTask,
      });
    } catch (err) {
      next(err);
    }
  },

  editTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const newData = req.body;
      const updatedTask = await taskServices.editTask(taskId, newData);
      return res.status(200).send({
        success: true,
        message: "Task updated successfully.",
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      console.log("taskId", taskId);
      await taskServices.deleteTask(taskId);
      return res.status(200).send({
        success: true,
        message: "Task deleted successfully.",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  },

  getOneTask: async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const task = await taskServices.getOneTask(taskId);
      if (!task) {
        return next(createError.NotFound("Task not found."));
      }
      return res.status(200).send({
        success: true,
        message: "Task retrieved successfully.",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllTask: async (req, res, next) => {
    try {
      const { pageNo = 1, perPage = 10 } = req.body;
      const status = req.body.status;
      const search = req?.body?.search;

      const { taskList, count } = await taskServices.getAllTask(
        search,
        status,
        parseInt(pageNo),
        parseInt(perPage)
      );

      res.status(200).send({
        success: true,
        message: "Task retrieved successfully.",
        data: taskList,
        pagination: {
          count,
          perPage,
          pageNo,
          totalPages: Math.ceil(count / perPage),
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
