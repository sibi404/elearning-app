import { Users } from "lucide-react";

const CourseInsightCard = ({ title, icon: Icon, value }) => {
    return (
        <div className="flex items-center justify-between gap-2 bg-primary rounded-xl text-white py-4 sm:py-6 px-6 md:px-10 w-full sm:w-[33%] mt-2">
            <div className="bg-white rounded-full p-3 md:p-4">
                <Icon size={28} strokeWidth={3} className="text-primary" />
            </div>
            <div className="text-center">
                <span className="text-xl md:text-3xl font-bold">{value}</span>
                <p className="text-xs md:text-sm font-medium">{title}</p>
            </div>
        </div>
    );
};

export default CourseInsightCard;