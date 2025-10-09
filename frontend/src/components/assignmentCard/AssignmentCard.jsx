import { CircleCheck, Calendar, Clock, ClockFading, Upload } from "lucide-react";

const AssignmentCard = ({ title, description, dueDate, submitDate, status }) => {

    return (
        <div className="assignment-card container-border px-4 py-2 mt-3">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm sm:text-base py-2">{title}</h3>
                <StatusBadge status={status} />
            </div>
            <p className="text-faded-text text-sm">{description}</p>
            <div className="flex sm:items-center flex-col sm:flex-row sm:gap-5 text-faded-text text-sm py-2">
                <p className="flex items-center gap-1">
                    <Calendar className="w-4" />
                    Due : {dueDate}
                </p>
                {
                    status === "Submitted" ?
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
                        status === "Submitted" ?
                            <>
                                <p className="text-text-black font-medium">Grade:</p>
                                <div className="text-[10px] sm:text-xs font-medium bg-blue-200 px-4 py-1 rounded-full flex item-center gap-1">
                                    <span className="text-primary">85/100</span>
                                </div>
                            </> :
                            <p>No submission yet</p>
                    }
                </div>
                {
                    status === "Submitted" ?
                        <FeedbackButton />
                        :
                        <SubmitButton />
                }
            </div>
        </div>
    );
};



const StatusBadge = ({ status }) => {
    const statusStyles = {
        Submitted: "bg-green-200 text-green-800",
        Pending: "bg-yellow-200 text-yellow-800"
    };

    return (
        <div className={`text-xs font-medium p-2 sm:px-4 sm:py-1 rounded-full flex items-center gap-1 ${statusStyles[status]}`}>
            {status === "Submitted" ? <CircleCheck className="w-3 h-3" /> : <ClockFading className="w-3 h-3" />}
            <span className="hidden sm:inline">{status}</span>
        </div>
    );
};

const FeedbackButton = () => {
    return (
        <button className="text-sm font-medium container-border px-4 py-2 cursor-pointer hover:text-white hover:bg-primary">View Feedback</button>
    );
};

const SubmitButton = () => {
    return (
        <button className="text-sm font-medium px-4 py-2 rounded-lg cursor-pointer bg-primary text-white flex items-center justify-center gap-2">
            <Upload className="w-5" />
            Submit Now
        </button>
    );
};

export default AssignmentCard;