import React from "react";

const publicRoute = [
  {
    key: "task",
    path: "/",
    component: React.lazy(() => import("../../views/task")),
    authority: [],
  },
];

export default publicRoute;
