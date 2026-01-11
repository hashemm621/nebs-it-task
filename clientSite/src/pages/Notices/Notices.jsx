import React, { useState } from "react";
import {
  Plus,
  FileText,
  RotateCcw,
  RefreshCw,
  Eye,
  Edit3,
  MoreVertical,
  LayoutList,
  Trash2,
  Calendar,
  Search,
  Tag,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";

const NoticeManagement = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const [viewStatus, setViewStatus] = useState("published");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const limit = 10;

  // --- Data Fetching ---
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "notices",
      viewStatus,
      currentPage,
      searchQuery,
      selectedDept,
      selectedStatus,
      selectedDate,
    ],
    queryFn: async () => {
      const statusToFetch = selectedStatus || viewStatus;
      const res = await axiosInstance.get(
        `/notices?status=${statusToFetch}&page=${currentPage}&limit=${limit}&search=${searchQuery}&dept=${selectedDept}&date=${selectedDate}`
      );
      return res.data;
    },
  });

  const notices = data?.notices || [];
  const totalPages = data?.totalPages || 1;
  const activeCount = data?.activeCount || 0;
  const draftCount = data?.draftCount || 0;

  // --- Handlers ---
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Notice will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F95524",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/notices/${id}`);
        refetch();
        Swal.fire("Deleted!", "Notice has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete.", "error");
      }
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await axiosInstance.patch(`/notices/${id}`, { status: newStatus });
      refetch();
      Swal.fire("Success", `Status changed to ${newStatus}`, "success");
    } catch (err) {
      Swal.fire("Error!", "Failed to change status.", "error");
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      noticeTitle: form.title.value,
      noticeType: form.type.value,
      targetAudience: form.dept.value,
      publishDate: form.date.value,
      description: form.description.value,
    };
    try {
      await axiosInstance.put(`/notices/${selectedNotice._id}`, updatedData);
      queryClient.invalidateQueries(["notices"]);
      document.getElementById("edit_modal").close();
      Swal.fire("Updated!", "Notice updated successfully.", "success");
    } catch (err) {
      Swal.fire("Error!", "Update failed.", "error");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("");
    setSelectedStatus("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-2 md:p-6 bg-[#F8FAFC] min-h-screen">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">
            {viewStatus} Notices
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-green-600">
                Active: {activeCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-xs font-bold text-orange-600">
                Draft: {draftCount}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
          <button
            onClick={() => navigate("/notice-board")}
            className="btn btn-sm md:btn-md bg-[#F95524] border-none text-white normal-case shadow-md hover:bg-[#e84a1d] flex">
            <Plus size={18} />{" "}
            <span className="hidden sm:inline">Create Notice</span>
            <span className="sm:hidden">Create</span>
          </button>
          <button
            onClick={() => {
              setViewStatus(prev =>
                prev === "published" ? "draft" : "published"
              );
              setCurrentPage(1);
            }}
            className="btn btn-sm md:btn-md btn-outline border-orange-200 text-orange-500 hover:bg-orange-50 normal-case flex-1">
            {viewStatus === "published" ? (
              <FileText size={18} />
            ) : (
              <LayoutList size={18} />
            )}
            <span className="ml-1">
              {viewStatus === "published"
                ? "All Drafts Notice"
                : "Published Notices"}
            </span>
          </button>
        </div>
      </div>

      {/* --- Filter Bar --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="form-control col-span-2 lg:col-span-1">
            <label className="label py-1 text-[10px] font-bold text-gray-400 uppercase">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input input-bordered input-sm h-10 w-full pl-8 text-sm"
              />
              <Search
                className="absolute left-2.5 top-3 text-gray-400"
                size={14}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label py-1 text-[10px] font-bold text-gray-400 uppercase">
              Dept.
            </label>
            <select
              value={selectedDept}
              onChange={e => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-bordered select-sm h-10 text-sm">
              <option value="">All Departments</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label py-1 text-[10px] font-bold text-gray-400 uppercase">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-bordered select-sm h-10 text-sm">
              <option value="">Status (All)</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label py-1 text-[10px] font-bold text-gray-400 uppercase">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered input-sm h-10 w-full text-sm"
            />
          </div>
          <button
            onClick={resetFilters}
            className="btn btn-ghost btn-sm h-10 text-blue-500 hover:bg-blue-50 normal-case flex items-center justify-center gap-2 col-span-2 lg:col-span-1">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      {isLoading ? (
        <div className="flex justify-center p-20 bg-white rounded-2xl shadow-sm">
          <span className="loading loading-spinner loading-lg text-orange-500"></span>
        </div>
      ) : notices.length > 0 ? (
        <>
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="table w-full">
                <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase">
                  <tr>
                    <th className="w-12">#</th>
                    <th>Title</th>
                    <th>Notice Type</th>
                    <th>Target Audience</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {notices.map((notice, idx) => (
                    <tr
                      key={notice._id}
                      className="hover:bg-gray-50/50">
                      <td>{(currentPage - 1) * limit + idx + 1}</td>
                      <td className="font-semibold max-w-50 truncate">
                        {notice.noticeTitle}
                      </td>
                      <td>{notice.noticeType}</td>
                      <td className="text-blue-500 font-medium">
                        {notice.targetAudience}
                      </td>
                      <td>{notice.publishDate}</td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            notice.status === "published"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-orange-50 text-orange-500 border-orange-100"
                          }`}>
                          {notice.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedNotice(notice);
                              document.getElementById("view_modal").showModal();
                            }}
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg cursor-pointer">
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNotice(notice);
                              document.getElementById("edit_modal").showModal();
                            }}
                            className="p-2 hover:bg-orange-50 text-orange-500 rounded-lg cursor-pointer">
                            <Edit3 size={18} />
                          </button>
                          <div className="dropdown dropdown-left dropdown-end">
                            <label
                              tabIndex={0}
                              className="p-2 cursor-pointer block hover:bg-gray-100 rounded-lg text-gray-400">
                              <MoreVertical size={18} />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-48 border z-50">
                              <li>
                                <button
                                  onClick={() =>
                                    handleChangeStatus(
                                      notice._id,
                                      notice.status
                                    )
                                  }>
                                  <RefreshCw
                                    size={14}
                                    className="text-blue-500"
                                  />{" "}
                                  Toggle Status
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleDelete(notice._id)}
                                  className="text-red-500">
                                  <Trash2 size={14} /> Delete Notice
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Hybrid) */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {notices.map((notice, idx) => (
                <div
                  key={notice._id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      #{(currentPage - 1) * limit + idx + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        notice.status === "published"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-orange-50 text-orange-500 border-orange-100"
                      }`}>
                      {notice.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 leading-snug">
                    {notice.noticeTitle}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 mt-3 text-xs">
                    <div>
                      <p className="text-gray-400 mb-0.5">Type</p>
                      <p className="font-medium">{notice.noticeType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Audience</p>
                      <p className="font-medium text-blue-500">
                        {notice.targetAudience}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 mb-0.5">Published Date</p>
                      <p className="font-medium">{notice.publishDate}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-around">
                    <button
                      onClick={() => {
                        setSelectedNotice(notice);
                        document.getElementById("view_modal").showModal();
                      }}
                      className="flex items-center gap-1.5 text-blue-500 font-bold text-xs cursor-pointer">
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNotice(notice);
                        document.getElementById("edit_modal").showModal();
                      }}
                      className="flex items-center gap-1.5 text-orange-500 font-bold text-xs cursor-pointer">
                      <Edit3 size={16} /> Edit
                    </button>

                    <button
                      onClick={() =>
                        handleChangeStatus(notice._id, notice.status)
                      }
                      className="flex flex-col items-center gap-1 text-indigo-500 font-bold text-[10px]">
                      <RefreshCw size={16} /> Status
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="flex items-center gap-1.5 text-red-500 font-bold text-xs cursor-pointer">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Pagination Section --- */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-10">
            <span className="text-xs font-semibold text-gray-400 order-2 sm:order-1">
              Showing Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="btn btn-xs sm:btn-sm btn-outline border-gray-200 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-50">
                Prev
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-[#F95524] text-white shadow-md scale-110"
                        : "bg-white border text-gray-600 hover:border-orange-300"
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="btn btn-xs sm:btn-sm btn-outline border-gray-200 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400">No notices found.</p>
        </div>
      )}

      {/* --- View Modal --- */}
      <dialog
        id="view_modal"
        className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl p-0  rounded-t-3xl sm:rounded-2xl shadow-2xl bg-white border-none">
          {selectedNotice && (
            <>
              {/* Header Image Section */}
              <div className="relative group">
                <img
                  src={
                    selectedNotice.image ||
                    "https://via.placeholder.com/800x400?text=No+Image+Available"
                  }
                  className="w-full h-56 md:h-80 object-cover shadow-inner"
                  alt="Notice Header"
                />
                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                <form method="dialog">
                  <button className="btn btn-sm btn-circle absolute right-4 top-4 bg-black/30 text-white border-none hover:bg-red-500 transition-all">
                    ✕
                  </button>
                </form>

                {/* Floating Badge on Image */}
                <div className="absolute bottom-4 left-6 flex gap-2">
                  <span className="px-3 py-1 bg-[#F95524] text-white text-[10px] font-bold uppercase rounded-md shadow-lg flex items-center gap-1">
                    <Tag size={12} /> {selectedNotice.noticeType}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-10">
                {/* Metadata Row */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 border-b pb-4 border-dashed border-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={16}
                      className="text-[#F95524]"
                    />
                    <span className="text-sm font-semibold text-slate-500">
                      {selectedNotice.publishDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-blue-500"
                    />
                    <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase">
                      Target: {selectedNotice.targetAudience}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 leading-tight">
                  {selectedNotice.noticeTitle}
                </h2>

                {/* Notice Body */}
                <div className="prose prose-slate max-w-none">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap min-h-30 shadow-inner">
                    {selectedNotice.noticeDescription}
                  </div>
                </div>

                {/* Footer/Issuer Info */}
                <div className="mt-10 flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#F95524] font-bold text-lg shadow-sm border border-orange-100">
                      {selectedNotice.employeeName?.charAt(0) || "E"}
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[2px] mb-0.5">
                        Official Issuer
                      </p>
                      <h4 className="text-sm font-bold text-slate-800 leading-none">
                        {selectedNotice.employeeName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {selectedNotice.employeePosition}{" "}
                        <span className="text-slate-300 mx-1">|</span> ID:{" "}
                        {selectedNotice.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        selectedNotice.status === "published"
                          ? "border-green-200 text-green-600 bg-green-50"
                          : "border-orange-200 text-orange-600 bg-orange-50"
                      }`}>
                      {selectedNotice.status}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-slate-900/80 backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>

      {/* --- Edit Modal --- */}
      <dialog
        id="edit_modal"
        className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl rounded-t-3xl sm:rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">
              Update Notice Information
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          {selectedNotice && (
            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                  Notice Title
                </label>
                <input
                  name="title"
                  defaultValue={selectedNotice.noticeTitle}
                  className="input input-bordered w-full mt-1 text-sm focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                  Notice Type
                </label>
                <input
                  name="type"
                  defaultValue={selectedNotice.noticeType}
                  className="input input-bordered w-full mt-1 text-sm focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                  Publish Date
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={selectedNotice.publishDate}
                  className="input input-bordered w-full mt-1 text-sm focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                  Audience
                </label>
                <select
                  name="dept"
                  defaultValue={selectedNotice.targetAudience}
                  className="select select-bordered w-full mt-1 text-sm focus:border-orange-500">
                  <option value="All Department">All Department</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                  Full Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedNotice.noticeDescription}
                  className="textarea textarea-bordered w-full mt-1 h-32 text-sm focus:border-orange-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  className="btn bg-[#F95524] border-none text-white hover:bg-[#e84a1d] order-1 sm:order-2 flex-2 shadow-lg shadow-orange-200">
                  Save Updates
                </button>

                <button
                  type="button"
                  onClick={() => document.getElementById("edit_modal").close()}
                  className="btn btn-outline w-full border-slate-200 flex-1 order-2 sm:order-1">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <form
          method="dialog"
          className="modal-backdrop bg-slate-900/40">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default NoticeManagement;
