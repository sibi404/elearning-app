import { FileText, Calendar } from "lucide-react";

const AssignmentCard = ({ title, description, dueDate, lessonName, totalSubmission, gradedCount, pendingCount }) => {
    return (
        <div className="p-4 md:p-6 mt-3 container-border">
            <div>
                <h1 className="md:text-xl font-semibold">{title}</h1>
                <p className="text-faded-text text-xs md:text-sm mt-1">{description}</p>
                <div className="text-faded-text text-xs mt-3.5">
                    <div className="flex items-center gap-2.5">
                        <Calendar className="w-4" />
                        <p>{dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FileText className="w-4" />
                        <p>{lessonName}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3.5">
                <InsightItem value={totalSubmission} title={"Submission"} />
                <InsightItem value={gradedCount} title={"Graded"} />
                <InsightItem value={pendingCount} title={"Pending"} />

            </div>
        </div>
    );
};


export default AssignmentCard;

const InsightItem = ({ value, title }) => {
    const textColor = title === "Graded" ? "text-green-700" : title === "Pending" ? "text-red-700" : ""
    return (
        <div className="flex items-center justify-center flex-col">
            <h3 className={`font-bold ${textColor}`}>{value}</h3>
            <p className="text-xs md:text-sm text-faded-text">{title}</p>
        </div>
    );
};