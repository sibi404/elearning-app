import { Users } from "lucide-react";

const CoursePerformanceCard = ({ courseTitle, completion, studentsCount }) => {
    const getAccentColor = () => {
        if (completion >= 75) return "text-emerald-600";
        if (completion >= 50) return "text-blue-600";
        if (completion >= 25) return "text-amber-600";
        return "text-faded-text";
    };
    return (
        <div className="p-5 container-border mt-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{courseTitle}</h3>
                    <p className="flex items-center gap-2 text-xs text-faded-text  mt-2">
                        <Users size={16} />
                        {studentsCount} students enrolled
                    </p>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-right">{completion}%</h1>
                    <p className="text-xs text-faded-text mt-2">Avg completion</p>
                </div>
            </div>
            <div className="progress-bar w-full bg-gray-400 h-2 rounded-full mt-4 relative">
                <div
                    className="progress absolute bg-primary h-full rounded-l-full"
                    style={{ width: `${Math.round(completion)}%` }}>
                </div>
            </div>
            <div className={`mt-3 text-xs font-medium text-right ${getAccentColor()}`}>
                {completion === 0 && "Not started"}
                {completion > 0 && completion < 25 && "Just getting started"}
                {completion >= 25 && completion < 50 && "Making progress"}
                {completion >= 50 && completion < 75 && "More than halfway!"}
                {completion >= 75 && completion < 100 && "Almost there!"}
                {completion === 100 && "Completed!"}
            </div>
        </div>
    );
};

export default CoursePerformanceCard;