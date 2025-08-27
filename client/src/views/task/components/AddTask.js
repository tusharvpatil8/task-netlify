import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { uploadSingleImage } from "../../../services/commonService";
import { addTask } from "../../../services/taskServices";
import FormField from "../../../components/formField";
import FileUploadField from "../../../components/fileUploadField";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  publishedDate: Yup.date().required("Publish Date is required"),
  image: Yup.mixed().required("Image is required"),
  status: Yup.string()
    .oneOf(["Low", "Medium", "High"], "Invalid status")
    .required("Status is required"),
});

const initialValues = {
  title: "",
  content: "",
  publishedDate: "",
  image: null,
  status: "",
};

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

const AddTask = (props) => {
  const { onClose, getAllTaskData } = props;
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const onSave = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const [imageResp] = await Promise.all([
        uploadSingleImage(createFormData(values.image)),
      ]);
      console.log("imageResp", imageResp);

      const payload = {
        title: values.title,
        status: values.status,
        publishedDate: values.publishedDate,
        content: values.content,
        image: imageResp?.data,
      };

      const resp = await addTask(payload);

      if (resp?.data?.success) {
        toast.success(resp?.data?.message || "Task created successfully!");
        resetForm();
        setImagePreview(null);
        getAllTaskData();
        onClose ? onClose() : navigate(-1);
      } else {
        toast.error(resp?.data?.message || "Failed to add task");
      }
    } catch (err) {
      console.error("Error while saving task:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        {({ setFieldValue, isSubmitting, values, resetForm }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="">
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
                
                  <option value="" disabled>
                    Select status
                  </option>
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
                {isSubmitting ? "Saving..." : "Add Task"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTask;
