import { CheckCircle, X } from "lucide-react";

import ErrorAlert from "./ErrorAlert";


const QuestionForm = ({
    setQuestionError,
    handleQuestionChange,
    handleOptionChange,
    cancelQuestionForm,
    addOrUpdateQuestion,
    editingQuestionIndex,
    questionError,
    currentQuestion
}) => {
    return (
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-[#0A2472]/20">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                    {editingQuestionIndex !== null ? 'Edit Question' : 'New Question'}
                </h3>
                <button
                    type="button"
                    onClick={cancelQuestionForm}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Error Message */}
            {questionError && <ErrorAlert colseFunction={() => setQuestionError('')} error={questionError} />}

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Timestamp (seconds)
                        </label>
                        <input
                            type="number"
                            value={currentQuestion.timestamp}
                            onChange={(e) => handleQuestionChange('timestamp', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                            placeholder="120"
                            min="0"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Question Text
                        </label>
                        <input
                            type="text"
                            value={currentQuestion.question_text}
                            onChange={(e) => handleQuestionChange('question_text', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                            placeholder="What is the primary purpose of useState?"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Answer Options (Select the correct one)
                    </label>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleOptionChange(index, 'is_correct', true)}
                                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${option.is_correct
                                        ? 'bg-green-500 border-green-500'
                                        : 'bg-white border-slate-300 hover:border-[#0A2472]'
                                        }`}
                                >
                                    {option.is_correct && <CheckCircle className="w-4 h-4 text-white" />}
                                </button>
                                <input
                                    type="text"
                                    value={option.option_text}
                                    onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0A2472] focus:border-transparent transition-all outline-none"
                                    placeholder={`Option ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={cancelQuestionForm}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={addOrUpdateQuestion}
                        className="px-5 py-2.5 rounded-xl bg-[#0A2472] text-white hover:bg-[#0A2472]/90 transition-all shadow-md hover:shadow-lg"
                    >
                        {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionForm;