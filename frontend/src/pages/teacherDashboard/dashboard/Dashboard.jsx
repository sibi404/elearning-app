import InsightCard from "../../../components/insightCard/InsightCard";
import CoursePerformanceCard from "../../../components/coursePerformanceCard/CoursePerformanceCard";

import openBookIcon from '../../../assets/icons/open_book.png'
import usersIcon from '../../../assets/icons/users.png';
import videoIcon from '../../../assets/icons/video.png';

import { usePrivateApi } from "../../../hooks/usePrivateApi";
import { showNetworkError } from "../../../utils/toast/toastFunctions";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

const Dashboard = () => {
    const api = usePrivateApi();
    const toast = useRef();

    const [loading, setLoading] = useState(false);
    const [coursePerformance, setCoursePerformance] = useState([]);

    const getCoursePerformance = async () => {
        try {
            const { data } = await api.get('course/teaching-courses/');
            setCoursePerformance(data);
        } catch (err) {
            console.log(err);
            if (err.request && !err.response) {
                showNetworkError(toast);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getCoursePerformance();
    }, []);


    if (loading) {
        return (
            <main className="min-h-[70vh] mt-6 px-6 py-3 flex items-center justify-center">
                <div>
                    Loading...
                </div>

            </main>
        )
    }

    return (
        <main className="min-h-[70vh] mt-6 px-6 py-3">
            <Toast ref={toast} />
            <div className='flex items-center justify-between flex-wrap'>
                <InsightCard title={"Active Courses"} value={6} background={"blue-gradient"} img={openBookIcon} />
                <InsightCard title={"Total Students"} value={"150"} background={"green-gradient"} img={usersIcon} />
                <InsightCard title={"Videos Uploaded"} value={100} background={"orange-gradient"} img={videoIcon} />
            </div>
            <div className="mt-5">
                <h2 className="text-2xl font-semibold">Course Preformance</h2>
                <p className="text-faded-text font-light text-sm">Completion rates across all your courses</p>
                <div className="mt-5">
                    {
                        coursePerformance.map((course) => (
                            <CoursePerformanceCard key={course.id}
                                courseTitle={course.title}
                                completion={course.overall_progress}
                                studentsCount={course.total_students}
                            />
                        ))
                    }
                </div>
            </div>
        </main>
    );
};

export default Dashboard;