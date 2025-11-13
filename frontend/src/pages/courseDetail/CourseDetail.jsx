import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { BookText, MessagesSquare, BookOpen, BrainCircuit, TrendingUp, Users } from "lucide-react";

import BackButton from "../../components/backButton/BackButton";
import CourseInsightCard from "./courseInsightCard/CourseInsightCard";
import NavTabs from "../../components/NavTabs/NavTabs";

import { usePrivateApi } from "../../hooks/usePrivateApi";

const CourseDetail = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [courseDetails, setCourseDetails] = useState({});

    const { courseSlug } = useParams();
    const api = usePrivateApi();

    useEffect(() => {
        const getCourseDetails = async () => {
            try {
                const { data } = await api.get(`course/${courseSlug}/`);
                setCourseDetails(data);

            } catch (err) {
                console.log(err);
            }
        };

        getCourseDetails();
    }, []);
    return (
        <main className="px-2 md:px-8 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{courseDetails.title}</h1>
                <Link to="/teacher">
                    <BackButton text="Back to Dashboard" />
                </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-7">
                <CourseInsightCard title={"Total Students"} value={courseDetails.total_students} icon={Users} />
                <CourseInsightCard title={"Avg. Completion"} value={`${courseDetails.overall_progress}%`} icon={TrendingUp} />
                <CourseInsightCard title={"Total Lessons"} value={courseDetails.total_lessons} icon={BookOpen} />
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