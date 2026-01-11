import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  Calendar,
  Upload,
  X,
  Paperclip,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router";
import { imageUpload } from "../../utils/imageBB";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const NoticeBoard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const selectedImage = watch("image");

  const mutation = useMutation({
    mutationFn: async newNotice => {
      const res = await axiosInstance.post("/notices", newNotice);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notices"]);
      setIsModalOpen(true);
      
    },
    onError: err => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleAction = async (data, status) => {
    const {
      date,
      empId,
      empName,
      empPosition,
      image,
      noticeBody,
      target,
      title,
      type,
    } = data;

    if (!image || image.length === 0) {
      return toast.error("Please upload an image first");
    }

    const imageFile = image[0];

    try {
      const imageUrl = await imageUpload(imageFile);

      const finalNoticeData = {
        publishDate: date,
        employeeId: empId,
        employeeName: empName,
        employeePosition: empPosition,
        image: imageUrl,
        noticeDescription: noticeBody,
        targetAudience: target,
        noticeTitle: title,
        noticeType: type,
        status: status,
      };
      mutation.mutate(finalNoticeData);
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F95524",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, discard it!",
      cancelButtonText: "No, stay here",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-full px-6 py-2",
        cancelButton: "rounded-full px-6 py-2",
      },
    }).then(result => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };

  return (
    <div className=" w-full pb-10">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
          <ChevronLeft
            size={20}
            className="text-secondary"
          />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-accent">
          Create a Notice
        </h1>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-blue-100/30 border-b border-gray-100">
          <p className="font-bold text-accent">
            Please fill in the details below
          </p>
        </div>

        <form className="p-6 md:p-8 space-y-6">
          {/* Target Department/Individual */}
          <div className="form-control w-full bg-blue-100/30 p-4 rounded-lg">
            <label className="label">
              <span className="label-text font-bold text-accent mb-2">
                <span className="text-error">*</span> Target Department(s) or
                Individual
              </span>
            </label>
            <select
              {...register("target", { required: "Target is required" })}
              className={`select bg-white text-[#0EA5E9] select-bordered w-full focus:border-primary focus:outline-none ${
                errors.target ? "border-error" : ""
              }`}>
              <option value="Individual">Individual</option>
              <option value="All Department">All Department</option>
              <option value="Finance">Finance</option>
            </select>
            {errors.target && (
              <span className="text-error text-xs mt-1">
                {errors.target.message}
              </span>
            )}
          </div>

          {/* Notice Title */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text mb-2 font-bold text-accent">
                <span className="text-error">*</span> Notice Title
              </span>
            </label>
            <input
              type="text"
              placeholder="Write the Title of Notice"
              {...register("title", { required: "Title is required" })}
              className={`input input-bordered w-full focus:border-primary focus:outline-none ${
                errors.title ? "border-error" : ""
              }`}
            />
            {errors.title && (
              <span className="text-error text-xs mt-1">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Select ID, Name, Position (Responsive Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent">
                  <span className="text-error">*</span> Select Employee ID
                </span>
              </label>
              <select
                {...register("empId", { required: "Employee ID is required" })}
                className="select select-bordered w-full focus:border-primary">
                <option value="">Select employee designation</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
                <option value="EMP004">EMP004</option>
                <option value="EMP005">EMP005</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold mb-2 text-accent">
                  <span className="text-error">*</span> Employee Name
                </span>
              </label>
              <input
                type="text"
                {...register("empName", {
                  required: "Employee Name is required",
                })}
                placeholder="Enter employee full name"
                className="input input-bordered w-full focus:border-primary"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent">
                  <span className="text-error">*</span> Position
                </span>
              </label>
              <input
                {...register("empPosition", {
                  required: "Employee Position is required",
                })}
                type="text"
                placeholder="Select employee department"
                className="input input-bordered w-full focus:border-primary"
              />
            </div>
          </div>

          {/* Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent">
                  <span className="text-error">*</span> Notice Type
                </span>
              </label>
              <select
                {...register("type", { required: "Notice Type is required" })}
                className="select select-bordered w-full focus:border-primary">
                <option value="">Select Notice Type</option>
                <option value="warning">Warning / Disciplinary</option>
                <option value="performance">Performance Improvement</option>
                <option value="appreciation">Appreciation/Recognition</option>
                <option value="attendance">Attendance/Leave issue</option>
                <option value="payroll">Payroll/Compensation</option>
                <option value="contract">Contract / Role Update</option>
                <option value="advisory">Advisory / Personal Reminder</option>
              </select>
            </div>

            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent">
                  <span className="text-error">*</span> Publish Date
                </span>
              </label>
              <input
                type="date"
                {...register("date", { required: "Publish Date is required" })}
                className="input input-bordered w-full focus:border-primary"
              />
            </div>
          </div>

          {/* Notice Body */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text mb-2 font-bold text-accent">
                Notice Body
              </span>
            </label>
            <textarea
              placeholder="Write the details about notice"
              className="textarea textarea-bordered h-32 w-full focus:border-primary text-base"
              {...register("noticeBody")}></textarea>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="label-text font-bold text-accent block">
              Upload Attachments (optional)
            </label>
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 flex flex-col items-center justify-center bg-green-50/10 hover:bg-green-50/30 transition-all cursor-pointer relative">
              <Upload
                className="text-success mb-2"
                size={32}
              />
              <p className="text-sm font-medium">
                <span className="text-success underline">Upload</span> nominee
                profile image or drag and drop.
              </p>
              <p className="text-xs text-paragraph mt-1">
                Accepted File Type: jpg, png
              </p>
              <input
                type="file"
                multiple
                {...register("image")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Attached File Preview */}
            {selectedImage && selectedImage.length > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-fit animate-in fade-in duration-300">
                <Paperclip
                  size={16}
                  className="text-gray-500"
                />
                <span className="text-sm text-accent max-w-50 truncate">
                  {selectedImage[0].name}
                </span>
                <button
                  type="button"
                  onClick={() => setValue("image", null)}
                  className="text-error hover:scale-110 transition-transform ml-2">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
            <button
              onClick={handleCancel}
              type="button"
              className="btn btn-outline rounded-[56px] border-gray-300 text-accent px-10 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={handleSubmit(data => handleAction(data, "draft"))}
              className="btn btn-outline rounded-[56px] border-blue-400 text-blue-500 px-10 hover:bg-blue-50">
              {mutation.isPending ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={handleSubmit(data => handleAction(data, "published"))}
              className="btn btn-primary rounded-[56px] px-10 gap-2 shadow-lg shadow-orange-200">
              <Send size={18} />{" "}
              {mutation.isPending ? "Publishing..." : "Publish Notice"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-4xl w-full max-w-lg p-8 md:p-12 shadow-2xl animate-in zoom-in duration-300">
      <div className="flex flex-col items-center text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4">
          Notice Published Successfully
        </h2>
        <p className="text-paragraph text-sm md:text-base mb-8 max-w-sm">
          Your notice has been published and is now visible to all selected departments.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="px-6 py-2.5 border border-blue-400 text-blue-500 rounded-full font-semibold hover:bg-blue-50 transition-all text-sm"
          >
            View Notice
          </button>
          
          <button 
            onClick={() => {
              setIsModalOpen(false);
              reset(); 
            }}
            className="px-6 py-2.5 border border-orange-400 text-orange-500 rounded-full font-semibold hover:bg-orange-50 transition-all text-sm"
          >
            + Create Another
          </button>
          
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default NoticeBoard;
