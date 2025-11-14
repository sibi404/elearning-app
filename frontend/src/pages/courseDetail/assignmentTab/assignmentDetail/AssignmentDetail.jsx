import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, FileText, Upload, Clock, CheckCircle, Edit, Download, MoveLeft } from 'lucide-react';

import { usePrivateApi } from '../../../../hooks/usePrivateApi';
import formatDate from '../../../../utils/formatDate';

import GradingModal from './GradingModal';

const AssignmentDetail = () => {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeModalOpen, setGradeModalOpen] = useState(false);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submissionsData, setSubmissionsData] = useState([]);

    const navigate = useNavigate();
    const api = usePrivateApi();
    const location = useLocation();
    const [assignmentData, setAssignmentData] = useState(location.state?.assignment);

    const openGradeModal = (submission) => {
        setSelectedSubmission(submission);
        setGrade(submission.grade || '');
        setFeedback(submission.feedback || '');
        setGradeModalOpen(true);
    };

    useEffect(() => {
        const getAssignmentSubmissions = async () => {
            try {
                const { data } = await api.get(`course/${assignmentData.slug}/submissions/`);
                setSubmissionsData(data);
            } catch (err) {
                console.log(err);
            }
        };

        getAssignmentSubmissions();
    }, []);

    useEffect(() => {
        setAssignmentData(location.state?.assignment);
    }, [location.state]);


    return (
        <div className="min-h-screen bg-slate-50 ">
            <div className="w-full mx-auto">
                <p className='text-sm mb-4 flex items-center gap-1 cursor-pointer' onClick={() => navigate(-1)}>
                    <MoveLeft size={15} />
                    Back to assignments</p>
                {/* Assignment Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-4">
                        <button className="flex md:order-2 self-end md:self-auto mb-3 md:mb-0 items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                            <Download size={16} />
                            <span className='hidden sm:block'>Download Assignment</span>
                        </button>

                        <div className="flex-1">
                            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                                {assignmentData.title}
                            </h1>
                            <p className="text-slate-600 mb-4 text-sm sm:text-base">{assignmentData.description}</p>

                            <div className="flex flex-wrap gap-1 sm:gap-4">
                                <div className="flex items-center text-xs sm:text-sm text-slate-600">
                                    <FileText size={16} className="mr-2" />
                                    {assignmentData.lesson}
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-slate-600">
                                    <Calendar size={16} className="mr-2" />
                                    Due: {formatDate(assignmentData.due_date)}
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-slate-600">
                                    <Clock size={16} className="mr-2" />
                                    Created: {formatDate(assignmentData.created_at)}
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-slate-900">
                                {assignmentData.total_submissions}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600">Total Submissions</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {assignmentData.graded_count}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600">Graded</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {assignmentData.pending_count}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600">Pending Review</div>
                        </div>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Student Submissions</h2>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {submissionsData.map((submission) => (
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

                                        <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grading Modal */}
            {gradeModalOpen && selectedSubmission && (
                <GradingModal
                    selectedSubmission={selectedSubmission}
                    assignmentData={assignmentData}
                    setGradeModalOpen={setGradeModalOpen}
                    grade={grade}
                    setGrade={setGrade}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    setSubmissionsData={setSubmissionsData}
                    setAssignmentData={setAssignmentData}
                />
            )}
        </div>
    );
};


export default AssignmentDetail;