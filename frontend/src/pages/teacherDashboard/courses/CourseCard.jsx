import { Eye, SquarePen, ChartColumn } from "lucide-react";
import { NavLink } from "react-router-dom";

const CourseCard = ({ title, lastUpdate, students, videos, materials, progress, active, slug }) => {
    return (
        <div className="container-border p-5 mt-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-md">{title}</h2>
                    <p className="mt-1 text-xs text-faded-text font-light">Last updated {lastUpdate}</p>
                </div>
                <p className={`text-xs font-semibold px-3 py-1 ${active ? "bg-green-700" : "bg-red-700"} text-white rounded-full`}>
                    {active ? "Active" : "Inactive"}
                </p>
            </div>
            <div className="mt-3 flex items-center justify-evenly">
                <StatItem value={students} label="Students" color="text-blue-500" />
                <StatItem value={videos} label="Videos" color="text-green-500" />
                <StatItem value={materials} label="Materials" color="text-yellow-500" />
                <StatItem value={progress} label="Avg Progress" color="text-blue-500" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold mt-5">
                <NavLink to={slug}>
                    <ActionButtons label="View" icon={Eye} />
                </NavLink>
                <ActionButtons label="Edit" icon={SquarePen} />
                <ActionButtons label="Analytics" icon={ChartColumn} />

            </div>
        </div>
    );
};

export default CourseCard;


const StatItem = ({ value, label, color }) => {
    return (
        <div className="text-center">
            <h3 className={`${color} font-bold text-lg md:text-2xl`}>{value}</h3>
            <p className="text-xs text-faded-text">{label}</p>
        </div>
    );
};

const ActionButtons = ({ label, icon: Icon }) => {
    return (
        <div className="container-border px-3 py-2 flex items-center justify-center gap-1 cursor-pointer hover:bg-primary-fade">
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </div>
    );
};
