import { FileText, Calendar } from "lucide-react";

const AssignmentCard = () => {
    return (
        <div className="p-6 mt-3 container-border">
            <div>
                <h1 className="text-xl font-semibold">React Optimization Assignemnt</h1>
                <p className="text-faded-text text-sm mt-1">Optimize a React application using memo, useMemo, and useCallback hooks to improve performance.</p>
                <div className="text-faded-text text-xs mt-3.5">
                    <div className="flex items-center gap-2.5">
                        <Calendar className="w-4" />
                        <p>Due : Jan 20, 2026</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FileText className="w-4" />
                        <p>Advanced React Hook</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3.5">
                <InsightItem value={12} title={"Submission"} />
                <InsightItem value={5} title={"Graded"} />
                <InsightItem value={7} title={"Pending"} />

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
            <p className="text-sm text-faded-text">{title}</p>
        </div>
    );
};