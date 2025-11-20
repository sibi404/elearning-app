import { useRef, useState } from 'react';
import { Plus, Trash2, HelpCircle, CheckCircle, MoveLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from "primereact/toast";

import { usePrivateApi } from '../../../../hooks/usePrivateApi';
import { showNetworkError, showSuccess } from '../../../../utils/toast/toastFunctions';
import LessonForm from './LessonForm';
import ErrorAlert from './ErrorAlert';
import QuestionForm from './QuestionForm';

const AddLesson = () => {
    const [lessonData, setLessonData] = useState({
        title: '',
        video_id: '',
        order: 1,
        about: '',
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        timestamp: '',
        question_text: '',
        options: [
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false }
        ]
    });

    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
    const [lessonError, setLessonError] = useState('');
    const [questionError, setQuestionError] = useState('');

    const navigate = useNavigate();
    const api = usePrivateApi();
    const toast = useRef();
    const { courseSlug } = useParams();

    const handleLessonChange = (field, value) => {
        setLessonData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuestionChange = (field, value) => {
        setCurrentQuestion(prev => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...currentQuestion.options];

        if (field === 'is_correct' && value) {
            // Uncheck all other options
            updatedOptions.forEach((opt, i) => {
                opt.is_correct = i === index;
            });
        } else {
            updatedOptions[index][field] = value;
        }

        setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
    };

    const addOrUpdateQuestion = () => {
        setQuestionError('');
        // Validation
        if (!currentQuestion.timestamp || !currentQuestion.question_text) {
            setQuestionError('Please fill in timestamp and question text');
            return;
        }

        if (currentQuestion.timestamp <= 0) {
            setQuestionError("Provide valid timestamp");
            return;
        }

        const filledOptions = currentQuestion.options.filter(opt => opt.option_text.trim() !== '');
        if (filledOptions.length < 2) {
            setQuestionError('Please provide at least 2 options');
            return;
        }

        const hasCorrectAnswer = currentQuestion.options.some(opt => opt.is_correct);
        if (!hasCorrectAnswer) {
            setQuestionError('Please select a correct answer')
            return;
        }

        const questionToAdd = {
            ...currentQuestion,
            options: currentQuestion.options.filter(opt => opt.option_text.trim() !== '')
        };

        if (editingQuestionIndex !== null) {
            const updatedQuestions = [...lessonData.questions];
            updatedQuestions[editingQuestionIndex] = questionToAdd;
            setLessonData(prev => ({ ...prev, questions: updatedQuestions }));
            setEditingQuestionIndex(null);
        } else {
            setLessonData(prev => ({
                ...prev,
                questions: [...prev.questions, questionToAdd]
            }));
        }

        // Reset form
        setCurrentQuestion({
            timestamp: '',
            question_text: '',
            options: [
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false }
            ]
        });
        setShowQuestionForm(false);
    };

    const editQuestion = (index) => {
        setCurrentQuestion(lessonData.questions[index]);
        setEditingQuestionIndex(index);
        setShowQuestionForm(true);
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = lessonData.questions.filter((_, i) => i !== index);
        setLessonData(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const onSubmit = async () => {
        try {
            const { status } = await api.post(`course/${courseSlug}/lessons/create/`, lessonData);
            if (status === 200) {
                setLessonData({
                    title: '',
                    video_id: '',
                    order: 1,
                    about: '',
                    questions: []
                })

                setCurrentQuestion({
                    timestamp: '',
                    question_text: '',
                    options: [
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false }
                    ]
                })

                showSuccess(toast, "Lesson added");

            }

        } catch (err) {
            console.log(err);
            if (err.request && !err.response) {
                showNetworkError(toast);
            } else {
                const msg = err.response?.data?.message;
                if (msg) setLessonError(msg);
            }

        }
    };

    const handleSubmit = () => {
        setLessonError("");

        if (!lessonData.title || !lessonData.video_id) {
            setLessonError("Please fill all required fields")
            return;
        }
        onSubmit();
    };

    const cancelQuestionForm = () => {
        setShowQuestionForm(false);
        setEditingQuestionIndex(null);
        setCurrentQuestion({
            timestamp: '',
            question_text: '',
            options: [
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false }
            ]
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <Toast ref={toast} />
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="md:text-2xl font-bold text-slate-800 mb-2">Create New Lesson</h1>
                        <p className="text-faded-text">Add lesson details and interactive quiz questions</p>
                    </div>
                    <p className='text-sm mb-4 flex items-center gap-1 cursor-pointer' onClick={() => navigate(-1)}>
                        <MoveLeft size={15} />
                        Back to lessons
                    </p>
                </div>

                {lessonError && <ErrorAlert colseFunction={() => setLessonError('')} error={lessonError} />}

                <div className="space-y-6">
                    {/* Main Lesson Details Card */}

                    <LessonForm lessonData={lessonData} handleLessonChange={handleLessonChange} />

                    {/* Quiz Questions Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-800">Quiz Questions</h2>
                                    <p className="text-sm text-slate-600">Add interactive questions at specific timestamps</p>
                                </div>
                            </div>

                            {!showQuestionForm && (
                                <button
                                    type="button"
                                    onClick={() => setShowQuestionForm(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0A2472] text-white rounded-xl hover:bg-[#0A2472]/90 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                </button>
                            )}
                        </div>

                        {/* Question Form */}
                        {showQuestionForm && <QuestionForm
                            handleOptionChange={handleOptionChange}
                            handleQuestionChange={handleQuestionChange}
                            setQuestionError={setQuestionError}
                            cancelQuestionForm={cancelQuestionForm}
                            addOrUpdateQuestion={addOrUpdateQuestion}
                            editingQuestionIndex={editingQuestionIndex}
                            questionError={questionError}
                            currentQuestion={currentQuestion}
                        />}

                        {/* Questions List */}
                        {lessonData.questions.length > 0 ? (
                            <div className="space-y-3">
                                {lessonData.questions.map((question, index) => (
                                    <div
                                        key={index}
                                        className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-[#0A2472] text-white text-xs font-medium rounded-full">
                                                        {formatTime(parseInt(question.timestamp))}
                                                    </span>
                                                    <h4 className="font-medium text-slate-800">{question.question_text}</h4>
                                                </div>
                                                <div className="pl-2 space-y-1">
                                                    {question.options.map((option, optIndex) => (
                                                        <div
                                                            key={optIndex}
                                                            className={`text-sm flex items-center gap-2 ${option.is_correct ? 'text-green-600 font-medium' : 'text-slate-600'
                                                                }`}
                                                        >
                                                            {option.is_correct && <CheckCircle className="w-4 h-4" />}
                                                            <span>{option.option_text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => editQuestion(index)}
                                                    className="p-2 text-slate-600 hover:text-[#0A2472] hover:bg-white rounded-lg transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteQuestion(index)}
                                                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <HelpCircle className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600">No questions added yet</p>
                                <p className="text-sm text-slate-500 mt-1">Add interactive quiz questions to engage your students</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            type="button"
                            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="px-8 py-3 rounded-xl bg-[#0A2472] text-white hover:bg-[#0A2472]/90 transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                            Create Lesson
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLesson;