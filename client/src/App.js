import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Views from "../src/views";
import { ToastContainer } from "react-toastify";
import Task from "./views/task";

function App() {
  console.log("App component rendered");
  return (
    <>
      {/* <BrowserRouter>
        <Views />
          <ToastContainer position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            toastClassName="rounded-xl shadow-lg text-sm font-semibold px-4 py-3"
            bodyClassName="flex items-center" />
      </BrowserRouter> */}

      <Routes>
        <Route path="/" element={<Task />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="rounded-xl shadow-lg text-sm font-semibold px-4 py-3"
        bodyClassName="flex items-center"
      />
    </>
  );
}

export default App;
