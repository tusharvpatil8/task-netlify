const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task/task.controller");
const validationSchemas = require("../validation/validation.schemas");
const { ValidateBody } = require("../validation/validation.method");

// -------------------------- Tasks -------------------------- //

router.post(
  "/add-task",
  ValidateBody(validationSchemas.taskSchema),
  taskController.addTask
);

router.put(
  "/edit-task/:id",
  ValidateBody(validationSchemas.taskSchema),
  taskController.editTask
);

router.delete("/delete-task/:id", taskController.deleteTask);

router.get("/get-one-task/:id", taskController.getOneTask);

router.post("/get-all-tasks", taskController.getAllTask);

module.exports = router;
