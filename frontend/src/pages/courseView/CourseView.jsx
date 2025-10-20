import './courseView.css';

import { useState, useEffect } from 'react';

import { ChevronLeft, Download, MessageSquare, Star } from "lucide-react";

import { Link, NavLink, Outlet, useOutletContext, useParams, useNavigate } from "react-router-dom";

import { usePrivateApi } from '../../hooks/usePrivateApi';

import LessonCard from "./LessonCard";
import ActionCard from "./ActionCard";
import Error from '../../components/error/Error';

const CourseView = () => {

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [error, setError] = useState("");

    const api = usePrivateApi();
    const navigate = useNavigate();
    const { courseSlug } = useParams();
    const { enrolledCourses } = useOutletContext();

    useEffect(() => {
        setCourse(enrolledCourses?.find((c) => c.slug === courseSlug));
    }, [enrolledCourses, courseSlug]);

    useEffect(() => {
        const getLessons = async (retries = 2, delay = 500) => {
            try {
                const response = await api.get(`course/get-lessons/${course.id}`);
                setLessons(response.data);
                setError(null);
            } catch (err) {
                if (retries > 0) {
                    console.log(`Retrying... attempts left: ${retries}`);
                    setTimeout(() => getLessons(retries - 1, delay), delay);
                } else {
                    console.log(err);
                    if (err.response?.status === 404) {
                        setError("No Lessons found...");
                        return;
                    }
                    setError("Unable to get lessons...");
                }
            }
        };

        if (course) {
            getLessons();
        }

    }, [course]);

    useEffect(() => {
        if (course?.lastViewed?.slug) {
            navigate(`lessons/${course.lastViewed.slug}`, { replace: true });
        } else if (course && lessons.length > 0) {
            navigate(`lessons/${lessons[0].slug}`, { replace: true });
        }
    }, [course, lessons]);

    if (error) return <Error message={error} />

    return (
        <div className="course-view flex">
            <Outlet />

            {/* SIDE PANEL */}
            <div className="ml-3 border-l border-l-gray-300 bg-white w-[25%] fixed lg:static right-0 translate-x-full  lg:translate-x-0 z-30">
                <div className="px-6 py-5 border-b border-b-gray-300">
                    <Link to="/student/courses">
                        <button className="px-2 py-1 text-xs text-primary border-1 border-primary rounded-sm flex items-center cursor-pointer">
                            <ChevronLeft className="text-primary w-4" />
                            Back to Course
                        </button>
                    </Link>
                    <h2 className="font-semibold text-md md:text-lg mt-4 ">{course?.title}</h2>
                    <div className="progress-bar w-full bg-gray-400 h-3 rounded-full mt-3 relative">
                        <div
                            className="progress absolute bg-primary h-3 rounded-l-full"
                            style={{ width: `${Math.round(course?.progress)}%` }}>
                        </div>
                    </div>
                    <p className="text-xs font-medium mt-2">{course?.progress}% Completed</p>
                </div>

                <div className="overflow-y-scroll h-[50vh]">
                    {
                        lessons.map((lesson) => (
                            <NavLink to={`lessons/${lesson.slug}`} key={lesson.id}>
                                {({ isActive }) => (
                                    <LessonCard
                                        title={lesson.title}
                                        completed={lesson.completed}
                                        activeLesson={isActive}
                                    />
                                )}
                            </NavLink>
                        ))
                    }
                    {/* <LessonCard title={"Lesson 1 | Fundamentals of Linux"} activeLesson={true} completed={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} completed={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} completed={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} /> */}
                </div>

                <div className="p-4 mt-5">
                    <h3 className="font-medium">Quick Actions</h3>
                    <ActionCard text="Download All Materials" icon={Download} />
                    <ActionCard text="Ask Instructor" icon={MessageSquare} />
                    <ActionCard text="Rate Course" icon={Star} />
                </div>
            </div>
        </div>
    );
};

export default CourseView;