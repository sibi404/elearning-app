import { useEffect, useState, useRef } from 'react';
import { FileText, Upload, MoveLeft, X, AlertCircle, Check, Trash2, BookOpen } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Toast } from "primereact/toast";

import { usePrivateApi } from '../../../../hooks/usePrivateApi';
import { showNetworkError, showSuccess, showError } from '../../../../utils/toast/toastFunctions';

const AddAssignment = () => {
    const api = usePrivateApi();
    const { courseId } = useOutletContext();
    const toast = useRef();

    const [assignmentData, setAssignmentData] = useState({
        lesson: '',
        title: '',
        description: '',
        file: null,
        due_date: ''
    });


    const [assignmentError, setAssignmentError] = useState('');
    const [lessons, setLessons] = useState();
    const [fileName, setFileName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    const navigate = useNavigate();


    const resetForm = () => {
        setAssignmentData({
            lesson: '',
            title: '',
            description: '',
            file: null,
            due_date: ''
        });
        setFileName('');
        setAssignmentError('');
    };


    const handleInputChange = (field, value) => {
        setAssignmentData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (assignmentError) setAssignmentError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setAssignmentError('File size must be less than 10MB');
                return;
            }

            setAssignmentData(prev => ({ ...prev, file }));
            setFileName(file.name);
            setAssignmentError('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setAssignmentError('File size must be less than 10MB');
                return;
            }

            setAssignmentData(prev => ({ ...prev, file }));
            setFileName(file.name);
            setAssignmentError('');
        }
    };

    const removeFile = () => {
        setAssignmentData(prev => ({ ...prev, file: null }));
        setFileName('');
    };


    const handleSubmit = async () => {
        // Clear previous errors
        setAssignmentError('');

        if (!assignmentData.lesson) {
            setAssignmentError('Please select a lesson for this assignment');
            return;
        }

        // Validation
        if (!assignmentData.title.trim()) {
            setAssignmentError('Assignment title is required');
            return;
        }

        if (assignmentData.title.length < 3) {
            setAssignmentError('Assignment title must be at least 3 characters long');
            return;
        }

        // Validate due date is in the future
        if (assignmentData.due_date) {
            const dueDate = new Date(assignmentData.due_date);
            const now = new Date();
            if (dueDate < now) {
                setAssignmentError('Due date must be in the future');
                return;
            }
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('lesson', assignmentData.lesson);
        formData.append('title', assignmentData.title);
        formData.append('description', assignmentData.description);
        if (assignmentData.file) {
            formData.append('file', assignmentData.file);
        }
        if (assignmentData.due_date) {
            formData.append('due_date', assignmentData.due_date);
        }

        try {
            const response = await api.post('course/assignment/create/', formData, {
                headers: {
                    'Content-Type': 'Multipart/form-data',
                }
            });
            showSuccess(toast, "Assignment added");
            resetForm();
        } catch (err) {
            console.log(err);
            if (err.request && !err.response) {
                showNetworkError(toast);
            } else {
                showError(toast)
            }

        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            txt: '📃',
            zip: '📦',
            rar: '📦',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
            ppt: '📊',
            pptx: '📊',
            xls: '📈',
            xlsx: '📈'
        };
        return icons[extension] || '📁';
    };

    const getLessons = async () => {
        try {
            const { data } = await api.get(`course/get-lessons/${courseId}`, {
                params: {
                    fields: ['id', 'title']
                }
            })
            setLessons(data);
        } catch (err) {
            console.log(err);
            if (err.request && !err.response) {
                showNetworkError(toast);
            } else {
                showError(toast);
            }
        }
    };

    useEffect(() => {
        getLessons();
    }, [courseId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <Toast ref={toast} />
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="md:text-2xl font-bold  mb-2">Create Assignment</h1>
                        <p className="text-faded-text   ">Add assignment details and attach required files</p>
                    </div>
                    <p className='text-sm mb-4 flex items-center gap-1 cursor-pointer' onClick={() => navigate(-1)}>
                        <MoveLeft size={15} />
                        Back to assignments
                    </p>
                </div>

                {/* Global Error Message */}
                {assignmentError && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 shadow-md">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-red-800 font-semibold mb-1">Error</p>
                            <p className="text-red-700 text-sm">{assignmentError}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAssignmentError('')}
                            className="text-red-400 hover:text-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Assignment Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#0A2472] flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-800">Assignment Information</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Select Lesson <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={assignmentData.lesson}
                                        onChange={(e) => handleInputChange('lesson', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
                                        required
                                    >
                                        <option value="">Choose a lesson...</option>
                                        {lessons && lessons.length > 0 ? (
                                            lessons.map((lesson) => (
                                                <option key={lesson.id} value={lesson.id}>
                                                    Lesson {lesson.order}: {lesson.title}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No lessons available</option>
                                        )}
                                    </select>
                                    <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    This assignment will be linked to the selected lesson
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Assignment Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={assignmentData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                                    placeholder="React Component Design Assignment"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={assignmentData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none resize-none"
                                    rows="6"
                                    placeholder="Describe the assignment objectives, requirements, and grading criteria..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Due Date and Time (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={assignmentData.due_date}
                                        onChange={(e) => handleInputChange('due_date', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Students must submit before this date and time
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* File Upload Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#0A2472] flex items-center justify-center">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800">Assignment File</h2>
                                <p className="text-sm text-slate-600">Optional: Upload instructions or resources (Max 10MB)</p>
                            </div>
                        </div>

                        {!assignmentData.file ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragOver
                                    ? 'border-[#0A2472] bg-blue-50'
                                    : 'border-slate-300 hover:border-[#0A2472] hover:bg-slate-50'
                                    }`}
                            >
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-700 font-medium mb-2">
                                    Drag and drop your file here, or click to browse
                                </p>
                                <p className="text-sm text-slate-500 mb-4">
                                    PDF, DOC, DOCX, TXT, ZIP, RAR (Max 10MB)
                                </p>
                                <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A2472] text-white rounded-xl hover:bg-[#0A2472]/90 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium">
                                    <Upload className="w-5 h-5" />
                                    Choose File
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png,.ppt,.pptx,.xls,.xlsx"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                        {getFileIcon(fileName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 truncate">{fileName}</p>
                                                <p className="text-sm text-slate-600">
                                                    {formatFileSize(assignmentData.file.size)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                                                    <Check className="w-3 h-3" />
                                                    Uploaded
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                                                    title="Remove file"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full bg-green-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            type="button"
                            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-8 py-3 rounded-xl bg-[#0A2472] text-white hover:bg-[#0A2472]/90 transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                            Create Assignment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAssignment;