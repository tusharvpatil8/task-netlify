const task = require("./task.routes");
const common = require("./common.routes");

module.exports = {
  taskAPI: (app) => {
    app.use("/task", task);
  },
  commonRoutes: (app) => {
    app.use("/common", common);
  },
};
