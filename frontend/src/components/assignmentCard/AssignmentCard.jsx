import { CircleCheck, Calendar, Clock, ClockFading, Upload } from "lucide-react";
import { useState } from "react";

const AssignmentCard = ({ assignment, dueDate, submitDate, setShowAssignmentModal, setSelectedAssignment }) => {
    const { title, description, submitted, graded, grade, feedback } = assignment;

    const [showFeedback, setShowFeedback] = useState(false);

    return (
        <div className="assignment-card container-border px-4 py-2 mt-3">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm sm:text-base py-2">{title}</h3>
                <StatusBadge submitted={submitted} />
            </div>
            <p className="text-faded-text text-sm">{description}</p>
            <div className="flex sm:items-center flex-col sm:flex-row sm:gap-5 text-faded-text text-sm py-2">
                <p className="flex items-center gap-1">
                    <Calendar className="w-4" />
                    Due : {dueDate}
                </p>
                {
                    submitted ?
                        <p className="flex items-center gap-1">
                            <Clock className="w-4" />
                            Submitted : {submitDate}
                        </p>
                        : ""
                }

            </div>
            <div className="flex sm:items-center justify-between flex-col sm:flex-row">
                <div className="flex items-center gap-3 text-xs sm:text-sm py-3">
                    {
                        graded ?
                            <>
                                <p className="text-text-black font-medium">Grade:</p>
                                <div className="text-[10px] sm:text-xs font-medium bg-blue-200 px-4 py-1 rounded-full flex item-center gap-1">
                                    <span className="text-primary">{grade}</span>
                                </div>
                            </> : submitted ?
                                <p>Not graded yet</p> :
                                <p>No submission yet</p>
                    }
                </div>
                {
                    submitted ?
                        <button className={`text-sm font-medium container-border px-4 py-2 ${graded ? "cursor-pointer" : "cursor-not-allowed opacity-50"} hover:text-white hover:bg-primary`}
                            disabled={!graded}
                            onClick={() => setShowFeedback(prev => !prev)}>
                            {showFeedback ? "Hide Feedback" : "View Feedback"}
                        </button>
                        :
                        <SubmitButton
                            onClick={() => {
                                setSelectedAssignment({ ...assignment, dueDate });
                                setShowAssignmentModal(true);
                            }}
                        />
                }
            </div>
            {
                showFeedback &&
                <div className="mt-3 p-3 border-t border-t-gray-300">
                    <h5 className="font-semibold text-sm">Feedback</h5>
                    <p className="mt-4 text-sm">{feedback}</p>
                </div>
            }
        </div>
    );
};



const StatusBadge = ({ submitted }) => {
    const statusStyles = submitted ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800";

    return (
        <div className={`text-xs font-medium p-2 sm:px-4 sm:py-1 rounded-full flex items-center gap-1 ${statusStyles}`}>
            {submitted ? <CircleCheck className="w-3 h-3" /> : <ClockFading className="w-3 h-3" />}
            <span className="hidden sm:inline">{submitted ? "Submitted" : "Pending"}</span>
        </div>
    );
};

const SubmitButton = ({ onClick }) => {
    return (
        <button className="text-sm font-medium px-4 py-2 rounded-lg cursor-pointer bg-primary text-white flex items-center justify-center gap-2"
            onClick={onClick}
        >
            <Upload className="w-5" />
            Submit Now
        </button>
    );
};

export default AssignmentCard;