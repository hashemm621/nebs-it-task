import React from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, Calendar, Upload, X, Paperclip, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { imageUpload } from "../../utils/imageBB";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';

const NoticeBoard = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

    const selectedImage = watch("image");

  const onSubmit = async(data) => {

    const {date,empId,empName,empPosition,image,noticeBody,target,title,type} = data;
    console.log({date,empId,empName,empPosition,image,noticeBody,target,title,type});

    if (!image || image.length === 0) {
      return toast.error("Please upload an image first");
    }

    const imageFile = image[0];

    try{
        const imageUrl = await imageUpload(imageFile);
        console.log("uploaded imageUrl",imageUrl);


        toast.success("Notice Published Successfully!");
    reset();
    }catch(err){
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
      popup: 'rounded-2xl', 
      confirmButton: 'rounded-full px-6 py-2',
      cancelButton: 'rounded-full px-6 py-2'
    }
  }).then((result) => {
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
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
        >
          <ChevronLeft size={20} className="text-secondary" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-accent">Create a Notice</h1>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-blue-100/30 border-b border-gray-100">
          <p className="font-bold text-accent">Please fill in the details below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          
          {/* Target Department/Individual */}
          <div className="form-control w-full bg-blue-100/30 p-4 rounded-lg">
            <label className="label">
              <span className="label-text font-bold text-accent mb-2">
                <span className="text-error">*</span> Target Department(s) or Individual
              </span>
            </label>
            <select 
              {...register("target", { required: "Target is required" })}
              className={`select bg-white text-[#0EA5E9] select-bordered w-full focus:border-primary focus:outline-none ${errors.target ? 'border-error' : ''}`}
            >
              <option value="Individual">Individual</option>
              <option value="All Department">All Department</option>
              <option value="Finance">Finance</option>
            </select>
            {errors.target && <span className="text-error text-xs mt-1">{errors.target.message}</span>}
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
              className={`input input-bordered w-full focus:border-primary focus:outline-none ${errors.title ? 'border-error' : ''}`}
            />
            {errors.title && <span className="text-error text-xs mt-1">{errors.title.message}</span>}
          </div>

          {/* Select ID, Name, Position (Responsive Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent"><span className="text-error">*</span> Select Employee ID</span>
              </label>
              <select {...register("empId",{required:'Employee ID is required'})} className="select select-bordered w-full focus:border-primary">
                <option value="">Select employee designation</option>
                <option value="EMP001">EMP001</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold mb-2 text-accent"><span className="text-error">*</span> Employee Name</span>
              </label>
              <input type="text" {...register("empName",{required:'Employee Name is required'})} placeholder="Enter employee full name" className="input input-bordered w-full focus:border-primary" />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent"><span className="text-error">*</span> Position</span>
              </label>
              <input {...register("empPosition",{required:'Employee Position is required'})} type="text" placeholder="Select employee department" className="input input-bordered w-full focus:border-primary" />
            </div>
          </div>

          {/* Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text mb-2 font-bold text-accent"><span className="text-error">*</span> Notice Type</span>
              </label>
              <select {...register("type", { required: "Notice Type is required" })} className="select select-bordered w-full focus:border-primary">
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
                <span className="label-text mb-2 font-bold text-accent"><span className="text-error">*</span> Publish Date</span>
              </label>
              <input type="date" {...register("date",{required:'Publish Date is required'})} className="input input-bordered w-full focus:border-primary" />
            </div>
          </div>

          {/* Notice Body */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text mb-2 font-bold text-accent">Notice Body</span>
            </label>
            <textarea 
              placeholder="Write the details about notice"
              className="textarea textarea-bordered h-32 w-full focus:border-primary text-base"
              {...register("noticeBody")}
            ></textarea>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="label-text font-bold text-accent block">Upload Attachments (optional)</label>
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 flex flex-col items-center justify-center bg-green-50/10 hover:bg-green-50/30 transition-all cursor-pointer relative">
              <Upload className="text-success mb-2" size={32} />
              <p className="text-sm font-medium"><span className="text-success underline">Upload</span> nominee profile image or drag and drop.</p>
              <p className="text-xs text-paragraph mt-1">Accepted File Type: jpg, png</p>
              <input type="file" multiple {...register("image")} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* Attached File Preview */}
            {selectedImage && selectedImage.length > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-fit animate-in fade-in duration-300">
                <Paperclip size={16} className="text-gray-500" />
                <span className="text-sm text-accent max-w-50 truncate">
                  {selectedImage[0].name}
                </span>
                <button 
                  type="button"
                  onClick={() => setValue("image", null)} 
                  className="text-error hover:scale-110 transition-transform ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
            <button onClick={handleCancel} type="button" className="btn btn-outline rounded-[56px] border-gray-300 text-accent px-10 hover:bg-gray-50">Cancel</button>
            <button type="button" className="btn btn-outline rounded-[56px] border-blue-400 text-blue-500 px-10 hover:bg-blue-50">Save as Draft</button>
            <button type="submit" className="btn btn-primary rounded-[56px] px-10 gap-2 shadow-lg shadow-orange-200">
              <Send size={18} /> Publish Notice
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoticeBoard;