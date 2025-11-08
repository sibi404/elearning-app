import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BookText, MessagesSquare, BookOpen, BrainCircuit, TrendingUp, Users } from "lucide-react";

import BackButton from "../../components/backButton/BackButton";
import CourseInsightCard from "./courseInsightCard/CourseInsightCard";
import NavTabs from "../../components/NavTabs/NavTabs";
import StudentOverViewCard from "./studentOverviewCard/StudentOverviewCard";

const CourseDetail = () => {
    const [activeTab, setActiveTab] = useState(0);
    return (
        <main className="px-2 md:px-8 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Advanced Mathematics</h1>
                <Link to="/teacher">
                    <BackButton text="Back to Dashboard" />
                </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-7">
                <CourseInsightCard title={"Total Students"} value={35} icon={Users} />
                <CourseInsightCard title={"Avg. Completion"} value={"50%"} icon={TrendingUp} />
                <CourseInsightCard title={"Total Lessons"} value={5} icon={BookOpen} />
            </div>
            <NavTabs
                tabs={["Students", "Lessons", "Assignments", "Discussion"]}
                icons={[Users, BookText, BrainCircuit, MessagesSquare]}
                links={["students", "lessons", "assignments", "discussion"]}
                setActiveTab={setActiveTab}
            />
            <div className="mt-5">
                <Outlet />
            </div>
        </main>
    )
};

export default CourseDetail;