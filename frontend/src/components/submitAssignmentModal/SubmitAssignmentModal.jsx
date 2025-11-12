import { useRef, useState } from 'react';
import { Upload, Calendar, X } from 'lucide-react';

import { usePrivateApi } from '../../hooks/usePrivateApi';

const SubmitAssignmentModal = ({ onClose }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);

    const api = usePrivateApi();
    const modalRef = useRef();

    const closeModal = (e) => {
        if (e.type !== "click") return;
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // const submitAssignment = async () => {
    //     try {
    //         const response = api.post('course/submit-assignment/')
    //     }
    // }

    const handleSubmit = () => {
        const formData = new formData();
        formData.append("file", file);

        console.log(file);
    }

    return (
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 w-full min-h-screen bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Assignment Details</h2>
                        <p className="text-sm text-slate-500 mt-1">React optimization with hooks</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                        onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Optimize a React application using memo, useMemo, and useCallback hooks to improve performance.
                            Identify unnecessary re-renders and apply appropriate memoization techniques to enhance the application's efficiency.
                        </p>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Calendar size={20} className="text-slate-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Due Date</p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">January 20, 2026</p>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Upload File
                        </label>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging
                                ? 'border-blue-400 bg-blue-50'
                                : file
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                                }`}
                        >
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="file-upload"
                            />

                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center py-10 cursor-pointer"
                            >
                                <div className={`p-3 rounded-full mb-3 ${file ? 'bg-green-100' : 'bg-slate-100'
                                    }`}>
                                    <Upload size={24} className={file ? 'text-green-600' : 'text-slate-400'} />
                                </div>

                                {file ? (
                                    <>
                                        <p className="text-sm font-medium text-green-700">{file.name}</p>
                                        <p className="text-xs text-green-600 mt-1">File uploaded successfully</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-slate-700">
                                            Drop your file here or <span className="text-primary">browse</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Supports: PDF, DOC, DOCX, ZIP
                                        </p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                    <button className="cursor-pointer px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={onClose}>
                        Cancel
                    </button>
                    <button className="px-5 py-2.5 text-sm font-medium text-white bg-primary cursor-pointer rounded-lg shadow-sm hover:shadow transition-all"
                        onClick={handleSubmit}>
                        Submit Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitAssignmentModal;