import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, FileText, Clock, Download, MoveLeft } from 'lucide-react';

import { usePrivateApi } from '../../../../hooks/usePrivateApi';
import formatDate from '../../../../utils/formatDate';
import { BASE_URL } from '../../../../config';

import GradingModal from './GradingModal';
import SubmissionCard from '../submissionCard/SubmissionCard';

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
                            {/* <span className='hidden sm:block'>Download Assignment</span> */}
                            <a href={`${BASE_URL}/course/assignment/${assignmentData.id}/download/`} download className='hidden sm:block'>Download Assignment</a>
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
                            <SubmissionCard key={submission.id} submission={submission} openGradeModal={openGradeModal} />
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