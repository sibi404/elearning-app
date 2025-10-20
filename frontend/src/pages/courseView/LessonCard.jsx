import { CircleCheckBig, CirclePlay, Lock } from "lucide-react";

const LessonCard = ({ title, activeLesson, completed, locked }) => {
    return (
        <div className={`flex items-center gap-3 p-4 cursor-pointer ${activeLesson ? "border-l-2 border-l-primary bg-primary-fade" : ""}`}>
            {completed ?
                <CircleCheckBig className={`w-5 font-medium shrink-0 ${completed ? "text-green-500" : ""}`} />
                :
                locked ?
                    <Lock className={`w-5 font-medium shrink-0 ${activeLesson ? "text-primary" : ""}`} /> :
                    <CirclePlay className={`w-5 font-medium shrink-0 ${activeLesson ? "text-primary" : ""}`} />
            }

            <p className={`text-sm font-medium ${activeLesson ? "text-primary" : locked ? "text-faded-text" : ""}`}>{title}</p>
        </div>
    );
};

export default LessonCard;

