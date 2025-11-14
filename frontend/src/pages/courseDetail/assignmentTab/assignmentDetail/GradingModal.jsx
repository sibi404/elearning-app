import { Send, Download } from "lucide-react";

import formatDate from "../../../../utils/formatDate";
import { usePrivateApi } from "../../../../hooks/usePrivateApi";

const GradingModal = ({ selectedSubmission, assignmentData, setGradeModalOpen, grade, setGrade, feedback, setFeedback, setSubmissionsData, setAssignmentData }) => {
    const gradeOptions = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

    const api = usePrivateApi();

    const submitGrade = async () => {
        return await api.post(
            `course/submission/${selectedSubmission.id}/grade/`,
            { grade, feedback }
        );
    };


    const handleGradeSubmission = async () => {
        const wasAlreadyGraded = selectedSubmission.is_graded;

        try {
            const { data } = await submitGrade();
            const updatedSubmission = data;

            setSubmissionsData(prev =>
                prev.map(sub =>
                    sub.id === updatedSubmission.id ? updatedSubmission : sub
                )
            );

            // update assignment stats
            setAssignmentData(prev => {
                if (!wasAlreadyGraded) {
                    return {
                        ...prev,
                        graded_count: prev.graded_count + 1,
                        pending_count: prev.pending_count - 1,
                    };
                }
                return prev;
            });

            setGradeModalOpen(false);
            setGrade("");
            setFeedback("");

        } catch (error) {
            console.error("Grade submission failed:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {selectedSubmission.is_graded ? 'Edit Grade' : 'Grade Submission'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {selectedSubmission.student_name} - {assignmentData.title}
                    </p>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Submission Info */}
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Submitted File</p>
                                <p className="text-sm text-slate-600 mt-1">{selectedSubmission.file}</p>
                            </div>
                            <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Submitted on {formatDate(selectedSubmission.submitted_at)}
                        </p>
                    </div>

                    {/* Grade Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Select Grade <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {gradeOptions.map((gradeOption) => (
                                <button
                                    key={gradeOption}
                                    onClick={() => setGrade(gradeOption)}
                                    className={`py-3 px-4 rounded-lg font-semibold text-center transition-all cursor-pointer ${grade === gradeOption
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {gradeOption}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Feedback (Optional)
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide constructive feedback to help the student improve..."
                            rows={5}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                    <button
                        onClick={() => {
                            setGradeModalOpen(false);
                            setGrade('');
                            setFeedback('');
                        }}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGradeSubmission}
                        disabled={!grade}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer ${grade
                            ? 'bg-primary hover:bg-primary-hover hover:shadow'
                            : 'bg-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <Send size={16} />
                        {selectedSubmission.is_graded ? 'Update Grade' : 'Submit Grade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradingModal;