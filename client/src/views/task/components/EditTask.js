import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getSingleTaskDetail, editTask } from "../../../services/taskServices";
import { uploadSingleImage } from "../../../services/commonService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../../../components/formField";
import FileUploadField from "../../../components/fileUploadField";

  const statusOptions = [
    { value: "Low", label: "Low", icon: "🟢" },
    { value: "Medium", label: "Medium", icon: "🟡" },
    { value: "High", label: "High", icon: "🔴" },
  ];
    
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  publishedDate: Yup.date().required("Publish Date is required"),
  image: Yup.string().required("Image is required"),
  status: Yup.string()
    .oneOf(["Low", "Medium", "High"], "Invalid status")
    .required("Status is required"),
});

const EditTask = ({ taskId, onClose, getAllTaskData }) => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    publishedDate: "",
    image: null,
    status: "Low",
  });
  console.log("initialValues", initialValues);
  const [imagePreview, setImagePreview] = useState(null);

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return formData;
  };

  const handleFileChange = (e, setFieldValue, setPreview, fieldName) => {
    const file = e.target.files[0];
    setFieldValue(fieldName, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = (setFieldValue, setPreview, fieldName) => {
    setFieldValue(fieldName, null);
    setPreview(null);
  };

  // ---------- Fetch Task ----------
  const getTaskDetailById = useCallback(async () => {
    try {
      const resp = await getSingleTaskDetail(taskId);
      console.log("resp", resp);
      if (resp?.data?.success) {
        const { title, content, publishedDate, author, image, status } =
          resp.data.data;
        console.log("resp.data", resp.data);
        setInitialValues({
          title: title || "",
          content: content || "",
          status: status || "",

          publishedDate: publishedDate ? publishedDate.split("T")[0] : "",
          author: author || "",
          image: image || null,
        });

        if (image) setImagePreview(image);
      }
    } catch (err) {
      console.error("Error fetching task:", err);
      toast.error("Failed to load task details");
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) getTaskDetailById();
  }, [taskId, getTaskDetailById]);

  // ---------- Submit ----------
  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const [imageResp] = await Promise.all([
        values.image instanceof File
          ? uploadSingleImage(createFormData(values.image))
          : Promise.resolve({ data: values.image }),
      ]);

      const payload = {
        title: values.title,
        content: values.content,
        publishedDate: values.publishedDate,
        image: imageResp?.data,
        status: values.status,
      };

      const resp = await editTask(taskId, payload);
      if (resp?.data?.success) {
        toast.success(resp?.data?.message || "Task updated successfully!");
        getAllTaskData();
        onClose ? onClose() : navigate(-1);
      } else {
        toast.error(resp?.data?.message || "Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, isSubmitting, values, resetForm }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={values.status}
                  onChange={(e) => setFieldValue("status", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <FormField
                  as="textarea"
                  label="Content"
                  name="content"
                  placeholder="Write task content..."
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <FormField
                  label="Publish Date"
                  name="publishedDate"
                  type="date"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <FileUploadField
                  label="Task Image"
                  name="image"
                  preview={imagePreview}
                  currentFile={values.image}
                  onChange={(e) =>
                    handleFileChange(e, setFieldValue, setImagePreview, "image")
                  }
                  onRemove={() =>
                    handleRemoveImage(setFieldValue, setImagePreview, "image")
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setImagePreview(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white transition"
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Task"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTask;
