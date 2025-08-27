import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "../configs/routes.config";
import PublicRoute from "../route/publicRoute"
const Views = () => {
  return (
    <Suspense
      fallback={
          <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-xl">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<PublicRoute />}>
         {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
             element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Views;
