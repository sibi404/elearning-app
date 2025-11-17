import { Upload, Clock, CheckCircle, Edit, Download } from "lucide-react";

import { BASE_URL } from "../../../../config";
import formatDate from "../../../../utils/formatDate";

const SubmissionCard = ({ submission, openGradeModal }) => {
    return (
        <div key={submission.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {submission.profile_image ? (
                            <img
                                src={submission.profile_image}
                                alt={submission.student_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {submission.student_name.split(' ').map(n => n[0]).join('')}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                            {submission.student_name}
                        </h3>
                        <p className="text-sm text-slate-500">@{submission.student_email}</p>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-xs text-slate-600">
                                <Upload size={14} className="mr-1" />
                                {submission.file_name}
                            </div>
                            <div className="flex items-center text-xs text-slate-600">
                                <Clock size={14} className="mr-1" />
                                {formatDate(submission.submitted_at)}
                            </div>
                        </div>

                        {submission.is_graded && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle size={16} className="text-green-600" />
                                    <span className="font-semibold text-green-900">
                                        Grade: {submission.grade}
                                    </span>
                                    <span className="text-xs text-green-600">
                                        • Graded on {formatDate(submission.graded_at)}
                                    </span>
                                </div>
                                {submission.feedback && (
                                    <p className="text-sm text-green-800 mt-1">
                                        <strong>Feedback:</strong> {submission.feedback}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {submission.is_graded ? (
                        <>
                            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                                {submission.grade}
                            </div>
                            <button
                                onClick={() => openGradeModal(submission)}
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Grade"
                            >
                                <Edit size={20} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => openGradeModal(submission)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Grade Now
                        </button>
                    )}

                    <a href={`${BASE_URL}/course/assignment/submission/${submission.id}/download/`} download>
                        <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <Download size={20} />
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
};

export default SubmissionCard;