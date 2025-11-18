import { Video } from "lucide-react";

const LessonForm = ({ lessonData, handleLessonChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Lesson Information</h2>
            </div>

            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Lesson Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={lessonData.title}
                            onChange={(e) => handleLessonChange('title', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                            placeholder="Introduction to React Hooks"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Lesson Order <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={lessonData.order}
                            onChange={(e) => handleLessonChange('order', parseInt(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        YouTube Video ID <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={lessonData.video_id}
                        onChange={(e) => handleLessonChange('video_id', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                        placeholder="dQw4w9WgXcQ"
                        required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Example: For youtube.com/watch?v=dQw4w9WgXcQ, enter "dQw4w9WgXcQ"
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        About This Lesson
                    </label>
                    <textarea
                        value={lessonData.about}
                        onChange={(e) => handleLessonChange('about', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none resize-none"
                        rows="4"
                        placeholder="Describe what students will learn in this lesson..."
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonForm;