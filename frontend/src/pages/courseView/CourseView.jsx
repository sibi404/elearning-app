import './courseView.css';

import YouTube from "react-youtube";
import { useState } from 'react';

import { CircleCheckBig, ChevronLeft, Download, MessageSquare, Star } from "lucide-react";

import { Link } from "react-router-dom";

import LessonCard from "./LessonCard";
import ActionCard from "./ActionCard";
import NavTabs from '../../components/NavTabs/NavTabs';
import CourseOverview from './CourseOverview';
import CourseMaterials from './CourseMaterials';
import CourseAssignments from './CourseAssignments';
import Notes from './Notes';
import Discussion from './Discussion';

const CourseView = () => {

    const [activeTab, setActiveTab] = useState(0);

    const opts = {
        width: "100%",
        height: "100%",
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
    };

    return (
        <div className="course-view flex">
            <div className="w-full lg:w-[75%] p-1 lg:p-5 lg:pr-0">
                <div className="video-wrapper w-full aspect-video relative">
                    <YouTube
                        videoId="I7DZP4rVQOU"
                        opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: { autoplay: 0 }
                        }}
                        className="absolute top-0 left-0 w-full h-full "
                    />
                </div>
                <div className='px-2'>
                    <div className="flex items-center justify-between flex-col sm:flex-row mt-5">
                        <div className='w-full sm:w-auto'>
                            <h3 className="font-semibold text-text-black sm:text-xl">Lesson 1 <span className="font-normal">|</span> Fundamentals of Linux</h3>
                            <p className="text-faded-text text-xs lg:text-sm">by Sara Johnson</p>
                        </div>
                        <button
                            className="px-4 py-2 w-full sm:w-auto mt-2 sm:mt-0 rounded-md bg-primary text-sm font-medium text-white flex items-center justify-center gap-2 cursor-pointer">
                            Mark as complete
                            <CircleCheckBig className="w-4 font-medium" color="#ffffff" />
                        </button>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <NavTabs
                    tabs={["Overview", "Materials", "Assignments", "Notes", "Discussion"]}
                    setActiveTab={setActiveTab}
                />
                <div className='px-5'>
                    {activeTab === 0 && (
                        <CourseOverview />
                    )}
                    {activeTab === 1 && (
                        <CourseMaterials />
                    )}

                    {activeTab === 2 && (
                        <CourseAssignments />
                    )}

                    {activeTab === 3 && (
                        <Notes />
                    )}

                    {activeTab === 4 && (
                        <Discussion />
                    )}
                </div>

            </div>

            {/* SIDE PANEL */}
            <div className="ml-3 border-l border-l-gray-300 bg-white w-[25%] fixed lg:static right-0 translate-x-full  lg:translate-x-0 z-30">
                <div className="px-6 py-5 border-b border-b-gray-300">
                    <Link to="/student/courses">
                        <button className="px-2 py-1 text-xs text-primary border-1 border-primary rounded-sm flex items-center cursor-pointer">
                            <ChevronLeft className="text-primary w-4" />
                            Back to Course
                        </button>
                    </Link>
                    <h2 className="font-semibold text-md md:text-lg mt-4 ">Linux for Beginners</h2>
                    <div className="progress-bar w-full bg-gray-400 h-3 rounded-full mt-3 relative">
                        <div className="progress absolute bg-primary w-[20%] h-3 rounded-l-full"></div>
                    </div>
                    <p className="text-xs font-medium mt-2">20% Completed</p>
                </div>

                <div className="overflow-y-scroll h-[50vh]">
                    <LessonCard title={"Lesson 1 | Fundamentals of Linux"} activeLesson={true} completed={true} />
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
                    <LessonCard title={"Lesson 2 | Basic Linux Commands"} activeLesson={false} locked={true} />
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