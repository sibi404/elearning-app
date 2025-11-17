import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Edit, Trash2, Eye, Clock, HelpCircle, FileText, Plus, ChevronDown, ChevronUp } from 'lucide-react';

import { usePrivateApi } from '../../../hooks/usePrivateApi';

const LessonTab = ({ onEdit, onAddNew }) => {

    const { courseSlug } = useParams();

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const api = usePrivateApi();

    // Mock data - Replace with actual API call
    useEffect(() => {
        const getLessons = async () => {
            try {
                const { data } = await api.get(`course/${courseSlug}/lessons/`);
                setLessons(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        getLessons();
    }, [courseSlug]);



    const toggleExpand = (lessonId) => {
        setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
    };


    const onDelete = async (lessonId) => {
        try {
            const { data } = await api.delete(`course/lesson/${lessonId}/delete/`);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const handleDelete = async (lessonId) => {
        if (onDelete) {
            const result = await onDelete(lessonId);
            if (result) {
                setLessons(lessons.filter(l => l.id !== lessonId));
            } else {
                console.log("Failed to delete lesson");
            }
        }
        setDeleteConfirm(null);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getMaterialIcon = (type) => {
        const icons = {
            pdf: '📄',
            doc: '📝',
            ppt: '📊'
        };
        return icons[type] || '📁';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-6 h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Course Lessons</h1>
                        <p className="text-slate-600">{lessons.length} lessons in this course</p>
                    </div>
                    <button
                        onClick={onAddNew}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Lesson
                    </button>
                </div>

                {/* Lessons List */}
                {lessons.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No lessons yet</h3>
                        <p className="text-slate-600 mb-6">Start building your course by adding your first lesson</p>
                        <button
                            onClick={onAddNew}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create First Lesson
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
                            >
                                {/* Lesson Header */}
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Order Badge */}
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#0d2f99] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {lesson.order}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                        {lesson.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                                        <span className="flex items-center gap-1">
                                                            <Play className="w-3 h-3" />
                                                            Video ID: {lesson.video_id}
                                                        </span>
                                                        {lesson.questions.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <HelpCircle className="w-4 h-4" />
                                                                {lesson.questions.length} Quiz {lesson.questions.length === 1 ? 'Question' : 'Questions'}
                                                            </span>
                                                        )}
                                                        {lesson.materials.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <FileText className="w-4 h-4" />
                                                                {lesson.materials.length} {lesson.materials.length === 1 ? 'Material' : 'Materials'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(lesson.id)}
                                                        className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        {expandedLesson === lesson.id ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => window.open(`https://youtube.com/watch?v=${lesson.video_id}`, '_blank')}
                                                        className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                                                        title="Preview Video"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => onEdit && onEdit(lesson)}
                                                        className="p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                                                        title="Edit Lesson"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(lesson.id)}
                                                        className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Lesson"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Description Preview */}
                                            {lesson.about && (
                                                <p className="text-slate-600 text-sm line-clamp-2">
                                                    {lesson.about}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedLesson === lesson.id && (
                                    <div className="border-t border-slate-200 bg-slate-50 p-6">
                                        {/* About Section */}
                                        {lesson.about && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-2">About This Lesson</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{lesson.about}</p>
                                            </div>
                                        )}

                                        {/* Quiz Questions */}
                                        {lesson.questions.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                    <HelpCircle className="w-4 h-4" />
                                                    Quiz Questions ({lesson.questions.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {lesson.questions.map((question, qIndex) => (
                                                        <div
                                                            key={question.id}
                                                            className="bg-white rounded-xl p-4 border border-slate-200"
                                                        >
                                                            <div className="flex items-start gap-3 mb-3">
                                                                <span className="flex-shrink-0 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                                    {formatTime(question.time)}
                                                                </span>
                                                                <p className="font-medium text-slate-800 text-sm">
                                                                    {qIndex + 1}. {question.question_text}
                                                                </p>
                                                            </div>
                                                            <div className="pl-6 space-y-1.5">
                                                                {question.options.map((option, oIndex) => (
                                                                    <div
                                                                        key={option.id}
                                                                        className={`text-sm flex items-center gap-2 p-2 rounded-lg ${option.option_text === question.answer
                                                                            ? 'bg-green-50 text-green-700 font-medium'
                                                                            : 'text-slate-600'
                                                                            }`}
                                                                    >
                                                                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${option.option_text === question.answer
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'bg-slate-200 text-slate-600'
                                                                            }`}>
                                                                            {String.fromCharCode(65 + oIndex)}
                                                                        </span>
                                                                        <span>{option.option_text}</span>
                                                                        {option.option_text === question.answer && (
                                                                            <span className="ml-auto text-xs">✓ Correct</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Materials */}
                                        {lesson.materials.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Learning Materials ({lesson.materials.length})
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {lesson.materials.map((material) => (
                                                        <div
                                                            key={material.id}
                                                            className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
                                                        >
                                                            <span className="text-2xl">{getMaterialIcon(material.material_type)}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-slate-800 text-sm truncate">
                                                                    {material.title}
                                                                </p>
                                                                <p className="text-xs text-slate-500 uppercase">
                                                                    {material.material_type}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty State for Expanded Lesson */}
                                        {lesson.questions.length === 0 && lesson.materials.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-slate-500 text-sm">
                                                    No additional content for this lesson
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Delete Confirmation */}
                                {deleteConfirm === lesson.id && (
                                    <div className="border-t border-slate-200 bg-red-50 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">Delete this lesson?</p>
                                                    <p className="text-sm text-slate-600">This action cannot be undone.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition-all text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lesson.id)}
                                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonTab;